import { ImageResponse } from "next/og"
import { fetchPostData } from "@/actions/post"

export const runtime = "edge"

export const alt = "OG image"
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = "image/png"

const ResponseComponent = (content: string) => {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: "white",
                    width: "100%",
                    heigh: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {content}
            </div>
        ),
        {
            ...size,
        }
    )
}

export default async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    if (!slug) return ResponseComponent(`${process.env.BLOG_NAME}`)
    const postData = await fetchPostData(slug)
    return ResponseComponent(postData.title)
}

// const ResponseComponent = (content: string) => {
//     return new ImageResponse(
//         (
//             <div
//                 style={{
//                     fontSize: 128,
//                     background: "white",
//                     width: "100%",
//                     heigh: "100%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                 }}
//             >
//                 {content}
//             </div>
//         ),
//         {
//             ...size,
//         }
//     )
// }
//
// export default async function Image({ params }: { params: { slug: string } }) {
//     if (!params.slug) return ResponseComponent(`${process.env.BLOG_NAME}`)
//     const postData = await fetchPostData(params.slug)
//     return ResponseComponent(postData.title)
// }
