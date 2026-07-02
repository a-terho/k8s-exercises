import { Todo } from '@/app/types';

const todoEndpoint = 'http://todo-backend-svc:1234/todos';

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const res = await fetch(todoEndpoint);
    if (!res.ok) {
      throw new Error('Bad response from the endpoint');
    }
    return res.json();
  } catch {
    return [];
  }
};

const todoService = { getTodos };
export default todoService;
