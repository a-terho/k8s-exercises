import 'dotenv/config';
import express, { type Request, type Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from version 2');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
