const fs = require('node:fs').promises;
const path = require('node:path');
const express = require('express');
const app = express();

const { query, initDbTable } = require('./db.js');
const filePath = path.join('/', 'usr', 'src', 'app', 'files', 'requests.log');

let counter = 0;
let useFilesystem = false;

// this route is meant to be reached only within Kubernetes cluster
app.get('/pings', (_req, res) => {
  return res.status(200).send(counter);
});

const initCounter = async () => {
  // use legacy system as a backup
  if (useFilesystem) {
    try {
      const pingpong = await fs.readFile(filePath, 'utf8');
      if (!isNaN(pingpong)) {
        counter = Number(pingpong);
      } else {
        console.log('invalid number in requests.log file, initializing at 0');
      }
    } catch (err) {
      console.log('failed to read requests.log file, initializing at 0');
    }
    return; // exit early
  }

  try {
    const result = await query('SELECT count FROM pings WHERE id = 1');
    counter = result.rows[0].count;
  } catch (err) {
    console.log('failed to read from database, initializing at 0');
  }
};

app.get('/{*splat}', async (req, res) => {
  let response = `pong ${counter++}`;
  console.log(`GET ${req.url} ${response}`);

  if (useFilesystem) {
    try {
      await fs.writeFile(filePath, String(counter), 'utf8');
    } catch (err) {
      response += ' (not saved)';
      console.log('file update failed:', err.message);
    }
  } else {
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
  // if connection cannot be established at all, use filesystem saves while app runs
  if (!(await initDbTable())) {
    console.log('Using file system storage as backup');
    useFilesystem = true;
  }
  await initCounter();
});
