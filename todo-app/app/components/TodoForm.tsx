'use client';

import { useActionState, useState } from 'react';
import { addTodoAction } from '@/app/actions/todos';
import type { AddTodoState } from '@/app/types';

const DEFAULT_MAX_LENGTH = 140;

const initialState: AddTodoState = {
  success: false,
};

interface Props {
  maxLength?: number;
}

const TodoForm = ({ maxLength = DEFAULT_MAX_LENGTH }: Props) => {
  const [value, setValue] = useState('');
  const [fresh, setFresh] = useState(true);
  const [state, formAction, pending] = useActionState(
    addTodoAction,
    initialState,
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setFresh(false);
  };

  const onSubmit = () => {
    setValue('');
    setFresh(true);
  };

  const hasNewError = state?.error && fresh && !pending;
  const hasNewSuccess = state.success && fresh && !pending;

  return (
    <div>
      <form
        action={formAction}
        onSubmit={onSubmit}
        className="flex flex-row gap-2 p-1 mt-3 w-full"
      >
        <input
          name="message"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={`Enter a new todo (max ${maxLength} characters)`}
          maxLength={maxLength}
          className="flex grow border border-green-600 focus:ring-green-600 px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded"
        >
          Send
        </button>
      </form>
      {hasNewError && value.length === 0 ? (
        <span className="block wfull text-center text-red-500">
          {state.error}
        </span>
      ) : hasNewSuccess && value.length === 0 ? (
        <span className="block wfull text-center text-green-600">
          New todo added!
        </span>
      ) : (
        <span
          className={`block w-full text-center text-gray-400 ${value.length > 0 ? 'visible' : 'invisible'}`}
        >
          {value.length}/{maxLength} characters
        </span>
      )}
    </div>
  );
};

export default TodoForm;
