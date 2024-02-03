import { getServerSession } from "next-auth/next"
import { SignIn, SignOut } from "@/components/AuthComponents";

export default async function UserButton() {
    const session = await getServerSession()
    return session ? (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    <img alt="Avatar image" src={session?.user?.image as string}  />
                </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Settings</a></li>
                <SignOut />
            </ul>
        </div>
    ) : (
            <SignIn />
        );
}
