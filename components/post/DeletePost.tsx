"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export default function DeleteButton({
    className,
    onClick,
}: {
    className?: string | undefined
    onClick: () => void
}) {
    const [loading, setLoading] = useState(false)
    const handleDeletePost = async () => {
        setLoading(true)
        onClick()
        setTimeout(() => setLoading(false), 2000)
    }

    return (
        <button
            className={cn("btn btn-error btn-outline", className)}
            onClick={handleDeletePost}
        >
            {!loading ? (
                "❌"
            ) : (
                <span className="loading loading-spinner"></span>
            )}{" "}
            &nbsp; 刪除文章{" "}
        </button>
    )
}
