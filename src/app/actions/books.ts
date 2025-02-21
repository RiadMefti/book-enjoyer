"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { books, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ReadingStatus } from "@/app/types/BookTypes";

export async function getBookById(googleBookId: string) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session || !userEmail) {
    throw new Error("Unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const book = await db.query.books.findFirst({
    where: and(
      eq(books.googleBookId, googleBookId),
      eq(books.userId, user.id)
    ),
  });

  return book;
}

export async function updateBookStatus(googleBookId: string, status: ReadingStatus) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session || !userEmail) {
    throw new Error("Unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedBook = await db.update(books)
    .set({ 
      status,
      updatedAt: new Date()
    })
    .where(
      and(
        eq(books.googleBookId, googleBookId),
        eq(books.userId, user.id)
      )
    )
    .returning();

  return updatedBook[0];
}
