import express, { type Request, type Response } from 'express';
const router = express.Router();
export default router;

const todos = [
  {
    id: '0',
    message: 'Learn Kubernetes basics',
  },
  {
    id: '1',
    message: 'Deploy application to cluster',
  },
  {
    id: '2',
    message: 'Configure persistent volumes',
  },
];

router.get('/', (_req: Request, res: Response) => {
  return res.status(200).json(todos);
});
