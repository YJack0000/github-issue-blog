import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAuthor } from "@/lib/github/utils"

const _createPost = async (title: string, body: string, labels: string[]) => {
    console.log("Creating post")
}

export async function createPost(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            {
                status: 403,
            }
        )
    }

    if (session.user.name !== (await getAuthor())) {
        return NextResponse.json(
            { message: "Unauthorized" },
            {
                status: 403,
            }
        )
    }

    const form = (await request.json()) as any
    try {
        await _createPost(form.title, form.body, form.labels)
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating post" },
            {
                status: 500,
            }
        )
    }

    return NextResponse.json({ message: "Success" })
}

const _updatePost = async (
    id: number,
    title: string,
    body: string,
    labels: string[]
) => {
    console.log("Updating post")
}

export async function updatePost(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            {
                status: 403,
            }
        )
    }
    if (session.user.name !== (await getAuthor())) {
        return NextResponse.json(
            { message: "Unauthorized" },
            {
                status: 403,
            }
        )
    }
    const form = (await request.json()) as any
    try {
        await _updatePost(form.id, form.title, form.body, form.labels)
    } catch (error) {
        return NextResponse.json(
            { message: "Error updating post" },
            {
                status: 500,
            }
        )
    }
    return NextResponse.json({ message: "Success" })
}

const _deletePost = async (id: number) => {
    console.log("Deleting post")
}

export async function deletePost(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            {
                status: 403,
            }
        )
    }
    if (session.user.name !== (await getAuthor())) {
        return NextResponse.json(
            { message: "Unauthorized" },
            {
                status: 403,
            }
        )
    }
    const form = (await request.json()) as any
    try {
        await _deletePost(form.id)
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting post" },
            {
                status: 500,
            }
        )
    }
    return NextResponse.json({ message: "Success" })
}
