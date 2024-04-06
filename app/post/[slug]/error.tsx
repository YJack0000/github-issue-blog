"use client"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <Link href="/post">文章</Link>
                    </li>
                    <li>Not Found</li>
                </ul>
            </div>
            <h2>載入失敗，請重新再嘗試</h2>
        </>
    )
}
