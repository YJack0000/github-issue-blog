"use server"

import {
    addCommentToIssue,
    createIssue,
    deleteIssue,
    getAuthor,
    getLabelIds,
    getRepositoryId,
    getUserName,
    updateLabelsToIssue,
} from "@/actions/github/utils"

export type CreatePostRequest = {
    title: string
    description: string
    body: string
    tags: string[]
}

export type CreatePostResponse = {
    status: string
    message: string
}

export async function createPost({
    title,
    description,
    body,
    tags,
}: CreatePostRequest): Promise<CreatePostResponse> {
    if ((await getUserName()) !== (await getAuthor())) {
        throw new Error(
            JSON.stringify({ status: "Unauthorized", message: "Unauthorized" })
        )
    }

    const repositoryId = await getRepositoryId()
    const issueId = await createIssue(repositoryId, title, description)
    const labelIds = await getLabelIds(tags)
    await updateLabelsToIssue(issueId, labelIds)
    await addCommentToIssue(issueId, body)
    return { status: "Success", message: "Post created successfully" }
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
        throw new Error(
            JSON.stringify({ status: "Unauthorized", message: "Unauthorized" })
        )
    }

    const issueId = id
    const labelIds = await getLabelIds(tags)
    await updateLabelsToIssue(issueId, labelIds)
    await updateIssue(issueId, title, body)
    await updateFirstCommentOfIssue(issueId, description)

    return { status: "Success", message: "Post updated successfully" }
}

export type DeletePostRequest = {
    id: string
}

export type DeletePostResponse = {
    status: string
    message: string
}

export async function deletePost({
    id,
}: DeletePostRequest): Promise<DeletePostResponse> {
    if ((await getUserName()) !== (await getAuthor())) {
        throw new Error(
            JSON.stringify({ status: "Unauthorized", message: "Unauthorized" })
        )
    }

    await deleteIssue(id)
    return { status: "Success", message: `Delete of post-${id} success! ` }
}
