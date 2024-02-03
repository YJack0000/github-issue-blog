import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

console.log({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
