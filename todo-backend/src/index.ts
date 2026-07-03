import express, { type Request } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import todoRouter from './routes/todos.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// prepare request logger
morgan.token('body', (req: Request, _res) => JSON.stringify(req.body));
const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body',
);
app.use(logger);

app.use('/todos', todoRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
