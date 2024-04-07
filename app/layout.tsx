import type { Metadata } from "next"
import { Inter } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
import Header from "@/components/Header"
import "./globals.css"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

const BLOG_NAME = process.env.BLOG_NAME as string
const GITHUB_URL = process.env.GITHUB_URL as string
const LINKEDIN_URL = process.env.LINKEDIN_URL as string

export const metadata: Metadata = {
    title: BLOG_NAME,
    description: `A blog about web development and programming.`,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NextTopLoader showSpinner={false} />
                <Header title={BLOG_NAME} />
                <div className="min-h-screen max-w-6xl mx-auto flex flex-col">
                    {children}
                </div>
                <Footer github={GITHUB_URL} linkedin={LINKEDIN_URL} />
            </body>
        </html>
    )
}
