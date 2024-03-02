import { getServerSession } from "next-auth"

const GITHUB_BLOG_POST_OWNER = process.env.GITHUB_BLOG_POST_OWNER

export interface AuthProtectedWrapperProps {
    children: React.ReactNode
    holder: React.ReactNode
}

export default async function AuthProtectedWrapper({
    children,
    holder,
}: AuthProtectedWrapperProps) {
    const session = await getServerSession()
    return session && session?.user?.name === GITHUB_BLOG_POST_OWNER ? (
        <>{children}</>
    ) : (
        <>{holder}</>
    )
}
