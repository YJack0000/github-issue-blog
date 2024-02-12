import Link from "next/link"

interface PostSmallProps {
    post: PostPreview
}
export default function PostSmall({ post }: PostSmallProps) {
    return (
        <Link
            href={`/post/${post.id}`}
            className={
                "mb-4 grid cursor-pointer grid-cols-5 gap-2 rounded border border-slate-300 dark:border-slate-800 bg-base-100 py-6 px-4 transition hover:bg-base-300"
            }
        >
            <div className="col-span-5 flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                    <div className="avatar">
                        <div className="w-6 rounded">
                            <img src={post.author.avatar} alt="author avatar" />
                        </div>
                    </div>{" "}
                    {post.author.name}
                </div>
                <div>{post.createdAt}</div>
            </div>
            <div className="col-span-5 lg:col-span-4">
                <div
                    className="my-1 text-2xl font-semibold"
                    v-for="title in post.properties.Title[
                    post.properties.Title.type
                ]"
                >
                    {post.title}
                </div>
                <div className="prose">
                    <span className="font-light">
                        {post.description.substring(0, 200)}
                    </span>
                </div>
            </div>
            <div className="col-span-5 flex flex-wrap items-center gap-2">
                {post.tags.map((tag: string) => {
                    return (
                        <div className="badge badge-outline" key={tag}>
                            {tag}
                        </div>
                    )
                })}{" "}
            </div>
        </Link>
    )
}
