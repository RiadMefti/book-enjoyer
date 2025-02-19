import { Geist, Geist_Mono } from "next/font/google"
import { MainNavigation } from "@/components/MainNavigation"
import "./globals.css"
import { auth } from "@/auth"
import { Providers } from "@/components/Providers"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background font-sans antialiased`}
      >
        <Providers session={session}>
          <MainNavigation />
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  )
}