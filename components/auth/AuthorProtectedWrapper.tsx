import { getAuthor, getUserName } from "@/actions/github"

export interface AuthProtectedWrapperProps {
    children: React.ReactNode
    holder: React.ReactNode
}

export default async function AuthProtectedWrapper({
    children,
    holder,
}: AuthProtectedWrapperProps) {
    return (await getUserName()) === (await getAuthor()) ? (
        <>{children}</>
    ) : (
        <>{holder}</>
    )
}
