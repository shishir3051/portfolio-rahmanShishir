require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { query } = require("./db");

const app = express();

// Required for express-rate-limit on Render
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

// 3. Security (Helmet) - Adjusted for API compatibility
app.use((req, res, next) => {
  // Disable strict CSP for API routes to avoid fetch issues
  if (req.path.startsWith('/api/')) {
    return helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })(req, res, next);
  }

  // Standard Helmet for non-API routes (admin, public, etc)
  if (req.path.startsWith('/admin') || req.path.startsWith('/public') || req.path === '/') {
    return helmet({ contentSecurityPolicy: false })(req, res, next);
  }

  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })(req, res, next);
});

// Static Files
app.use("/public", express.static(path.join(__dirname, "public.bak")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Admin Auth Middleware
function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!process.env.ADMIN_KEY) return res.status(500).json({ ok: false, error: "ADMIN_KEY not configured" });
  if (!key || key !== process.env.ADMIN_KEY) return res.status(401).json({ ok: false, error: "Unauthorized" });
  next();
}

// Helpers
const safeJsonArray = (v) => {
  try { const p = JSON.parse(v || "[]"); return Array.isArray(p) ? p : []; } catch { return []; }
};

// =======================
// ROUTES
// =======================

// Health Check
app.get("/health", (req, res) => res.json({ ok: true }));

// CONTACT FORM
const contactLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 20 });
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ ok: false, error: "All fields required" });
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().slice(0, 64);
    const ua = (req.headers["user-agent"] || "").toString().slice(0, 512);
    await query("INSERT INTO ContactMessages (FullName, Email, Message, IpAddress, UserAgent) VALUES ($1, $2, $3, $4, $5)", [name, email, message, ip, ua]);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

// PROJECTS (PUBLIC)
app.get("/api/public/projects", async (req, res) => {
  try {
    const result = await query("SELECT Id, Title, Tag, Description, ProjectYear, Role, TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder FROM Projects WHERE IsActive = true ORDER BY SortOrder ASC, ProjectYear DESC");
    res.json({ ok: true, projects: result.rows });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

// Alias for public projects (compatibility)
app.get("/api/projects", async (req, res) => {
  try {
    const result = await query("SELECT Id, Title, Tag, Description, ProjectYear, Role, TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder FROM Projects WHERE IsActive = true ORDER BY SortOrder ASC, ProjectYear DESC");
    res.json({
      ok: true, projects: result.rows.map(r => ({
        ...r, id: r.id, title: r.title, tag: r.tag, desc: r.description, year: r.projectyear, role: r.role,
        tech: (r.techcsv || "").split(",").map(x => x.trim()).filter(Boolean), details: safeJsonArray(r.detailsjson),
        live: r.liveurl, repo: r.repourl
      }))
    });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

// PROJECTS (ADMIN)
app.post("/api/projects", requireAdmin, async (req, res) => {
  try {
    const { title, tag, desc, year, role, tech, details, live, repo, sortOrder } = req.body;
    const result = await query("INSERT INTO Projects (Title, Tag, Description, ProjectYear, Role, TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING Id",
      [title, tag, desc, year, role, Array.isArray(tech) ? tech.join(',') : tech, JSON.stringify(details), live, repo, sortOrder || 0]);
    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

app.put("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const { title, tag, desc, year, role, tech, details, live, repo, sortOrder } = req.body;
    await query("UPDATE Projects SET Title=$1, Tag=$2, Description=$3, ProjectYear=$4, Role=$5, TechCsv=$6, DetailsJson=$7, LiveUrl=$8, RepoUrl=$9, SortOrder=$10 WHERE Id=$11",
      [title, tag, desc, year, role, Array.isArray(tech) ? tech.join(',') : tech, JSON.stringify(details), live, repo, sortOrder || 0, req.params.id]);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try { await query("DELETE FROM Projects WHERE Id = $1", [req.params.id]); res.json({ ok: true }); }
  catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

// BLOGS (PUBLIC)
app.get("/api/public/blogs", async (req, res) => {
  try {
    const result = await query("SELECT Id, Title, Excerpt, Content, Category, ReadTime, Featured, CreatedAt FROM BlogPosts WHERE IsActive = true ORDER BY CreatedAt DESC");
    res.json({ ok: true, blogs: result.rows });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

// BLOGS (ADMIN)
app.get("/api/blogs", requireAdmin, async (req, res) => {
  try {
    const result = await query("SELECT Id, Title, Excerpt, Content, Category, ReadTime, Featured, IsActive, CreatedAt FROM BlogPosts ORDER BY CreatedAt DESC");
    res.json({ ok: true, blogs: result.rows });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

app.post("/api/blogs", requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, featured } = req.body;
    const result = await query("INSERT INTO BlogPosts (Title, Excerpt, Content, Category, ReadTime, Featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING Id",
      [title, excerpt, content, category, readTime, !!featured]);
    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

app.put("/api/blogs/:id", requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, featured, isActive } = req.body;
    await query("UPDATE BlogPosts SET Title=$1, Excerpt=$2, Content=$3, Category=$4, ReadTime=$5, Featured=$6, IsActive=$7, UpdatedAt=CURRENT_TIMESTAMP WHERE Id=$8",
      [title, excerpt, content, category, readTime, !!featured, isActive !== false, req.params.id]);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

app.delete("/api/blogs/:id", requireAdmin, async (req, res) => {
  try { await query("DELETE FROM BlogPosts WHERE Id = $1", [req.params.id]); res.json({ ok: true }); }
  catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

// MESSAGES (ADMIN)
app.get("/api/messages", requireAdmin, async (req, res) => {
  try {
    const result = await query("SELECT Id, FullName, Email, Message, CreatedAt FROM ContactMessages ORDER BY CreatedAt DESC LIMIT 100");
    res.json({ ok: true, messages: result.rows });
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: "Server error" }); }
});

// HTML Fallbacks
app.get("/admin", (req, res) => {
  const p = path.join(__dirname, "public.bak", "dashboard.html");
  if (fs.existsSync(p)) return res.sendFile(p);
  res.status(404).send("Dashboard UI not found");
});

app.get("/", (req, res) => {
  const p = path.join(__dirname, "public.bak", "index.html");
  if (fs.existsSync(p)) return res.sendFile(p);
  res.json({ ok: true, note: "API Active", time: new Date().toISOString() });
});

// Diagnostic API Route
app.get("/api/test", (req, res) => {
  res.json({ ok: true, message: "API connection successful", headers: req.headers });
});

// Generic 404 Logger (Must be last)
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.url} - Not Found`);
  res.status(404).json({ ok: false, error: "Route not found", path: req.url });
});

// START SERVER
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[32m[SERVER]\x1b[0m Ready on port ${PORT}`);
  console.log(`\x1b[34m[INFO]\x1b[0m Blog and Project APIs are active`);
});
