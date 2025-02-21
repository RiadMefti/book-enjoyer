import { auth } from "@/auth";
import { db } from "@/db";
import { books, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userBooks = await db.query.books.findMany({
    where: eq(books.userId, user.id),
  });

  return NextResponse.json(userBooks);
}

export async function POST(req: Request) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, userEmail),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { googleBookId } = await req.json();

  const existingBook = await db.query.books.findFirst({
    where: eq(books.googleBookId, googleBookId),
  });

  if (existingBook) {
    return NextResponse.json(
      { error: "Book already in reading list" },
      { status: 400 }
    );
  }

  await db.insert(books).values({
    googleBookId,
    userId: user.id,
  });

  return NextResponse.json({ success: true });
}
