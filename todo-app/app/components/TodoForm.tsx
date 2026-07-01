'use client';

import { useState } from 'react';

const MAX_LENGTH = 140;

const TodoForm = () => {
  const [value, setValue] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-row gap-2 p-1 mt-3 w-full">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Enter a new todo (max 140 characters)"
          maxLength={MAX_LENGTH}
          className="flex grow border border-green-600 focus:ring-green-600 px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded"
        >
          Send
        </button>
      </form>
      <span
        className={`block w-full text-center text-gray-400 ${value.length > 0 ? 'visible' : 'invisible'}`}
      >
        {value.length}/{MAX_LENGTH} characters
      </span>
    </div>
  );
};

export default TodoForm;
