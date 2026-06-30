const fs = require('node:fs').promises;
const path = require('node:path');
const express = require('express');
const app = express();

const filePath = path.join('/', 'usr', 'src', 'app', 'files', 'requests.log');

let counter = 0;

const initCounter = async () => {
  try {
    // read saved counter from file, default to 0 for invalid numbers
    const pingpong = await fs.readFile(filePath, 'utf8');
    if (!isNaN(pingpong)) counter = Number(pingpong);
  } catch (err) {
    console.log('failed to read requests.log file, initializing at 0');
  }
};

app.get('/{*splat}', async (req, res) => {
  const response = `pong ${counter++}`;
  console.log(`GET ${req.url} ${response}`);

  try {
    // outputs the number of GET requests done
    await fs.writeFile(filePath, String(counter), 'utf8');
  } catch (err) {
    // on write errors, display error in the console
    console.log(err.message);
  }

  return res.status(200).send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initCounter();
  console.log(`Server running at port ${PORT}`);
});
