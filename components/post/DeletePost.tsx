"use client"

import { cn } from "@/lib/utils"

export default function DeleteButton({
    className,
    onClick,
}: {
    className?: string | undefined
    onClick: () => void
}) {
    return (
        <button
            className={cn("btn btn-error btn-outline", className)}
            onClick={() => onClick()}
        >
            ❌ &nbsp; 刪除文章
        </button>
    )
}