const fs = require('node:fs').promises;
const path = require('node:path');

const filePath = path.join('/', 'usr', 'src', 'app', 'files', 'app.log');

// generate random string once (strips 0. from random number)
const randomString = Math.random().toString(36).slice(2);

const getStatus = () => {
  const now = new Date();
  return `${now.toISOString()}: ${randomString}`;
};

const main = async () => {
  const status = getStatus();

  try {
    // print status to the file and to the console
    await fs.appendFile(filePath, `${status}\n`, 'utf8');
    console.log(status);
  } catch (err) {
    // with write errors only print to the console
    console.log(`${status} - ${err.message}`);
  }

  // keep alive
  setTimeout(main, 5000);
};

main();
