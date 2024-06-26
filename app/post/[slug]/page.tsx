import { redirect } from "next/navigation"
import Image from "next/image"
import { fetchPostData } from "@/actions/post"
import PostForm from "@/components/post/PostForm"
import AuthProtectedWrapper from "@/components/auth/AuthorProtectedWrapper"
import {
    deletePost,
    DeletePostRequest,
    DeletePostResponse,
    updatePost,
    UpdatePostRequest,
    UpdatePostResponse,
} from "@/actions/edit-post"
import DeletePost from "@/components/post/DeletePost"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import PostRenderer from "@/components/post/PostRenderer"
import Comments from "@/components/post/Comments"
import { getMetadata } from "@/lib/metadata"

export async function generateMetadata({
    params,
}: Readonly<{ params: { slug: string } }>) {
    const post = await fetchPostData(params.slug)

    const metadata = getMetadata(post.title, post.description)
    return metadata
}

export default async function Page({ params }: { params: { slug: string } }) {
    const handleDeletePost = async () => {
        "use server"
        const req: DeletePostRequest = { id: params.slug }

        try {
            const res: DeletePostResponse = await deletePost(req)

            if (res.status !== "Success") {
                return { error: `${res.status}: ${res.message}` }
            }
        } catch (e: any) {
            console.log(JSON.stringify(e))
            return { error: `${e.message}` }
        }
        redirect("/post")
    }

    const handleEditPost = async (formData: any) => {
        "use server"
        const req: UpdatePostRequest = {
            id: params.slug,
            title: formData.title,
            description: formData.description,
            body: formData.body,
            tags: formData.tags,
        }

        try {
            const res: UpdatePostResponse = await updatePost(req)

            if (res.status !== "Success") {
                return {
                    error: `${res.status}: ${res.message}`,
                }
            }
        } catch (e: any) {
            return { error: `${e.message}` }
        }
        redirect(`/post/${params.slug}`)
    }

    const post = await fetchPostData(params.slug)

    return (
        <>
            <Breadcrumbs title={post.title} />
            <section className="mt-1 mb-6">
                <div className="relative">
                    <div className="relative rounded-box mt-2 mb-4 h-96 w-full object-cover brightness-50">
                        <Image
                            src="/img/bg.png"
                            alt="photo replacement of the post"
                            fill
                            sizes="90vw"
                            priority
                        />
                    </div>
                    <h1 className="absolute bottom-0 mb-6 max-w-2xl px-8 text-white text-4xl lg:text-5xl font-bold leading-normal">
                        {post.title}
                    </h1>
                </div>
                <div className="w-full mx-auto">
                    <div className="mb-6 flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="avatar">
                                <div className="w-6 rounded">
                                    <Image
                                        src={post.author.avatar}
                                        alt="author avatar"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                            </div>
                            {post.author.name}
                        </div>
                        <div>Sun Apr 30 2023</div>
                    </div>
                    <AuthProtectedWrapper holder={null}>
                        <div className="w-full flex">
                            <PostForm
                                header="📝 編輯文章"
                                formData={{ ...post }}
                                formAction={handleEditPost}
                            />
                            <div className="w-4"></div>
                            <DeletePost onClick={handleDeletePost} />
                        </div>
                    </AuthProtectedWrapper>
                    <PostRenderer content={post.body} />
                    <div className="mt-4"></div>
                    <Comments comments={post.comments} />
                </div>
            </section>
        </>
    )
}
