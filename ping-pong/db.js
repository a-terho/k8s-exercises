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
  try {
    return await dbPool.query(...args);
  } catch (err) {
    console.log('Query error:', err.message);
    throw err;
  }
};

const initDbTable = async () => {
  try {
    // make sure the connection is available first
    await testConnection({ retries: 10, delayMs: 2000 });
    await query(`
      CREATE TABLE IF NOT EXISTS pings(
        id INTEGER PRIMARY KEY DEFAULT 1,
        count INTEGER DEFAULT 0
      )`);
    await query(
      'INSERT INTO pings(id, count) VALUES (1, 0) ON CONFLICT (id) DO NOTHING',
    );
    return true;
  } catch (err) {
    console.log('Database initialization failed:', err.message);
    return false;
  }
};

const testConnection = async ({ retries, delayMs }) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await query('SELECT 1');
      console.log('Database connection available');
      return; // exit early
    } catch (err) {
      console.log(`Database connection unavailable (attempt ${i})`);
      if (i === retries) throw err; // only throw after enough retries
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
};

dbPool.on('error', (err) => {
  console.log('Stale database client error:', err.message);
});

module.exports = { query, initDbTable };
