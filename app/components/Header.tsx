import UserButton from "@/components/UserButton"

interface HeaderProps {
    title: string
}

export default function Header({ title }: HeaderProps) {
    return (
        <div className="navbar bg-base-100 justify-between">
            <a className="btn-ghost btn p-0 text-xl normal-case md:p-2">
                {title}
            </a>
            <div className="w-20">
                <UserButton />
            </div>
        </div>
    )
}
