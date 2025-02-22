"use server";

import OpenAI from "openai";
import { auth } from "@/auth";
import { db } from "@/db";
import { books, notes, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const token = process.env.OPENAI_API_KEY;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";

async function getBookDetails(googleBookId: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${googleBookId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching book details for ${googleBookId}:`, error);
    return null;
  }
}

export async function fetchRecommendedBooks() {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!session || !userEmail) throw new Error("Unauthorized");

  const user = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });
  if (!user) throw new Error("User not found");

  // Gather user's reading list and notes with full details
  const userBooks = await db.query.books.findMany({
    where: eq(books.userId, user.id),
  });

  // Fetch full details for each book
  const bookDetailsPromises = userBooks.map((book) =>
    getBookDetails(book.googleBookId)
  );
  const bookDetails = (await Promise.all(bookDetailsPromises)).filter(Boolean);

  const userNotes = await db.query.notes.findMany({
    where: eq(notes.userId, user.id),
  });

  // Create a detailed reading profile
  const readingProfile = {
    genres: new Set(
      bookDetails.flatMap((book) => book.volumeInfo.categories || [])
    ),
    authors: new Set(
      bookDetails.flatMap((book) => book.volumeInfo.authors || [])
    ),
    books: bookDetails.map((book) => ({
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.[0],
      categories: book.volumeInfo.categories,
    })),
    notes: userNotes.map((note) => ({
      title: note.title,
      content: note.content,
    })),
  };

  // Create a detailed context for the AI
  const context = `
    Reading Profile:
    Currently reading or has read:
    ${readingProfile.books
      .map((b) => `- "${b.title}" by ${b.author}`)
      .join("\n")}

    Favorite genres: ${[...readingProfile.genres].join(", ")}
    Authors they enjoy: ${[...readingProfile.authors].join(", ")}

    Reader's notes and thoughts:
    ${readingProfile.notes.map((n) => `- ${n.title}: ${n.content}`).join("\n")}
  `;

  const client = new OpenAI({ baseURL: endpoint, apiKey: token });
  const response = await client.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: "system",
        content: `You are an expert librarian with deep knowledge of literature.
        Analyze the reader's profile and suggest books that match their interests and reading patterns.
        Consider genre preferences, writing styles, and themes they enjoy.
        IMPORTANT: Respond with EXACTLY 4 book titles in this format:
        TITLE: [Book Title Here]
        TITLE: [Book Title Here]
        TITLE: [Book Title Here]
        TITLE: [Book Title Here]
        Choose books that are similar to what they've read but offer something new.
        Do not suggest books they've already read.
        Focus on highly-rated and well-known books in similar genres.`,
      },
      {
        role: "user",
        content: `Based on this reading profile, recommend 4 books that this person would enjoy:\n${context}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0].message.content;
}
