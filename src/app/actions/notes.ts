"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { notes, users, books } from "@/db/schema";
import { NoteType } from "@/app/types/BookTypes";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getNotesForBook(bookId: string) {
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
    where: and(eq(books.googleBookId, bookId), eq(books.userId, user.id)),
  });

  if (!book) {
    throw new Error("Book not found");
  }

  const bookNotes = await db.query.notes.findMany({
    where: and(eq(notes.bookId, book.id), eq(notes.userId, user.id)),
    orderBy: (notes, { desc }) => [desc(notes.createdAt)],
  });

  return bookNotes;
}

export async function createNote(
  bookId: string,
  data: {
    title: string;
    content: string;
    type: NoteType;
    page?: number;
  }
) {
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
    where: and(eq(books.googleBookId, bookId), eq(books.userId, user.id)),
  });

  if (!book) {
    throw new Error("Book not found");
  }

  const note = await db
    .insert(notes)
    .values({
      ...data,
      bookId: book.id,
      userId: user.id,
    })
    .returning();

  revalidatePath(`/reading-list/${bookId}`);
  return note[0];
}

export async function updateNote(
  noteId: number,
  data: {
    title: string;
    content: string;
    type: NoteType;
    page?: number;
  }
) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session || !userEmail) {
    throw new Error("Unauthorized");
  }

  const updatedNote = await db
    .update(notes)
    .set(data)
    .where(eq(notes.id, noteId))
    .returning();

  revalidatePath(`/reading-list/[bookId]`);
  return updatedNote[0];
}

export async function deleteNote(noteId: number) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session || !userEmail) {
    throw new Error("Unauthorized");
  }

  await db.delete(notes).where(eq(notes.id, noteId));
  revalidatePath(`/reading-list/[bookId]`);
}
