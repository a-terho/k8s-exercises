'use server';

import { revalidatePath } from 'next/cache';
import { breakApp } from '@/app/services/health';

export const breakAppAction = async (): Promise<void> => {
  await breakApp();
  revalidatePath('/');
};
