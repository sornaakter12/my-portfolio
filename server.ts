import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data and uploads directory exist
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const PROFILE_CONFIG_FILE = path.join(DATA_DIR, 'profile_config.json');
const AUTH_CONFIG_FILE = path.join(DATA_DIR, 'auth_config.json');

// Initialize profile config if missing
if (!fs.existsSync(PROFILE_CONFIG_FILE)) {
  fs.writeFileSync(
    PROFILE_CONFIG_FILE,
    JSON.stringify(
      {
        profileImageUrl: '/src/assets/images/jannat_portrait_1793073549037.jpg',
        updatedAt: new Date().toISOString(),
        updatedBy: 'system',
      },
      null,
      2
    )
  );
}

// Initialize auth config if missing
const DEFAULT_OWNER_EMAIL = 'j41975994@gmail.com';
const DEFAULT_PASSWORD = 'Jannat@2026!';

function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

if (!fs.existsSync(AUTH_CONFIG_FILE)) {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(DEFAULT_PASSWORD, salt);
  fs.writeFileSync(
    AUTH_CONFIG_FILE,
    JSON.stringify(
      {
        ownerEmail: DEFAULT_OWNER_EMAIL,
        salt,
        passwordHash,
        defaultPasswordHint: DEFAULT_PASSWORD,
      },
      null,
      2
    )
  );
}

// Active session storage (Server-side tokens)
interface Session {
  email: string;
  createdAt: number;
  expiresAt: number;
}
const activeSessions = new Map<string, Session>();

// Clean expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
}, 60 * 60 * 1000);

// Middleware for parsing JSON with 10MB limit for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

// Server-side Authentication Guard
function requireOwnerAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Owner authentication required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  (req as any).ownerUser = session;
  next();
}

// -------------------------------------------------------------
// Public Endpoints
// -------------------------------------------------------------

// GET /api/profile-image (Available to all visitors on any device)
app.get('/api/profile-image', (_req: Request, res: Response) => {
  try {
    if (fs.existsSync(PROFILE_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROFILE_CONFIG_FILE, 'utf-8'));
      res.json(data);
    } else {
      res.json({
        profileImageUrl: '/src/assets/images/jannat_portrait_1793073549037.jpg',
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Error reading profile config:', err);
    res.status(500).json({ error: 'Failed to load profile image configuration' });
  }
});

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const authConfig = JSON.parse(fs.readFileSync(AUTH_CONFIG_FILE, 'utf-8'));
    const normalizedInputEmail = String(email).trim().toLowerCase();
    const normalizedOwnerEmail = String(authConfig.ownerEmail).trim().toLowerCase();

    if (normalizedInputEmail !== normalizedOwnerEmail) {
      res.status(401).json({ error: 'Invalid owner email or credentials.' });
      return;
    }

    const inputHash = hashPassword(String(password), authConfig.salt);
    const isValid = inputHash === authConfig.passwordHash || (password === DEFAULT_PASSWORD && password === authConfig.defaultPasswordHint);

    if (!isValid) {
      res.status(401).json({ error: 'Incorrect password for owner account.' });
      return;
    }

    // Generate secure session token (7-day validity)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    activeSessions.set(token, {
      email: authConfig.ownerEmail,
      createdAt: Date.now(),
      expiresAt,
    });

    res.json({
      success: true,
      token,
      ownerEmail: authConfig.ownerEmail,
      expiresAt,
      message: 'Owner authenticated successfully.',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server authentication failure' });
  }
});

// GET /api/auth/me (Verify session)
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.json({ authenticated: false });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    res.json({ authenticated: false });
    return;
  }

  res.json({
    authenticated: true,
    ownerEmail: session.email,
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// POST /api/auth/change-password (Owner only)
app.post('/api/auth/change-password', requireOwnerAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || String(newPassword).length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters.' });
    return;
  }

  try {
    const authConfig = JSON.parse(fs.readFileSync(AUTH_CONFIG_FILE, 'utf-8'));
    const currentHash = hashPassword(String(currentPassword), authConfig.salt);
    const isValid = currentHash === authConfig.passwordHash || currentPassword === authConfig.defaultPasswordHint;

    if (!isValid) {
      res.status(401).json({ error: 'Current password does not match.' });
      return;
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(String(newPassword), newSalt);

    authConfig.salt = newSalt;
    authConfig.passwordHash = newHash;
    delete authConfig.defaultPasswordHint;

    fs.writeFileSync(AUTH_CONFIG_FILE, JSON.stringify(authConfig, null, 2));
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// -------------------------------------------------------------
// Owner-Only Profile Image Management Endpoints
// -------------------------------------------------------------

// POST /api/owner/profile-image
app.post('/api/owner/profile-image', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !mimeType) {
      res.status(400).json({ error: 'Missing image payload or mimeType.' });
      return;
    }

    // Supported formats check: JPG, PNG, WEBP
    const allowedMimeTypes: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    const extension = allowedMimeTypes[mimeType.toLowerCase()];
    if (!extension) {
      res.status(400).json({
        error: 'Invalid file format. Only JPG, PNG, and WEBP images are supported.',
      });
      return;
    }

    // Strip base64 prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    // File size check: Maximum 5MB
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (buffer.length > MAX_SIZE) {
      res.status(400).json({
        error: `File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds 5MB limit. Please select a smaller image.`,
      });
      return;
    }

    // Basic magic bytes check for security
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp =
      buffer.length > 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP';

    if (!isJpeg && !isPng && !isWebp) {
      res.status(400).json({ error: 'File content does not match a valid JPG, PNG, or WEBP image.' });
      return;
    }

    // Save image to /public/uploads/profile_avatar_[timestamp].[ext]
    const filename = `profile_avatar_${Date.now()}.${extension}`;
    const targetFilePath = path.join(UPLOADS_DIR, filename);

    await fs.promises.writeFile(targetFilePath, buffer);

    const relativeImageUrl = `/uploads/${filename}`;

    // Update profile_config.json
    const updatedConfig = {
      profileImageUrl: relativeImageUrl,
      updatedAt: new Date().toISOString(),
      updatedBy: (req as any).ownerUser?.email || DEFAULT_OWNER_EMAIL,
    };
    await fs.promises.writeFile(PROFILE_CONFIG_FILE, JSON.stringify(updatedConfig, null, 2));

    res.json({
      success: true,
      profileImageUrl: relativeImageUrl,
      message: 'Profile image updated successfully! It is now permanently visible to all visitors.',
    });
  } catch (err) {
    console.error('Profile image upload error:', err);
    res.status(500).json({ error: 'Failed to save uploaded image on the server.' });
  }
});

// POST /api/owner/reset-image (Reset to initial default portrait)
app.post('/api/owner/reset-image', requireOwnerAuth, async (req: Request, res: Response) => {
  try {
    const defaultConfig = {
      profileImageUrl: '/src/assets/images/jannat_portrait_1793073549037.jpg',
      updatedAt: new Date().toISOString(),
      updatedBy: 'owner_reset',
    };
    await fs.promises.writeFile(PROFILE_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));

    res.json({
      success: true,
      profileImageUrl: defaultConfig.profileImageUrl,
      message: 'Profile image reset to default portrait.',
    });
  } catch (err) {
    console.error('Reset image error:', err);
    res.status(500).json({ error: 'Failed to reset profile image' });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server with secure Owner Authentication running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
