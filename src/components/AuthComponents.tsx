'use client'
import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/Button";

export function SignIn(props: React.ComponentPropsWithRef<typeof Button>
) {
    return (
        <Button className="w-full p-0" {...props} onClick={() => signIn()}>
            Sign In 
        </Button>
    );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
    return (
        <Button className="w-full p-0" {...props} onClick={() => signOut()}>
            Sign Out
        </Button>
    );
}
