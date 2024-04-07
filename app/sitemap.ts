import { MetadataRoute } from "next"
import { getClient } from "@/lib/apollo"
import { GET_ALL_POSTS_ID } from "@/graphql/github"

const BASE_URL = "https://github-issue-blog-ashy.vercel.app"
const client = getClient()

async function getAllPostIds() {
    const { data } = await client.query({
        query: GET_ALL_POSTS_ID,
        context: {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_PAT}`,
            }
        }
    })
    const totalPosts = data.repository.issues.edges.length
    const sitemapIds = Array.from(
        { length: totalPosts },
        (_, i) => data.repository.issues.edges[i].node.id
    )
    return sitemapIds
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const postIds = await getAllPostIds()
    const postMap = postIds.map((postId) => ({
        url: `${BASE_URL}/post/${postId}`,
        lastModified: new Date(),
    }))
    postMap.push({
        url: `${BASE_URL}/post`,
        lastModified: new Date(),
    })

    return postMap
}
