const { Pool } = require('pg');

// connection string format is postgres://user:password@host
// const connectionString = process.env.DB_CONNECTION_STRING;
// const dbPool = new Pool({ connectionString });

const dbPool = new Pool({
  user: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.DATABASE_HOST,
});

const query = async (...args) => {
  return dbPool.query(...args);
};

const ensureDbTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS pings(
        id INTEGER PRIMARY KEY DEFAULT 1,
        count INTEGER DEFAULT 0
      )`);
    await query(
      'INSERT INTO pings(id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING',
    );
  } catch (err) {
    const message = err.message ? ` (${err.message})` : ``;
    console.log(`Ensuring database table failed${message}`);
    throw err;
  }
};

const testConnection = async ({ attempts, delayMs, stdout = true }) => {
  for (let i = 1; i <= attempts; i++) {
    try {
      await query('SELECT 1');
      if (stdout) console.log('Database connection available');
      return; // exit early
    } catch (err) {
      if (stdout) {
        const attemptCount = attempts > 1 ? ` (attempt ${i})` : ``;
        const message = err.message ? `: ${err.message}` : ``;
        console.log(`Database connection unavailable${attemptCount}${message}`);
      }
      if (i === attempts) throw err; // only throw after enough attempts
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
};

dbPool.on('error', (err) => {
  console.log('Stale database client error:', err.message);
});

module.exports = { query, ensureDbTable, testConnection };
