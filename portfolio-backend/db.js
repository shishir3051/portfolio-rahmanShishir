const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER,          // host only
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  options: {
    instanceName: process.env.DB_INSTANCE, // named instance
    encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === "true",
    trustServerCertificate: String(process.env.DB_TRUST_CERT).toLowerCase() === "true",
  },

  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },

  // helps avoid quick timeouts on slow/blocked connections
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

let pool;

async function getPool() {
  try {
    if (pool) return pool;
    pool = await sql.connect(config);
    return pool;
  } catch (e) {
    pool = null; // IMPORTANT: don’t cache a failed pool
    throw e;
  }
}

module.exports = { sql, getPool };
