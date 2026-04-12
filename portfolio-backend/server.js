import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { connectDB } from './db.js';

// Models
import Admin from './models/Admin.js';
import Project from './models/Project.js';
import BlogPost from './models/BlogPost.js';
import ContactMessage from './models/ContactMessage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "rahman_secure_secret_2026";

// Configure Resend email service
const resend = new Resend(process.env.RESEND_API_KEY);

// Connect to Database
connectDB();

const app = express();

// Required for express-rate-limit on Vercel/Render
app.set("trust proxy", 1);

// 1. CORS - MUST BE FIRST
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"]
}));

// 2. Body Parser
app.use(express.json({ limit: "1mb" }));

// 3. Security (Helmet)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })(req, res, next);
  }
  next();
});

// Admin Auth Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ ok: false, error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ ok: false, error: "Invalid or expired token." });
  }
}

// =======================
// AUTH ROUTES
// =======================

app.post("/api/auth/setup", async (req, res) => {
  try {
    const { username, password, setupKey } = req.body;
    if (setupKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ ok: false, error: "Invalid setup key" });
    }

    const check = await Admin.findOne();
    if (check) return res.status(400).json({ ok: false, error: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({ username, passwordHash: hash });
    await newAdmin.save();

    res.json({ ok: true, message: "Admin account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const validPass = await bcrypt.compare(password, admin.passwordHash);
    if (!validPass) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ ok: true, token, user: { username: admin.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.get("/api/auth/verify", requireAdmin, (req, res) => {
  res.json({ ok: true, user: req.admin });
});

app.post("/api/auth/update-profile", requireAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminId = req.admin.id;

    const updateData = {};
    if (username) updateData.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ ok: false, error: "Nothing to update" });
    }

    await Admin.findByIdAndUpdate(adminId, updateData);
    res.json({ ok: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// CONTACT FORM
const contactLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 20 });
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ ok: false, error: "All fields required" });
    
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().slice(0, 64);
    const ua = (req.headers["user-agent"] || "").toString().slice(0, 512);

    const newMessage = new ContactMessage({ fullName: name, email, message, ipAddress: ip, userAgent: ua });
    await newMessage.save();

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: 'gaziur.rahman4311@gmail.com',
          replyTo: email,
          subject: `📬 New Contact Form Message from ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #121212; padding: 30px 20px; color: #ffffff;">
              <div style="max-w-md mx-auto; background-color: #1e1e1e; padding: 30px; border-radius: 12px; border: 1px solid #6366f1; max-width: 500px; margin: 0 auto;">
                
                <h2 style="color: #818cf8; text-align: center; margin-top: 0; font-size: 24px; font-weight: 700;">
                  📬 New Contact Message
                </h2>
                <p style="text-align: center; color: #a1a1aa; font-size: 14px; margin-top: -10px; margin-bottom: 30px;">
                  Someone reached out through your portfolio!
                </p>
                
                <!-- Sender Info Box -->
                <div style="background-color: #27272a; padding: 20px; border-radius: 8px; border-left: 4px solid #818cf8; margin-bottom: 20px;">
                  <p style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 5px 0; font-weight: 600;">Sender Name</p>
                  <p style="color: #ffffff; font-size: 16px; margin: 0 0 15px 0; font-weight: 500;">${name}</p>
                  
                  <p style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 5px 0; font-weight: 600;">Email Address</p>
                  <a href="mailto:${email}" style="color: #818cf8; font-size: 16px; margin: 0; text-decoration: none; font-weight: 500;">${email}</a>
                </div>
                
                <!-- Message Box -->
                <div style="background-color: #292524; border: 1px solid #d97706; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="font-size: 11px; color: #fcd34d; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 10px 0; font-weight: bold;">
                    📝 Message
                  </p>
                  <p style="color: #e5e5e5; font-size: 15px; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>

                <!-- Footer Box -->
                <div style="background-color: #27272a; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
                  <p style="color: #a1a1aa; font-size: 13px; margin: 0;">
                    <span style="color: #fbbf24; font-weight: bold;">💡 Quick Reply:</span> Just hit "Reply" to respond directly to ${name}.
                  </p>
                </div>

                <!-- Timestamp -->
                <hr style="border: none; border-top: 1px solid #3f3f46; margin-bottom: 20px;" />
                <p style="text-align: center; color: #71717a; font-size: 11px; margin: 0;">
                  Sent via Portfolio Contact Form • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>

              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Email failed:', emailError);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// PROJECTS
app.get("/api/projects", async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let mongoQuery = Project.find({ isActive: true }).sort({ sortOrder: 1, projectYear: -1 });

    if (page) {
      const skip = (page - 1) * limit;
      mongoQuery = mongoQuery.skip(skip).limit(limit);
    }

    const projects = await mongoQuery;
    const total = await Project.countDocuments({ isActive: true });

    const mappedProjects = projects.map(p => ({
      id: p._id,
      title: p.title,
      tag: p.tag,
      desc: p.description,
      year: p.projectYear,
      role: p.role,
      tech: p.tech,
      details: p.details,
      live: p.liveUrl,
      repo: p.repoUrl,
      sortOrder: p.sortOrder
    }));

    res.json({
      ok: true,
      projects: mappedProjects,
      pagination: page ? { total, page, limit, totalPages: Math.ceil(total / limit) } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.post("/api/projects", requireAdmin, async (req, res) => {
  try {
    const { title, tag, desc, year, role, tech, details, live, repo, sortOrder } = req.body;
    const newProject = new Project({
      title, tag, description: desc, projectYear: year, role,
      tech: Array.isArray(tech) ? tech : (tech ? tech.split(',').map(s => s.trim()) : []),
      details: Array.isArray(details) ? details : [],
      liveUrl: live, repoUrl: repo, sortOrder: sortOrder || 0
    });
    const saved = await newProject.save();
    res.json({ ok: true, id: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.put("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const { title, tag, desc, year, role, tech, details, live, repo, sortOrder } = req.body;
    await Project.findByIdAndUpdate(req.params.id, {
      title, tag, description: desc, projectYear: year, role,
      tech: Array.isArray(tech) ? tech : (tech ? tech.split(',').map(s => s.trim()) : []),
      details: Array.isArray(details) ? details : [],
      liveUrl: live, repoUrl: repo, sortOrder: sortOrder || 0
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// BLOGS
app.get("/api/blogs", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await BlogPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments();

    res.json({
      ok: true,
      blogs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.post("/api/blogs", requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, featured } = req.body;
    const newBlog = new BlogPost({ title, excerpt, content, category, readTime, featured: !!featured });
    const saved = await newBlog.save();
    res.json({ ok: true, id: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.put("/api/blogs/:id", requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, featured, isActive } = req.body;
    await BlogPost.findByIdAndUpdate(req.params.id, {
      title, excerpt, content, category, readTime, featured: !!featured, isActive: isActive !== false
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.delete("/api/blogs/:id", requireAdmin, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// MESSAGES (ADMIN)
app.get("/api/messages", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments();

    res.json({
      ok: true,
      messages,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Health & Test
app.get("/api/health", (req, res) => res.json({ ok: true, db: "mongodb" }));

// API Export for Vercel Serverless Functions
export default app;

// Listen on port 4000 for local development when run directly via Node
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`\x1b[35m[SERVER]\x1b[0m Running locally on http://localhost:${PORT}`);
  });
}
