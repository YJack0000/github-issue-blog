"use client"
import { signIn, signOut } from "next-auth/react"

export function SignOut() {
    return <a onClick={() => signOut()}>登出</a>
}

export function SignIn() {
    return (
        <div className="btn w-full p-0" onClick={() => signIn()}>
            登入
        </div>
    )
}
