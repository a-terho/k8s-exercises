import { Todo } from '@/app/types';

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

interface Props {
  todo: Todo;
  doneButtonAction: (formData: FormData) => void;
}

const TodoItem = ({ todo, doneButtonAction }: Props) => {
  const message = addLinks(todo.message);

  if (todo.done) {
    return (
      <li className="card done">
        <div>
          <del>{message}</del>
        </div>
        <span className="">
          <strong>Done</strong>
        </span>
      </li>
    );
  }

  return (
    <li className="card">
      <div>{message}</div>
      <form action={doneButtonAction}>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 text-white text-sm px-2 py-1 rounded"
        >
          Mark done
        </button>
        <input type="hidden" name="id" value={todo.id} />
      </form>
    </li>
  );
};

export default TodoItem;
