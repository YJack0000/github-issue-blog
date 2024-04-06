import Link from "next/link"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useRouter } from "next/navigation"
import { permanentRedirect } from "next/navigation"
import { fetchPostData } from "@/actions/github/get"
import PostForm from "@/components/post/PostForm"
import AuthProtectedWrapper from "@/components/auth/AuthorProtectedWrapper"
import DeleteButton from "@/components/ui/DeleteButton"
import {
    deletePost,
    DeletePostRequest,
    DeletePostResponse,
} from "@/actions/github/edit"

const CodeBlock = ({ language, value }: any) => (
    <SyntaxHighlighter language={language} style={dark}>
        {value}
    </SyntaxHighlighter>
)

export default async function Page({ params }: { params: { slug: string } }) {
    const handleDeletePost = async () => {
        "use server"
        const req: DeletePostRequest = { id: params.slug }
        const res: DeletePostResponse = await deletePost(req)

        if (res.status === "Success") permanentRedirect("/post")
    }

    const post = await fetchPostData(params.slug)

    return (
        <>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <Link href="/post">文章</Link>
                    </li>
                    <li>{post.title}</li>
                </ul>
            </div>
            <section className="mt-1 mb-6">
                <div className="relative">
                    <img
                        className="rounded-box mt-2 mb-4 h-96 w-full object-cover brightness-50"
                        src="/img/bg.png"
                        alt="photo replacement of the post"
                    />
                    <h1 className="absolute bottom-0 mb-6 max-w-2xl px-8 text-white text-4xl lg:text-5xl font-bold leading-normal">
                        {post.title}
                    </h1>
                </div>
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="avatar">
                                <div className="w-6 rounded">
                                    <img
                                        src={post.author.avatar}
                                        alt="author avatar"
                                    />
                                </div>
                            </div>
                            {post.author.name}
                        </div>
                        <div>Sun Apr 30 2023</div>
                        <AuthProtectedWrapper holder={null}>
                            <PostForm
                                header="編輯文章"
                                id={post.id}
                                title={post.title}
                                tags={post.tags}
                                description={post.description}
                                body={post.body}
                            />
                            <DeleteButton onClick={handleDeletePost} />
                        </AuthProtectedWrapper>
                    </div>
                    <Markdown
                        className="prose-lg text-base-content"
                        components={{ code: CodeBlock }}
                        rehypePlugins={[rehypeRaw]}
                    >
                        {post.body}
                    </Markdown>
                </div>
            </section>
        </>
    )
}
