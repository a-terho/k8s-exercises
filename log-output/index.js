const express = require('express');
const app = express();

// generate random string once (strips 0. from random number)
const randomString = Math.random().toString(36).slice(2);

const getStatus = () => {
  const now = new Date();
  return `${now.toISOString()}: ${randomString}`;
};

const main = () => {
  const status = getStatus();
  console.log(status);

  // keep alive
  setTimeout(main, 5000);
};

app.get('/status', (_req, res) => {
  const status = getStatus();
  return res.status(200).send(status);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
  main();
});
