// import * as dotenv from "dotenv";
// if(!process.env.DATABASE_URL)
//   dotenv.config({
//     path: "../.env.api",
//   });
import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from "./schema";

console.log(process.env.DATABASE_URL)

export const db = drizzle(
  process.env.DATABASE_URL!, {
    logger: process.env.MODE === "development",
    schema
  }
);

export * from './schema'