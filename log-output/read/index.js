const fs = require('node:fs').promises;
const path = require('node:path');
const crypto = require('node:crypto');

const express = require('express');
const app = express();

const pingsEndpoint = 'http://ping-pong-svc:2345/pings';
const logFilePath = path.join('/', 'usr', 'src', 'app', 'tmp', 'app.log');

const getPings = async () => {
  try {
    const res = await fetch(pingsEndpoint);
    if (res.ok) {
      return res.text();
    }
    // status code was not 2**
    return '<request error>';
  } catch (err) {
    // fetch throws on DNS resolution errors
    if (err.cause?.code === 'ENOTFOUND') {
      return '<service unavailable>';
    }
    return '<connection error>';
  }
};

app.get('/', async (req, res) => {
  try {
    // fetch ping-pong app and generate dynamic content
    const pingpong = await getPings();
    const timestamp = new Date().toISOString();
    const uuid = crypto.randomUUID();
    const content = `${timestamp}: ${uuid}\nPing / Pongs: ${pingpong}`;

    res.set('Content-Type', 'text/plain');
    return res.status(200).send(content);
  } catch (err) {
    // with read errors print only the error message
    console.log(err.message);
    return res.status(500).send(err.message);
  }
});

// move previous functionality under a different route
app.get('/log', async (req, res) => {
  try {
    // send file content as response
    const content = await fs.readFile(logFilePath, 'utf8');
    res.set('Content-Type', 'text/plain');
    return res.status(200).send(content);
  } catch (err) {
    // with read errors print the error also to the console
    console.log(err.message);
    return res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
