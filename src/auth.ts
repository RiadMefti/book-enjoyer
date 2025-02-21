import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const userEmail = profile.email;
        // Check if user exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, userEmail),
        });

        // If user doesn't exist, create new user
        if (!existingUser && account.providerAccountId) {
          await db.insert(users).values({
            googleId: account.providerAccountId,
            email: userEmail,
          });
        }

        return true;
      }
      return false;
    },
  },
} satisfies NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
