const express = require('express');
const app = express();

let counter = 0;

app.get('/{*splat}', (req, res) => {
  const response = `pong ${counter++}`;
  console.log(`GET ${req.url} ${response}`);
  return res.status(200).send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
