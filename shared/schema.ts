import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  twitterToken: text("twitter_token"),
  googleToken: text("google_token"),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  schedule: jsonb("schedule"),
  lastPosted: timestamp("last_posted"),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").notNull(),
  impressions: integer("impressions").notNull(),
  engagements: integer("engagements").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  isEmailVerified: true, 
  emailVerificationToken: true,
  twitterToken: true,
  googleToken: true 
});

export const insertNoteSchema = createInsertSchema(notes).omit({ 
  id: true, 
  createdAt: true, 
  lastPosted: true 
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });

export type User = typeof users.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;