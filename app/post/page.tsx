import PostForm, { PostFormState } from "@/components/post/PostForm"
import InfiniteScrollPosts from "@/components/post/InfiniteScrollPosts"
import AuthProtectedWrapper from "@/components/auth/AuthorProtectedWrapper"
import { fetchPosts } from "@/actions/github/get"
import {
    createPost,
    CreatePostRequest,
    CreatePostResponse,
} from "@/actions/github/edit"

export default async function PostPage() {
    const handleCreatePost = async (formData: PostFormState) => {
        "use server"
        const req: CreatePostRequest = {
            title: formData.title,
            description: formData.description,
            body: formData.body,
            tags: formData.tags,
        }

        const res: CreatePostResponse = await createPost(req)
        console.log("create post response: ", res)
    }

    try {
        const posts = await fetchPosts()
        return (
            <>
                <div className="mx-0 max-w-full flex-1 p-4 xl:p-0">
                    <div className="block md:flex md:flex-row-reverse md:gap-2 mb-4">
                            <AuthProtectedWrapper holder={null}>
                                                    <aside className="w-full md:w-1/4">

                                <PostForm
                                    header="新增文章"
                                    formAction={handleCreatePost}
                                />
                        </aside>
                            </AuthProtectedWrapper>
                        <div className="flex-1">
                            <InfiniteScrollPosts initPosts={posts} />
                        </div>
                    </div>
                </div>
            </>
        )
    } catch (e: any) {
        return <div>Failed to load posts: {e.message}</div>
    }
}
