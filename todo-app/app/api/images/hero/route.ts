import { loadImage } from '@/app/util/imageCache';
import { readFile } from 'fs/promises';

export const GET = async () => {
  // read cached image to a buffer
  const { path } = await loadImage();
  const imageBuffer = await readFile(path);

  // then send is as the response
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'no-store',
    },
  });
};
