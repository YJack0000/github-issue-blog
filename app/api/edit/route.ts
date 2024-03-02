import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAuthor } from "@/lib/github"

const createPost = async (title: string, body: string, labels: string[]) => {
    console.log("Creating post")
}

export async function POST(request: NextRequest) {
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
        await createPost(form.title, form.body, form.labels)
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
