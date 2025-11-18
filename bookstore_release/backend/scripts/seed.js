/* Seed RDS/local DB using Node (no psql required) */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async () => {
  const sqlPath = path.join(__dirname, '..', 'sql', 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  } finally {
    await client.end().catch(()=>{});
  }
})();