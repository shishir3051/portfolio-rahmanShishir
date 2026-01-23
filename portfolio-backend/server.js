require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { sql, getPool } = require("./db");

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

// Serve admin dashboard static file
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

    const pool = await getPool();
    await pool.request()
      .input("FullName", sql.NVarChar(120), name)
      .input("Email", sql.NVarChar(254), email)
      .input("Message", sql.NVarChar(sql.MAX), message)
      .input("IpAddress", sql.NVarChar(64), ip)
      .input("UserAgent", sql.NVarChar(512), ua)
      .query(`
        INSERT INTO dbo.ContactMessages
          (FullName, Email, Message, IpAddress, UserAgent)
        VALUES
          (@FullName, @Email, @Message, @IpAddress, @UserAgent)
      `);

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
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id, Title, Tag, Description, ProjectYear, Role,
             TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder
      FROM dbo.Projects
      WHERE IsActive = 1
      ORDER BY SortOrder ASC, Id DESC
    `);

    const projects = result.recordset.map(r => ({
      id: r.Id,
      title: r.Title,
      tag: r.Tag,
      desc: r.Description,
      year: r.ProjectYear,
      role: r.Role,
      tech: (r.TechCsv || "").split(",").map(x => x.trim()).filter(Boolean),
      details: safeJsonArray(r.DetailsJson),
      live: r.LiveUrl,
      repo: r.RepoUrl
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

    const pool = await getPool();
    const result = await pool.request()
      .input("Title", sql.NVarChar(200), title)
      .input("Tag", sql.NVarChar(80), payload.tag || null)
      .input("Description", sql.NVarChar(800), payload.desc || null)
      .input("ProjectYear", sql.NVarChar(10), payload.year || null)
      .input("Role", sql.NVarChar(120), payload.role || null)
      .input("TechCsv", sql.NVarChar(800), payload.tech.join(",") || null)
      .input("DetailsJson", sql.NVarChar(sql.MAX), JSON.stringify(payload.details))
      .input("LiveUrl", sql.NVarChar(500), payload.live || null)
      .input("RepoUrl", sql.NVarChar(500), payload.repo || null)
      .input("SortOrder", sql.Int, payload.sortOrder)
      .query(`
        INSERT INTO dbo.Projects
          (Title, Tag, Description, ProjectYear, Role,
           TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder)
        OUTPUT INSERTED.Id
        VALUES
          (@Title, @Tag, @Description, @ProjectYear, @Role,
           @TechCsv, @DetailsJson, @LiveUrl, @RepoUrl, @SortOrder)
      `);

    res.json({ ok: true, id: result.recordset[0].Id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await getPool();
    await pool.request()
      .input("Id", sql.Int, id)
      .query("DELETE FROM dbo.Projects WHERE Id = @Id");
    
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

    const pool = await getPool();

    const totalResult = await pool.request().query(`
      SELECT COUNT(1) AS Total
      FROM dbo.ContactMessages
    `);

    const result = await pool.request()
      .input("offset", sql.Int, offset)
      .input("size", sql.Int, size)
      .query(`
        SELECT Id, FullName, Email, Message, IpAddress, UserAgent, CreatedAt
        FROM dbo.ContactMessages
        ORDER BY CreatedAt DESC
        OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY
      `);

    res.json({
      ok: true,
      page,
      size,
      total: Number(totalResult.recordset?.[0]?.Total || 0),
      messages: result.recordset || []
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
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//Public API to fetch projects
app.get("/api/public/projects", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id, Title, Tag, Description, ProjectYear, Role, TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder
      FROM dbo.Projects
      ORDER BY SortOrder ASC, ProjectYear DESC
    `);
    res.json({ ok: true, projects: result.recordset });
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
