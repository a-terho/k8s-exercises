import express, { type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (_req, res: Response) => {
  return res.status(200).render('index', { title: 'Index' });
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
