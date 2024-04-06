"use server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql"
const GITHUB_BLOG_POST_OWNER = process.env.GITHUB_BLOG_POST_OWNER
const GITHUB_BLOG_POST_REPO = process.env.GITHUB_BLOG_POST_REPO
const GITHUB_PAT = process.env.GITHUB_PAT

export const fetchPosts = async (cursor?: string): Promise<PostPreview[]> => {
    const session = await getServerSession(authOptions)
    const after = cursor ? `after: "${cursor}",` : ""
    const query = `
      query {
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
          issues(${after} first: 5, states: [OPEN], orderBy: {field: CREATED_AT, direction: DESC}) {
            edges {
              node {
                id
                title
                author {
                    login
                    avatarUrl(size: 100)
                }
                createdAt
                labels (first: 5) {
                  edges {
                    node {
                      name
                    }
                  }
                }
                body
              }
              cursor
            }
          }
        }
      }
    `

    const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `bearer ${session?.accessToken ?? GITHUB_PAT}`,
        },
        body: JSON.stringify({ query }),
    })

    if (!response.ok) {
        throw new Error("Failed to fetch post data")
    }

    const data = await response.json()

    if (data.errors) {
        console.log(data.errors[0].message)
        throw new Error(data.errors[0].message)
    }

    return _postsMapper(data)
}

export const fetchPostData = async (id: string): Promise<Post> => {
    const session = await getServerSession(authOptions)
    const query = `
        query {
          node(id: "${id}") {
            ... on Issue {
              title
              author {
                login
                avatarUrl(size: 100)
              }
              labels(first: 5) {
                edges {
                  node {
                    name
                  }
                }
              }
              body
              comments(first: 20) {
                edges {
                  node {
                    author {
                      login
                      avatarUrl(size: 100)
                    }
                    body
                    createdAt
                  }
                }
              }
            }
          }
        }
        `
    const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `bearer ${session?.accessToken ?? GITHUB_PAT}`,
        },
        body: JSON.stringify({ query }),
    })

    if (!response.ok) {
        throw new Error("Failed to fetch post data")
    }

    const data = await response.json()

    if (data.errors) {
        throw new Error(JSON.stringify(data))
    }

    return _postDataMapper(id, data.data)
}

const _postsMapper = (data: any): Promise<PostPreview[]> => {
    return data.data.repository.issues.edges.map((edge: any) => {
        const { id, title, createdAt, labels, author, body } = edge.node
        return {
            id: id,
            title,
            createdAt,
            author: {
                name: author.login,
                avatar: author.avatarUrl,
            },
            description: body,
            tags: labels.edges.map((edge: any) => edge.node.name),
            cursor: edge.cursor,
        }
    })
}

const _postDataMapper = (id: string, data: any): Post => {
    return {
        id: id,
        author: {
            name: data.node.author.login,
            avatar: data.node.author.avatarUrl,
        },
        title: data.node.title,
        createdAt: data.node.createdAt,
        tags: data.node.labels.edges.map((edge: any) => edge.node.name),
        description: data.node.body,
        body: data.node.comments.edges[0]?.node.body ?? "",
        comments: data.node.comments.edges.slice(1).map((edge: any) => {
            const { author, body, createdAt } = edge.node
            return {
                author: {
                    name: author.login,
                    avatar: author.avatarUrl,
                },
                body: body,
                createdAt: createdAt,
            }
        }),
    }
}
