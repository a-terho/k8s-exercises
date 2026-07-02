import { getTodos } from '@/app/services/todos';
import type { Todo } from '@/app/types';
import logger from '@/app/util/logger';

const TodoList = async () => {
  let todos: Todo[];
  let error: string | null = null;

  try {
    todos = await getTodos();
  } catch (err) {
    logger.debug(String(err));
    todos = [];
    error = 'Service unavailable';
  }

  return (
    <ul className="space-y-2 w-full m-2">
      {error ? (
        <li className="text-red-500 text-center">{error}</li>
      ) : todos.length === 0 ? (
        <li>No todos yet.</li>
      ) : (
        todos.map((todo) => (
          <li key={todo.id} className="card">
            {todo.message}
          </li>
        ))
      )}
    </ul>
  );
};

export default TodoList;
