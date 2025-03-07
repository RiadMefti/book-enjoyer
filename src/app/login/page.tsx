"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") || `${process.env.NEXT_PUBLIC_APP_URL}/`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back button */}
      <div className="p-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>

      <div className="flex-1 flex items-start justify-center p-4 pt-16">
        {" "}
        {/* Changed from items-center and added pt-16 */}
        <div className="w-full max-w-[380px] space-y-8">
          {/* Logo and Title */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white">
                  <Sparkles className="h-3 w-3" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome to BookEnjoyer
              </h1>
              <p className="text-sm text-muted-foreground">
                Your AI-powered reading companion
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="rounded-lg border bg-card shadow-sm p-6 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-lg font-medium">Sign in to get started</h2>
              <p className="text-sm text-muted-foreground">
                Track your reading journey and get AI-powered insights
              </p>
            </div>

            <Button
              className="w-full relative overflow-hidden group"
              onClick={() => signIn("google", { callbackUrl })}
              size="lg"
            >
              {/* Google Icon */}
              <div className="mr-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              Continue with Google
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
