import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
export async function GET() {
  const users = await db.query.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const user = await db.insert(usersTable).values({
    age: 25,
    email: "tester",
    name: "tester",
  });
  return NextResponse.json(user);
}
