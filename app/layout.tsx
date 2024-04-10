import type { Metadata } from "next"
import { Inter } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import Header from "@/components/Header"
import "./globals.css"
import Footer from "@/components/Footer"
import { getMetadata } from "@/lib/metadata"

const inter = Inter({ subsets: ["latin"] })

const BLOG_NAME = process.env.BLOG_NAME as string
const GITHUB_URL = process.env.GITHUB_URL as string
const LINKEDIN_URL = process.env.LINKEDIN_URL as string

export const metadata: Metadata = getMetadata(
    BLOG_NAME,
    "一個使用 Github Issue 作為後台的部落格"
)

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SpeedInsights />
                <Analytics />
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
