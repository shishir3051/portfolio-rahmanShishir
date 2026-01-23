const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true'
  }
};

async function checkProjects() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT Id, Title FROM dbo.Projects");
    console.log("Projects in DB:", result.recordset);
    process.exit(0);
  } catch (err) {
    console.error("SQL Error:", err);
    process.exit(1);
  }
}

checkProjects();
