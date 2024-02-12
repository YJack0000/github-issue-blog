import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: { params: { scope: 'read:user, repo' } },
        }),
    ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
