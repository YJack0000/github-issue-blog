import React from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/api/auth/[...nextauth]/route"

export default async function SessionPage() {
    const session = await getServerSession(authOptions)
    return (
        <div>
            <h1>Data Fetched from Server Side</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}
