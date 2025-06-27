import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const guestBook = sqliteTable("guestBook", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
});

export const todos = sqliteTable("todos", {
  id: integer().primaryKey({ autoIncrement: true }),
  text: text().notNull(),
  completed: integer({ mode: "boolean" }).notNull().default(false),
  created_at: integer({ mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updated_at: integer({ mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
