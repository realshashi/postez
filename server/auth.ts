import crypto from 'crypto';
import { Express } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from './storage';
import { User } from '@shared/schema';

// Password hashing
async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex') + '.' + salt);
    });
  });
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [hashedPassword, salt] = hash.split('.');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex') === hashedPassword);
    });
  });
}

// Generate email verification token
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Add guest user creation function
async function createGuestUser(): Promise<User> {
  const guestNumber = Math.floor(Math.random() * 10000);
  const guestUser = await storage.createUser({
    email: `guest${guestNumber}@example.com`,
    name: `Guest User ${guestNumber}`,
    password: null,
    isEmailVerified: true,
    emailVerificationToken: null
  });
  return guestUser;
}

export function setupAuth(app: Express) {
  // Session setup
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) return done(null, false);

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) return done(null, false);

      if (!user.isEmailVerified) {
        return done(null, false, { message: 'Please verify your email first' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);
      const verificationToken = generateVerificationToken();

      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        emailVerificationToken: verificationToken,
        isEmailVerified: false
      });

      // TODO: Send verification email with token
      // For now, we'll just return the token in the response
      res.status(201).json({
        message: 'Registration successful. Please verify your email.',
        verificationToken
      });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { email, token } = req.body;
      const user = await storage.getUserByEmail(email);

      if (!user || user.emailVerificationToken !== token) {
        return res.status(400).json({ message: 'Invalid verification token' });
      }

      await storage.updateUser(user.id, { isEmailVerified: true, emailVerificationToken: null });
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Email verification failed' });
    }
  });

  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Get current user
  app.get('/api/auth/user', (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json(req.user);
  });

  // Add guest login endpoint
  app.get("/api/auth/guest", async (req, res) => {
    try {
      const guestUser = await createGuestUser();
      req.login(guestUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to create guest session" });
        }
        res.redirect("/dashboard");
      });
    } catch (error) {
      console.error("Guest login error:", error);
      res.status(500).json({ message: "Failed to create guest account" });
    }
  });
}