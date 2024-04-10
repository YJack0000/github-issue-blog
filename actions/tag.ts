"use server"
import { getServerSession } from "next-auth/next"
import { getAuthor, getUserName, getRepositoryId } from "@/actions/github"
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
                Authorization: `bearer ${session?.accessToken ?? process.env.GITHUB_PAT}`,
            },
        },
    })

    if (errors) {
        console.error("GraphQL errors:", errors)
        throw new Error(errors.map((error) => error.message).join(", "))
    }

    return data.repository.labels.edges.map((edge: any) => edge.node.name)
}

type CreateTagResponse = {
    status: string
    message: string
}

export const createTag = async (name: string): Promise<CreateTagResponse> => {
    if ((await getUserName()) !== (await getAuthor())) {
        return { status: "Unauthorized", message: "未認證使用者" }
    }

    try {
        const session = await getServerSession(authOptions)
        const repositoryId = await getRepositoryId()
        console.log("repositoryId: ", repositoryId)
        const { errors } = await client.mutate({
            mutation: CREATE_TAG,
            variables: { repositoryId, name },
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
    } catch (error) {
        console.error("An error occurred when createTag info: ", error)
        return { status: "Failed", message: "未預期錯誤" }
    }

    return { status: "Success", message: "新增標籤成功" }
}
