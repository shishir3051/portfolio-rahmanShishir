require('dotenv').config();
const { query } = require('../db');
const fs = require('fs');
const path = require('path');

async function init() {
  console.log("⏳ Initializing database...");
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'migration.sql'), 'utf8');
    await query(sql);
    console.log("✅ Database initialized successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    process.exit(1);
  }
}

init();
