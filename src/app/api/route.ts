import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const users = await db.query.user.findMany();
  return NextResponse.json(users);
}
