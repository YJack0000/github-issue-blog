"use client"

import Image from "next/image"

function Comment({
    avatarUrl,
    name,
    body,
    createdAt,
}: {
    avatarUrl: string
    name: string
    body: string
    createdAt: string
}) {
    return (
        <>
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-8 rounded-full">
                        <Image
                            alt="chat bubble component"
                            src={avatarUrl}
                            width={30}
                            height={30}
                        />
                    </div>
                </div>
                <div className="chat-header">
                    {name} &nbsp;
                    <time className="text-xs opacity-50">{createdAt}</time>
                </div>
                <div className="chat-bubble">{body}</div>
            </div>
        </>
    )
}


export default function Comments({ comments }: { comments: Comment[] }) {
    console.log(comments)
    return (
        <>
            <div className="card w-full bg-base-500 shadow-xl">
                <h1 className="text-xl p-4"> 留言區 </h1>
                <div className="divider m-0"></div>
                <div className="p-4">
                    {comments.map((comment: Comment) => (
                        <Comment
                            key={comment.createdAt}
                            avatarUrl={comment.author.avatar}
                            name={comment.author.name}
                            body={comment.body}
                            createdAt={comment.createdAt}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
