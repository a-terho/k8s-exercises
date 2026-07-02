import type { Todo } from '@/app/types';

const todoEndpoint = 'http://todo-backend-svc:1234/todos';

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(todoEndpoint, { next: { tags: ['todos'] } });
  return res.json();
};

export const addTodo = async (message: string): Promise<Todo | null> => {
  const res = await fetch(todoEndpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  // for non-2** requests respond with nothing
  if (!res.ok) return null;

  return res.json();
};

const todoService = { getTodos, addTodo };
export default todoService;
