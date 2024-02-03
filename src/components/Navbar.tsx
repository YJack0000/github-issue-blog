import UserButton from "@/components/UserButton"

export default function Navbar() {
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">XXX Blog</a>
            </div>
            <div className="navbar-end">
                <UserButton />
            </div>
        </div>
    )
}
