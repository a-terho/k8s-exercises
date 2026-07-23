import { markTodoDoneAction } from '@/app/actions/todos';
import { getTodos } from '@/app/services/todos';
import type { Todo } from '@/app/types';
import logger from '@/app/util/logger';

import TodoItem from './TodoItem';

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

  // Order todos based on their id as backend might return them in any order
  todos = todos.sort((a, b) => a.id - b.id);

  return (
    <ul className="space-y-2 w-full m-2">
      {error ? (
        <li className="text-red-500 text-center">{error}</li>
      ) : todos.length === 0 ? (
        <li className="text-center">No todos yet.</li>
      ) : (
        todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            doneButtonAction={markTodoDoneAction}
          />
        ))
      )}
    </ul>
  );
};

export default TodoList;
