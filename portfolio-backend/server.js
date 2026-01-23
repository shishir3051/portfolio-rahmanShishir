require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { query } = require("./db");

const app = express();

// =======================
// MIDDLEWARE
// =======================
// Disable CSP for admin dashboard routes
app.use((req, res, next) => {
  // Disable CSP for admin dashboard and public home page
  if (req.path.startsWith('/admin') || req.path.startsWith('/public') || req.path === '/') {
    return helmet({
      contentSecurityPolicy: false,
    })(req, res, next);
  }
  // Apply strict CSP for other routes
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

app.use(cors({ origin: "*" })); // restrict in production
app.use(express.json({ limit: "1mb" }));

// Serve admin dashboard static files (fallback to public.bak)
app.use("/public", express.static(path.join(__dirname, "public.bak")));
app.use("/public", express.static(path.join(__dirname, "public")));

// =======================
// ADMIN AUTH (simple + safe)
// Header: x-admin-key
// =======================
function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!process.env.ADMIN_KEY) {
    return res.status(500).json({ ok: false, error: "ADMIN_KEY not configured" });
  }
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
}

// =======================
// RATE LIMIT
// =======================
const contactLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20
});

// =======================
// HEALTH
// =======================
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "portfolio-backend" });
});

// =======================
// CONTACT FORM
// =======================
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!name || name.length < 2)
      return res.status(400).json({ ok: false, error: "Name is required." });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, error: "Valid email is required." });

    if (!message || message.length < 10)
      return res.status(400).json({ ok: false, error: "Message is too short." });

    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
      .toString()
      .slice(0, 64);

    const ua = (req.headers["user-agent"] || "")
      .toString()
      .slice(0, 512);

    await query(`
        INSERT INTO ContactMessages
          (FullName, Email, Message, IpAddress, UserAgent)
        VALUES
          ($1, $2, $3, $4, $5)
      `, [name, email, message, ip, ua]);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// =======================
// PROJECTS (PUBLIC)
// =======================
app.get("/api/projects", async (req, res) => {
  try {
    const result = await query(`
      SELECT Id, Title, Tag, Description, ProjectYear, Role,
             TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder
      FROM Projects
      WHERE IsActive = true
      ORDER BY SortOrder ASC, Id DESC
    `);

    const projects = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      tag: r.tag,
      desc: r.description,
      year: r.projectyear,
      role: r.role,
      tech: (r.techcsv || "").split(",").map(x => x.trim()).filter(Boolean),
      details: safeJsonArray(r.detailsjson),
      live: r.liveurl,
      repo: r.repourl
    }));

    res.json({ ok: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// =======================
// ADD PROJECT (ADMIN)
// =======================
app.post("/api/projects", requireAdmin, async (req, res) => {
  try {
    const title = String(req.body?.title || "").trim();
    if (!title)
      return res.status(400).json({ ok: false, error: "Title is required." });

    const payload = {
      tag: String(req.body?.tag || "").trim(),
      desc: String(req.body?.desc || "").trim(),
      year: String(req.body?.year || "").trim(),
      role: String(req.body?.role || "").trim(),
      tech: Array.isArray(req.body?.tech) ? req.body.tech : [],
      details: Array.isArray(req.body?.details) ? req.body.details : [],
      live: String(req.body?.live || "").trim(),
      repo: String(req.body?.repo || "").trim(),
      sortOrder: Number(req.body?.sortOrder || 0)
    };

    const result = await query(`
        INSERT INTO Projects
          (Title, Tag, Description, ProjectYear, Role,
           TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING Id
      `, [
        title, 
        payload.tag, 
        payload.desc, 
        payload.year, 
        payload.role, 
        payload.tech.join(","), 
        JSON.stringify(payload.details), 
        payload.live, 
        payload.repo, 
        payload.sortOrder
      ]);

    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await query("DELETE FROM Projects WHERE Id = $1", [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// =======================
// VIEW MESSAGES (ADMIN)
// =======================
app.get("/api/messages", requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const size = Math.min(100, Math.max(5, Number(req.query.size || 25)));
    const offset = (page - 1) * size;

    const totalResult = await query(`
      SELECT COUNT(1) AS Total
      FROM ContactMessages
    `);

    const result = await query(`
        SELECT Id, FullName, Email, Message, IpAddress, UserAgent, CreatedAt
        FROM ContactMessages
        ORDER BY CreatedAt DESC
        LIMIT $1 OFFSET $2
      `, [size, offset]);

    res.json({
      ok: true,
      page,
      size,
      total: Number(totalResult.rows?.[0]?.total || 0),
      messages: result.rows || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// =======================
// ADMIN DASHBOARD & HOME
// =======================
app.get("/admin", (req, res) => {
  const dashboardPath = path.join(__dirname, "public.bak", "dashboard.html");
  if (fs.existsSync(dashboardPath)) return res.sendFile(dashboardPath);
  res.status(404).send("Dashboard not found (check public.bak)");
});

app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "public.bak", "index.html");
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.json({ ok: true, message: "Portfolio API is running. Frontend is on Netlify." });
});

//Public API to fetch projects
app.get("/api/public/projects", async (req, res) => {
  try {
    const result = await query(`
      SELECT Id, Title, Tag, Description, ProjectYear, Role, TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder
      FROM Projects
      ORDER BY SortOrder ASC, ProjectYear DESC
    `);
    res.json({ ok: true, projects: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// =======================
// HELPERS
// =======================
function safeJsonArray(v) {
  try {
    const p = JSON.parse(v || "[]");
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

// =======================
// START SERVER
// =======================
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () =>
  console.log(`API running → http://localhost:${PORT}`)
);
