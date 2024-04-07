import PostForm, { PostFormState } from "@/components/post/PostForm"
import InfiniteScrollPosts from "@/components/post/InfiniteScrollPosts"
import AuthProtectedWrapper from "@/components/auth/AuthorProtectedWrapper"
import { fetchPosts } from "@/actions/post"
import {
    createPost,
    CreatePostRequest,
    CreatePostResponse,
} from "@/actions/edit-post"
import { getTags } from "@/actions/tag"
import Breadcrumbs from "@/components/ui/Breadcrumbs"
import TagBox from "@/components/post/TagBox"

export default async function PostPage({
    searchParams,
}: {
    searchParams: { tag?: string }
}) {
    const selectedTag = searchParams?.tag || undefined

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
        const posts = await fetchPosts({
            tags: selectedTag ? [selectedTag] : undefined,
        })
        const tags = await getTags()

        return (
            <>
                <Breadcrumbs />
                <div className="block md:flex md:flex-row-reverse md:gap-2 mb-4">
                    <aside className="w-full md:w-1/4">
                        <AuthProtectedWrapper holder={null}>
                            <PostForm
                                header="新增文章"
                                formAction={handleCreatePost}
                            />
                        </AuthProtectedWrapper>
                        <TagBox tags={tags} selected={selectedTag} />
                    </aside>
                    <div className="flex-1">
                        <InfiniteScrollPosts
                            initPosts={posts}
                            selectedTag={selectedTag}
                        />
                    </div>
                </div>
            </>
        )
    } catch (e: any) {
        return <div>Failed to load posts: {e.message}</div>
    }
}
