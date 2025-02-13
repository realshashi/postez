import { analytics, notes, users, type User, type Note, type Analytics, type InsertUser, type InsertNote, type InsertAnalytics } from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserTokens(id: number, twitterToken?: string, googleToken?: string): Promise<User>;

  // Notes operations
  createNote(note: InsertNote): Promise<Note>;
  getNotesByUserId(userId: number): Promise<Note[]>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: number): Promise<void>;

  // Analytics operations
  addAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsByNoteId(noteId: number): Promise<Analytics[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private notes: Map<number, Note> = new Map();
  private analytics: Map<number, Analytics> = new Map();
  private currentId = {
    users: 1,
    notes: 1,
    analytics: 1,
  };

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = {
      id,
      ...userData,
      twitterToken: null,
      googleToken: null,
    };
    this.users.set(id, user);
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async updateUserTokens(id: number, twitterToken?: string, googleToken?: string): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");

    const updatedUser = {
      ...user,
      twitterToken: twitterToken ?? user.twitterToken,
      googleToken: googleToken ?? user.googleToken,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createNote(noteData: InsertNote): Promise<Note> {
    const id = this.currentId.notes++;
    const note: Note = {
      id,
      ...noteData,
      createdAt: new Date(),
      lastPosted: null,
      schedule: null,
    };
    this.notes.set(id, note);
    return note;
  }

  async getNotesByUserId(userId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter((n) => n.userId === userId);
  }

  async updateNote(id: number, noteData: Partial<InsertNote>): Promise<Note> {
    const note = this.notes.get(id);
    if (!note) throw new Error("Note not found");

    const updatedNote = {
      ...note,
      ...noteData,
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<void> {
    this.notes.delete(id);
  }

  async addAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const id = this.currentId.analytics++;
    const analytics: Analytics = {
      id,
      ...analyticsData,
      timestamp: new Date(),
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getAnalyticsByNoteId(noteId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values())
      .filter((a) => a.noteId === noteId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }
}

export const storage = new MemStorage();