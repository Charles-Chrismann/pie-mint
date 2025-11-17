import * as dotenv from "dotenv";
if(!process.env.DATABASE_URL)
  dotenv.config({
    path: "../.env.api",
  });
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(
  process.env.DATABASE_URL!
);
