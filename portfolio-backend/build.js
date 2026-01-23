const fs = require('fs-extra');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Configuration
const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'dist');

// DB Config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function build() {
  console.log("🚀 Starting Static Build for Netlify...");

  try {
    // 1. Clean/Create dist folder
    await fs.emptyDir(DIST_DIR);
    console.log("✔ Cleaned dist/ folder");

    // 2. Fetch Projects from DB
    console.log("⏳ Fetching projects from DB...");
    const result = await pool.query(`
      SELECT Id, Title, Tag, Description, ProjectYear, Role, TechCsv, DetailsJson, LiveUrl, RepoUrl, SortOrder
      FROM Projects
      WHERE IsActive = true
      ORDER BY SortOrder ASC, ProjectYear DESC
    `);
    const projectsRaw = result.rows;
    console.log(`✔ Found ${projectsRaw.length} projects`);

    // Map DB rows to frontend format (matching index.html's fetchProjects logic)
    const projects = projectsRaw.map(p => {
       let details = [];
       try { details = JSON.parse(p.detailsjson || "[]"); } catch(e){}
       
       return {
           id: String(p.id),
           title: p.title,
           tag: p.tag,
           desc: p.description,
           year: p.projectyear,
           role: p.role,
           tech: p.techcsv ? p.techcsv.split(',').map(s=>s.trim()) : [],
           details: details,
           live: p.liveurl,
           repo: p.repourl
       };
    });
    let html = await fs.readFile(path.join(PUBLIC_DIR, 'index.html'), 'utf8');

    // Inject Data: Set existing global PROJECTS variable
    if (html.includes('fetchProjects();')) {
      html = html.replace('fetchProjects();', `
      // [STATIC BUILD INJECTION]
      PROJECTS = ${JSON.stringify(projects)};
      renderProjects();
      /* Static Build */
      `);
      console.log("✔ Injected Static Data into HTML");
    } else {
      console.warn("⚠ Could not find 'fetchProjects();' entry point in HTML");
    }

    // 4. Save HTML to dist
    await fs.writeFile(path.join(DIST_DIR, 'index.html'), html);

    // 5. Copy Static Assets (CSS, Images, JS if any external)
    // We filter out .html files since we handled index.html. 
    // dashboard.html is NOT needed for public site.
    await fs.copy(PUBLIC_DIR, DIST_DIR, {
      filter: (src) => {
        if (src.endsWith('index.html')) return false; // Already handled
        if (src.endsWith('dashboard.html')) return false; // Admin only
        return true;
      }
    });
    console.log("✔ Copied static assets");

    console.log("\n✅ BUILD COMPLETE!");
    console.log("👉 Deploy the 'dist' folder to Netlify.");

    process.exit(0);

  } catch (err) {
    console.error("❌ Build Failed:", err);
    process.exit(1);
  }
}

build();
