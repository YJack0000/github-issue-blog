"use server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/config/auth"
import { getClient } from "@/lib/apollo"
import { CREATE_TAG, GET_TAGS } from "@/graphql/github"

const client = getClient()

export const getTags = async (): Promise<string[]> => {
    const session = await getServerSession(authOptions)
    const { data, errors } = await client.query({
        query: GET_TAGS,
        context: {
            headers: {
                Authorization: `bearer ${session?.accessToken}`,
            },
        },
    })

    if (errors) {
        console.error("GraphQL errors:", errors)
        throw new Error(errors.map((error) => error.message).join(", "))
    }

    return data.repository.labels.edges.map((edge: any) => edge.node.name)
}

export const createTag = async (name: string): Promise<void> => {
    const session = await getServerSession(authOptions)
    const { errors } = await client.mutate({
        mutation: CREATE_TAG,
        variables: { name },
        context: {
            headers: {
                Authorization: `bearer ${session?.accessToken}`,
            },
        },
    })
    if (errors) {
        console.error("GraphQL errors:", errors)
        throw new Error(errors.map((error) => error.message).join(", "))
    }
}
