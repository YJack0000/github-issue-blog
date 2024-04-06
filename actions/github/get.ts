"use server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getClient } from "@/lib/apollo"
import { GET_POST_DATA, GET_POSTS } from "./graphql"

const GITHUB_PAT = process.env.GITHUB_PAT

const client = getClient()

export const fetchPosts = async (cursor?: string): Promise<PostPreview[]> => {
    const session = await getServerSession(authOptions)
    const { data, errors } = await client.query({
        query: GET_POSTS,
        variables: {
            after: cursor,
        },
        context: {
            headers: {
                Authorization: `bearer ${session?.accessToken ?? GITHUB_PAT}`,
            },
        },
    })

    if (errors) {
        console.error("GraphQL errors:", errors)
        throw new Error(errors.map((error) => error.message).join(", "))
    }

    return _postsMapper(data)
}

export const fetchPostData = async (id: string): Promise<Post> => {
    const session = await getServerSession(authOptions)

    const { data, errors } = await client.query({
        query: GET_POST_DATA,
        variables: { id },
        context: {
            headers: {
                Authorization: `bearer ${session?.accessToken ?? GITHUB_PAT}`,
            },
        },
    })

    if (errors) {
        console.error("GraphQL errors:", errors)
        throw new Error(errors.map((error) => error.message).join(", "))
    }

    return _postDataMapper(id, data)
}
const _postsMapper = (data: any): Promise<PostPreview[]> => {
    return data.repository.issues.edges.map((edge: any) => {
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
