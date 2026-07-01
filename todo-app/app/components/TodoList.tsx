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

const TodoList = () => {
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
