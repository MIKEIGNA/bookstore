const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bookstore'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  init: async () => {
    await pool.query('SELECT 1');
  }
};
