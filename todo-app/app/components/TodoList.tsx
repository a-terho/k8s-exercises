import { getTodos } from '@/app/services/todos';

const TodoList = async () => {
  const todos = await getTodos();

  return (
    <ul className="space-y-2 w-full m-2">
      {todos.map((todo) => (
        <li key={todo.id} className="card">
          {todo.message}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
