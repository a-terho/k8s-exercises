const fs = require('node:fs').promises;
const path = require('node:path');
const express = require('express');
const app = express();

const filePath = path.join('/', 'usr', 'src', 'app', 'files', 'app.log');

app.get('/', async (req, res) => {
  try {
    // send file content as response
    const content = await fs.readFile(filePath, 'utf8');
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
