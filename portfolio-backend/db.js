const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

// For Render/Cloud, use DATABASE_URL. 
// For local, you can use separate vars or just a local URL.
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

module.exports = { 
  query,
  pool,
  // Helper to maintain some compatibility with original getPool if needed
  getPool: () => pool 
};
