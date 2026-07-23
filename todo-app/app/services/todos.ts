import config from '@/app/util/config';
import type { Todo } from '@/app/types';

const todoEndpoint = `${config.backendUrl}/todos`;

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(todoEndpoint, { next: { tags: ['todos'] } });
  // for non-2** statuses throw an error
  if (!res.ok) throw new Error('Database unavailable');
  return res.json();
};

export const addTodo = async (message: string): Promise<Todo | null> => {
  const res = await fetch(todoEndpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  // for non-2** statuses respond with nothing
  if (!res.ok) return null;

  return res.json();
};

export const markTodoDone = async (id: string) => {
  const res = await fetch(`${todoEndpoint}/${id}`, { method: 'put' });
  if (!res.ok) return false;
  return true;
};

const todoService = { getTodos, addTodo, markTodoDone };
export default todoService;
