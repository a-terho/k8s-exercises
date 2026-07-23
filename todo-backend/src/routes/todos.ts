import express, { type Request, type Response } from 'express';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { todos } from '../db/schema.ts';
import type { ApiError, Todo } from '../types.ts';
import config from '../config.ts';

const router = express.Router();
export default router;

router.get('/', async (_req: Request, res: Response<Todo[]>) => {
  try {
    const todos = await db.query.todos.findMany();
    return res.status(200).json(todos);
  } catch (err) {
    if (err instanceof DrizzleQueryError) {
      console.log(
        'Error when accessing database:',
        `${err.cause?.message} (${err.message})`,
      );
    } else console.log(err);
    return res.status(500).end();
  }
});

router.post(
  '/',
  async (
    req: Request<undefined, undefined, { message?: string }>,
    res: Response<Todo | ApiError>,
  ) => {
    const { message } = req.body;

    if (message) {
      if (message.length > config.maxTodoLength) {
        console.log(
          `Todo was not accepted for being too long (over ${config.maxTodoLength} characters).`,
        );
        return res.status(400).json({
          error: {
            message: `"message" is too long (max length: ${config.maxTodoLength})`,
          },
        });
      }

      try {
        const newTodo = await db.insert(todos).values({ message }).returning();
        return res.status(201).json(newTodo[0]);
      } catch (err) {
        if (err instanceof DrizzleQueryError) {
          console.log(
            'Error when accessing database:',
            `${err.cause?.message} (${err.message})`,
          );
        } else console.log(err);
        return res.status(500).end();
      }
    }

    return res
      .status(400)
      .json({ error: { message: '"message" is required' } });
  },
);

router.put('/:id', async (req: Request<{ id: string }>, res: Response) => {
  if (isNaN(Number(req.params.id)) || Number(req.params.id) < 0) {
    return res
      .status(404)
      .json({ error: `'${req.params.id}' is not valid id` });
  }
  const id = Number(req.params.id);

  const todo: Todo | undefined = await db.query.todos.findFirst({
    where: (todos, { eq }) => eq(todos.id, id),
  });
  if (!todo) {
    return res.status(404).json({ error: `Todo with id ${id} does not exist` });
  }

  const updated = await db
    .update(todos)
    .set({ done: true })
    .where(eq(todos.id, id))
    .returning();
  return res.status(200).json({ todo: updated[0] });
});
