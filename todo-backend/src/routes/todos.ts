import express, { type Request, type Response } from 'express';
import type { ApiError, Todo } from '../types.ts';

const router = express.Router();
export default router;

const todos = [
  {
    id: 0,
    message: 'Learn Kubernetes basics',
  },
  {
    id: 1,
    message: 'Deploy application to cluster',
  },
  {
    id: 2,
    message: 'Configure persistent volumes',
  },
];

router.get('/', (_req: Request, res: Response<Todo[]>) => {
  return res.status(200).json(todos);
});

router.post(
  '/',
  (
    req: Request<undefined, undefined, { message?: string }>,
    res: Response<Todo | ApiError>,
  ) => {
    const { message } = req.body;

    if (message) {
      const newTodo: Todo = {
        id: todos.length, // this logic works for now
        message,
      };
      todos.push(newTodo);
      return res.status(201).json(newTodo);
    }

    return res
      .status(400)
      .json({ error: { message: '"message" is required' } });
  },
);
