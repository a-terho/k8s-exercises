const express = require('express');
const app = express();

const { query, ensureDbTable, testConnection } = require('./db.js');

let counter = 0;
let isCounterInitialized = false;

// this route is meant to be reached only within Kubernetes cluster
app.get('/pings', (_req, res) => {
  return res.status(200).send(counter);
});

// readiness probe endpoint
app.get('/readyz', async (_req, res) => {
  try {
    await testConnection({ attempts: 1, delayMs: 0, stdout: false });
    if (!isCounterInitialized) {
      console.log('Database connection available');
      await initCounter();
    }
    return res.status(200).send('ok');
  } catch (err) {
    return res.status(500).end();
  }
});

const initCounter = async () => {
  await ensureDbTable();
  const result = await query('SELECT count FROM pings WHERE id = 1');
  counter = result.rows[0].count;

  console.log(`Counter initialized to ${counter}`);
  isCounterInitialized = true;
};

app.get('/{*splat}', async (req, res) => {
  let response = `pong ${counter++}`;
  console.log(`GET ${req.url} ${response}`);

  if (isCounterInitialized) {
    try {
      const result = await query('UPDATE pings SET count = $1 WHERE id = 1', [
        counter,
      ]);
    } catch (err) {
      response += ' (not saved)';
      console.log('database update failed:', err.message);
    }
  }

  return res.status(200).send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running at port ${PORT}`);

  // database connection is not always immediately available when application starts
  try {
    await testConnection({ attempts: 10, delayMs: 2000 });
    await initCounter();
  } catch (err) {
    const message = err.message ? ` (${err.message})` : ``;
    console.log(
      `Database couldn't be reached and counter wasn't initialized${message}. Reattempting if connection becomes available.`,
    );
  }
});
