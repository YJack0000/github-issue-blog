"use server"

import {
    addCommentToIssue,
    closeIssue,
    createIssue,
    getAuthor,
    getFirstCommentId,
    getLabelIds,
    getRepositoryId,
    getUserName,
    updateComment,
    updateIssue,
    updateLabelsToIssue,
} from "@/actions/github"

const validatePost = (title: string, body: string): string | null => {
    if (!title) {
        return "標題為必填"
    }

    if (!body || body.length < 30) {
        return "內容過短"
    }

    return null
}

export type CreatePostRequest = {
    title: string
    description: string
    body: string
    tags: string[]
}

export type CreatePostResponse = {
    status: string
    message: string
    postId?: string
}

export async function createPost({
    title,
    description,
    body,
    tags,
}: CreatePostRequest): Promise<CreatePostResponse> {
    if ((await getUserName()) !== (await getAuthor())) {
        return { status: "Unauthorized", message: "Unauthorized" }
    }

    const validationError = validatePost(title, body)
    if (validationError)
        return {
            status: "Failed",
            message: validationError,
        }

    try {
        const repositoryId = await getRepositoryId()
        const issueId = await createIssue(repositoryId, title, description)
        const labelIds = await getLabelIds(tags)
        console.log("updateLabelsToIssue")
        await updateLabelsToIssue(issueId, labelIds)
        console.log("addCommentToIssue")
        await addCommentToIssue(issueId, body)

        return {
            status: "Success",
            message: "Post created successfully",
            postId: issueId,
        }
    } catch (error: any) {
        console.error("createPost error", error)
        return {
            status: "Failed",
            message: "未預期錯誤，請檢查 Log",
        }
    }
}

export type UpdatePostRequest = {
    id: string
    title: string
    description: string
    body: string
    tags: string[]
}

export type UpdatePostResponse = {
    status: string
    message: string
}

export async function updatePost({
    id,
    title,
    description,
    body,
    tags,
}: UpdatePostRequest): Promise<UpdatePostResponse> {
    if ((await getUserName()) !== (await getAuthor())) {
        return { status: "Unauthorized", message: "Unauthorized" }
    }

    const validationError = validatePost(title, body)
    if (validationError)
        return {
            status: "Failed",
            message: validationError,
        }

    try {
        const issueId = id
        console.log("getLabelIds")
        const labelIds = await getLabelIds(tags)
        console.log("updateIssue")
        await updateIssue(issueId, labelIds, title, description)
        console.log("getFirstCommentId")
        const firstCommentId = await getFirstCommentId(issueId)
        await updateComment(firstCommentId, body)
        return { status: "Success", message: "Post updated successfully" }
    } catch (error: any) {
        console.error("updatePost error", error)
        return {
            status: "Failed",
            message: "未預期錯誤，請檢查 Log",
        }
    }
}

export type DeletePostRequest = {
    id: string
}

export type DeletePostResponse = {
    status: string
    message: string
    postId?: string
}

export async function deletePost({
    id,
}: DeletePostRequest): Promise<DeletePostResponse> {
    if ((await getUserName()) !== (await getAuthor())) {
        return { status: "Unauthorized", message: "Unauthorized" }
    }

    try {
        await closeIssue(id)
        return {
            status: "Success",
            message: `Delete of post-${id} success! `,
            postId: id,
        }
    } catch (error: any) {
        console.error("deletePost error", error)
        return {
            status: "Failed",
            message: "未預期錯誤，請檢查 Log",
        }
    }
}
