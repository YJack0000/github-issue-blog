import Link from "next/link"

export default function Breadcrumbs({ title }: { title?: string }) {
    return (
        <div className="breadcrumbs text-sm">
            <ul>
                <li>
                    <Link href="/post">文章</Link>
                </li>
                {title ? <li>{title}</li> : <li></li>}
            </ul>
        </div>
    )
}
