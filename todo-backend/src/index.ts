import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import morgan from 'morgan';
import todoRouter from './routes/todos.ts';
import { isDbReady } from './db/readiness.ts';
import nats from './nats/index.ts';

const app = express();
const PORT = process.env.PORT || 4000;

let broken = false;

app.use(express.json());

// prepare request logger
morgan.token('body', (req: Request, _res) => JSON.stringify(req.body));
const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body',
);
app.use(logger);

app.use('/todos', todoRouter);

app.post('/breakz', (_req, res: Response) => {
  const prev = broken;
  broken = true;
  if (prev != broken) console.log('app has been broken');
  return res.status(200).send('app is now broken');
});

app.get('/readyz', async (_req, res) => {
  if (await isDbReady()) {
    return res.status(200).json({ status: 'ready' });
  }
  return res.status(500).json({ status: 'not ready' });
});

app.get('/healthz', (_req, res: Response) => {
  if (broken) {
    return res.status(500).json({ status: 'unhealthy' });
  }
  return res.status(200).json({ status: 'ok' });
});

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  try {
    await nats.initialize();
    console.log('Successfully connected to NATS');
  } catch (err) {
    console.log('Failed to connect to NATS');
  }
});
