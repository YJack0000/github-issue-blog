import UserButton from "@/components/UserButton"

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 justify-between">
                <a className="btn btn-ghost text-xl">XXX Blog</a>
            <div className="w-20">
                <UserButton />
                </div>
        </div>
    )
}
