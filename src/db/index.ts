import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./schema";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
