import PostForm from "@/components/post/PostForm"
import InfiniteScrollPosts from "@/components/post/InfiniteScrollPosts"
import { fetchPosts } from "@/lib/github"
import AuthProtectedWrapper from "@/components/auth/AuthorProtectedWrapper"

export default async function PostPage() {
    try {
        const posts = await fetchPosts()
        return (
            <>
                <div className="mx-0 max-w-full flex-1 p-4 xl:p-0">
                    <div className="block md:flex md:flex-row-reverse md:gap-2 mb-4">
                        <aside className="w-full md:w-1/4">
                            <AuthProtectedWrapper holder={null}>
                                <PostForm header="新增文章" />
                            </AuthProtectedWrapper>
                        </aside>
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
