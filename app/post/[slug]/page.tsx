import Link from "next/link"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { fetchPostData } from "@/lib/github"
import PostForm from "@/components/post/PostForm"
import AuthProtectedWrapper from "@/components/auth/AuthorProtectedWrapper"

const CodeBlock = ({ language, value }: any) => (
    <SyntaxHighlighter language={language} style={dark}>
        {value}
    </SyntaxHighlighter>
)

export default async function Page({ params }: { params: { slug: string } }) {
    const post = await fetchPostData(params.slug)
    return (
        <>
            <div className="min-h-screen max-w-6xl mx-auto flex flex-col">
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
                                    body={post.body}
                                />
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
            </div>
        </>
    )
}
