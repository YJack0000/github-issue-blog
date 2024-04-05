"use server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql"
const GITHUB_BLOG_POST_OWNER = process.env.GITHUB_BLOG_POST_OWNER
const GITHUB_BLOG_POST_REPO = process.env.GITHUB_BLOG_POST_REPO

export const getAuthor = async (): Promise<string> => {
    const session = await getServerSession(authOptions)
    const query = `
      query {
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
            owner { 
                login
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
        throw new Error("Failed to fetch author data")
    }

    const data = await response.json()
    if (data.errors) {
        throw new Error(data.errors[0].message)
    }

    return data.data.repository.owner.login
}
