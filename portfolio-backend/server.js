require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const { query } = require("./db");

const JWT_SECRET = process.env.JWT_SECRET || "rahman_secure_secret_2026";

// Configure Resend email service
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify Resend is configured
if (process.env.RESEND_API_KEY) {
  console.log('\x1b[32m[EMAIL]\x1b[0m Resend email service configured');
} else {
  console.warn('\x1b[33m[EMAIL]\x1b[0m Warning: RESEND_API_KEY not set. Email notifications disabled.');
}

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

// Admin Auth Middleware (JWT Based)
function requireAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ ok: false, error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ ok: false, error: "Invalid or expired token." });
  }
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

// =======================
// AUTH ROUTES
// =======================

// Register Initial Admin (One-time or protected)
app.post("/api/auth/setup", async (req, res) => {
  try {
    const { username, password, setupKey } = req.body;
    // Simple protection: only allow if it's the first admin or with a setup key
    if (setupKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ ok: false, error: "Invalid setup key" });
    }

    const check = await query("SELECT Id FROM Admins LIMIT 1");
    if (check.rows.length > 0) return res.status(400).json({ ok: false, error: "Admin already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await query("INSERT INTO Admins (Username, PasswordHash) VALUES ($1, $2)", [username, hash]);
    res.json({ ok: true, message: "Admin account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await query("SELECT * FROM Admins WHERE Username = $1", [username]);
    const admin = result.rows[0];

    if (!admin) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const validPass = await bcrypt.compare(password, admin.passwordhash);
    if (!validPass) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ ok: true, token, user: { username: admin.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Verify Session
app.get("/api/auth/verify", requireAdmin, (req, res) => {
  res.json({ ok: true, user: req.admin });
});

// Update Profile
app.post("/api/auth/update-profile", requireAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminId = req.admin.id;

    if (!username && !password) {
      return res.status(400).json({ ok: false, error: "Nothing to update" });
    }

    if (username) {
      await query("UPDATE Admins SET Username = $1 WHERE Id = $2", [username, adminId]);
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await query("UPDATE Admins SET PasswordHash = $1 WHERE Id = $2", [hash, adminId]);
    }

    res.json({ ok: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Reset Password (Forgot Password)
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { recoveryKey, newPassword } = req.body;

    if (recoveryKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ ok: false, error: "Invalid recovery key" });
    }

    if (!newPassword) {
      return res.status(400).json({ ok: false, error: "New password is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // Assuming there is only one admin for now, or updating all if multiple (usually single)
    await query("UPDATE Admins SET PasswordHash = $1", [hash]);

    res.json({ ok: true, message: "Password reset successful" });
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

    // Save to database
    await query("INSERT INTO ContactMessages (FullName, Email, Message, IpAddress, UserAgent) VALUES ($1, $2, $3, $4, $5)", [name, email, message, ip, ua]);

    // Send email notification with Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const result = await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>', // Resend verified domain
          to: 'gaziur.rahman4311@gmail.com', // Your email
          replyTo: email, // Sender's email for easy reply
          subject: `🔔 New Contact Form Message from ${name}`,
          html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2px; border-radius: 12px;">
            <div style="background: white; border-radius: 10px; padding: 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #667eea; margin: 0; font-size: 28px; font-weight: 800;">📬 New Contact Message</h1>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">Someone reached out through your portfolio!</p>
              </div>
              
              <div style="background: #f9fafb; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div style="margin-bottom: 15px;">
                  <p style="color: #9ca3af; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Sender Name</p>
                  <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0;">${name}</p>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <p style="color: #9ca3af; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Email Address</p>
                  <p style="color: #667eea; font-size: 16px; font-weight: 600; margin: 0;">
                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                  </p>
                </div>
              </div>
              
              <div style="background: #fffbeb; border: 1px solid #fde047; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: #92400e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">📝 Message</p>
                <p style="color: #1f2937; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
                  <strong>💡 Quick Reply:</strong> Just hit "Reply" to respond directly to ${name}.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                  Sent via Portfolio Contact Form • ${new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
                </p>
              </div>
            </div>
          </div>
        `
        });

        console.log(`\x1b[32m[EMAIL SUCCESS]\x1b[0m Email sent! ID: ${result.data?.id || 'unknown'}`);
        console.log(`\x1b[32m[EMAIL]\x1b[0m Message sent to gaziur.rahman4311@gmail.com from ${name}`);
      } catch (emailError) {
        console.error('\x1b[31m[EMAIL ERROR]\x1b[0m Failed to send email:', emailError);
        console.error('\x1b[31m[EMAIL ERROR]\x1b[0m Error details:', JSON.stringify(emailError, null, 2));
      }
    } else {
      console.warn('\x1b[33m[EMAIL]\x1b[0m RESEND_API_KEY not configured - email NOT sent');
    }


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
// Alias for public projects (compatibility) - Updated with Conditional Pagination
app.get("/api/projects", async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let queryText = "SELECT Id, Title, Tag, Description, ProjectYear, Role, TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder FROM Projects WHERE IsActive = true ORDER BY SortOrder ASC, ProjectYear DESC";
    let params = [];

    if (page) {
      const offset = (page - 1) * limit;
      queryText += " LIMIT $1 OFFSET $2";
      params = [limit, offset];
    }

    const countResult = await query("SELECT COUNT(*) FROM Projects WHERE IsActive = true");
    const total = parseInt(countResult.rows[0].count);

    const result = await query(queryText, params);

    const mappedProjects = result.rows.map(r => ({
      ...r, id: r.id, title: r.title, tag: r.tag, desc: r.description, year: r.projectyear, role: r.role,
      tech: (r.techcsv || "").split(",").map(x => x.trim()).filter(Boolean), details: safeJsonArray(r.detailsjson),
      live: r.liveurl, repo: r.repourl
    }));

    res.json({
      ok: true,
      projects: mappedProjects,
      pagination: page ? { total, page, limit, totalPages: Math.ceil(total / limit) } : null
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
// BLOGS (ADMIN)
app.get("/api/blogs", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await query("SELECT COUNT(*) FROM BlogPosts");
    const total = parseInt(countResult.rows[0].count);

    const result = await query("SELECT Id, Title, Excerpt, Content, Category, ReadTime, Featured, IsActive, CreatedAt FROM BlogPosts ORDER BY CreatedAt DESC LIMIT $1 OFFSET $2", [limit, offset]);

    res.json({
      ok: true,
      blogs: result.rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
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
// MESSAGES (ADMIN)
app.get("/api/messages", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const countResult = await query("SELECT COUNT(*) FROM ContactMessages");
    const total = parseInt(countResult.rows[0].count);

    const result = await query("SELECT Id, FullName, Email, Message, CreatedAt FROM ContactMessages ORDER BY CreatedAt DESC LIMIT $1 OFFSET $2", [limit, offset]);

    res.json({
      ok: true,
      messages: result.rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
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
