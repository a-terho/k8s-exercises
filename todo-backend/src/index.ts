import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import todoRouter from './routes/todos.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use('/todos', todoRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
