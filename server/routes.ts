import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { rephraseContent } from "./openai"; 
import { insertUserSchema, insertNoteSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export function registerRoutes(app: Express): Server {
  // Session setup
  app.use(
    session({
      cookie: { maxAge: 86400000 },
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: "keyboard cat", // Replace with proper secret in production
    })
  );

  // Setup auth routes
  setupAuth(app);

  // Notes endpoints
  app.get("/api/notes", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const notes = await storage.getNotesByUserId(req.user.id);
    res.json(notes);
  });

  app.post("/api/notes", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const validation = insertNoteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const note = await storage.createNote({
      ...validation.data,
      userId: req.user.id,
    });
    res.json(note);
  });

  app.patch("/api/notes/:id", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const note = await storage.updateNote(parseInt(req.params.id), req.body);
    res.json(note);
  });

  app.delete("/api/notes/:id", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    await storage.deleteNote(parseInt(req.params.id));
    res.status(204).end();
  });

  // AI endpoints
  app.post("/api/rephrase", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ message: "Text is required" });

      const rephrasedContent = await rephraseContent(text);
      res.json({ content: rephrasedContent });
    } catch (error) {
      console.error('Error in /api/rephrase:', error);
      res.status(500).json({ message: 'Failed to rephrase content. Please try again later.' });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/:noteId", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const analytics = await storage.getAnalyticsByNoteId(parseInt(req.params.noteId));
    res.json(analytics);
  });

  const httpServer = createServer(app);
  return httpServer;
}