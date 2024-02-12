import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: { params: { scope: "read:user, repo" } },
        }),
    ],
    callbacks: {
        session({ session, token }: any) {
            session.accessToken = token.accessToken
            return session
        },
        jwt({ token, account }: any) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
