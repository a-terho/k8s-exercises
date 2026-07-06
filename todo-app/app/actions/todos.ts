'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { addTodo } from '@/app/services/todos';
import type { AddTodoState } from '@/app/types';
import logger from '@/app/util/logger';

export const addTodoAction = async (
  _prevState: AddTodoState,
  formData: FormData,
): Promise<AddTodoState> => {
  const message = formData.get('message');

  if (typeof message !== 'string' || message === '') {
    return { error: 'Message is required', success: false };
  }

  try {
    const newTodo = await addTodo(message);
    if (newTodo === null) {
      return { error: 'Database error, adding todo failed', success: false };
    }
  } catch (err) {
    logger.debug(String(err));
    return { error: 'Connection error, adding todo failed', success: false };
  }

  revalidateTag('todos', 'max');
  revalidatePath('/');
  return { success: true };
};
