import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainNavigation } from "@/components/MainNavigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookEnjoyer",
  description: "Track and manage your reading journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}  bg-background font-sans antialiased`}
      >
        <MainNavigation />

        <div>{children}</div>
      </body>
    </html>
  );
}
