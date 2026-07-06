import { getTodos } from '@/app/services/todos';
import type { Todo } from '@/app/types';
import logger from '@/app/util/logger';

// convert https:// and http:// links in todos into anchor tags
const addLinks = (text: string) => {
  const regex = /(https?:\/\/[^\s<]+)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (part.match(regex)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {truncateString(part)}
        </a>
      );
    }
    return part;
  });
};

// cuts down long links
const truncateString = (text: string, maxLength = 60) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

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
        <li className="text-center">No todos yet.</li>
      ) : (
        todos.map((todo) => (
          <li key={todo.id} className="card">
            {addLinks(todo.message)}
          </li>
        ))
      )}
    </ul>
  );
};

export default TodoList;
