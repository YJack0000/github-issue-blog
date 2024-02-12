"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { fetchPosts } from "@/lib/github"
import PostSmall from "./PostSmall"
import Loading from "./Loading"

interface InfiniteScrollPostProps {
    initPosts: PostPreview[]
}

export default function InfiniteScrollPost({
    initPosts,
}: InfiniteScrollPostProps) {
    const [posts, setPosts] = useState<PostPreview[]>(initPosts)
    const [cursor, setCursor] = useState<string | null>(
        posts[posts.length - 1].cursor
    )
    const [ref, inView] = useInView({
        threshold: 0,
    })

    const fetchMore = useCallback(async () => {
        console.log("fetchMore", posts.length, cursor)
        if (!cursor) return

        try {
            const newPosts = await fetchPosts(cursor)
            console.log("newPosts", newPosts)
            if (
                newPosts.length == 0 ||
                newPosts[newPosts.length - 1].id === posts[posts.length - 1].id
            ) {
                setCursor(null)
            } else {
                setPosts([...posts, ...newPosts])
                setCursor(posts[posts.length - 1].cursor)
            }
        } catch (e: any) {
            console.log("Error:", e)
        }
    }, [posts, cursor])

    useEffect(() => {
        if (inView) {
            fetchMore()
        }
    }, [inView, fetchMore])

    return (
        <>
            {posts.map((post: PostPreview) => (
                <PostSmall key={post.id} post={post} />
            ))}
            {cursor}
            {!cursor ? <div /> : <Loading ref={ref} />}
        </>
    )
}
