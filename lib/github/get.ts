"use server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql"
const GITHUB_BLOG_POST_OWNER = process.env.GITHUB_BLOG_POST_OWNER
const GITHUB_BLOG_POST_REPO = process.env.GITHUB_BLOG_POST_REPO

export const fetchPosts = async (cursor?: string): Promise<PostPreview[]> => {
    const session = await getServerSession(authOptions)
    const after = cursor ? `after: "${cursor}",` : ""
    const query = `
      query {
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
          issues(${after} first: 3, states: [OPEN]) {
            edges {
              node {
                title
                number
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
            Authorization: `token ${session.accessToken}`,
        },
        body: JSON.stringify({ query }),
    })

    if (!response.ok) {
        throw new Error("Failed to fetch user data")
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
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
          issue(number: ${id}) {
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
      }`
    const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `token ${session.accessToken}`,
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

    return _postDataMapper(id, data)
}

const _postsMapper = (data: any): Promise<PostPreview[]> => {
    return data.data.repository.issues.edges.map((edge: any) => {
        const { title, number, createdAt, labels, author, body } = edge.node
        return {
            id: number,
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
        id: parseInt(id),
        author: {
            name: data.data.repository.issue.author.login,
            avatar: data.data.repository.issue.author.avatarUrl,
        },
        title: data.data.repository.issue.title,
        createdAt: data.data.repository.issue.createdAt,
        tags: data.data.repository.issue.labels.edges.map(
            (edge: any) => edge.node.name
        ),
        description: data.data.repository.issue.body,
        body: data.data.repository.issue.comments.edges[0].node.body,
        comments: data.data.repository.issue.comments.edges
            .slice(1)
            .map((edge: any) => {
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
