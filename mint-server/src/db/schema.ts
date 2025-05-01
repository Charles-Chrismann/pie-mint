import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helper";

export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),

  ...timestamps
});


export const organization = pgTable("organization", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  name: varchar({ length: 255 }).notNull(),

  createdById: integer('created_by_id').references(() => user.id),
  ownerId: integer('owner_id').references(() => user.id),

  ...timestamps
})

export const organizationGroup = pgTable("organization_group", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  name: varchar({ length: 255 }).notNull(),

  createdById: integer('created_by_id').references(() => user.id),
  ownerId: integer('owner_id').references(() => user.id),

  ...timestamps
})