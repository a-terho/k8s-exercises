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
    await addTodo(message);
  } catch (err) {
    logger.debug(String(err));
    return { error: 'Adding todo failed', success: false };
  }

  revalidateTag('todos', 'max');
  revalidatePath('/');
  return { success: true };
};
