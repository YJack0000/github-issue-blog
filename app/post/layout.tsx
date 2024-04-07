export default function PostsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div className="mx-0 max-w-full flex-1 px-4 xl:p-0">{children}</div>
}
