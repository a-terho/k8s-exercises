import { stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import logger from '@/app/util/logger';

const CACHE_DIR = path.join(process.cwd(), 'cache');
const CACHED_IMG_FILE = path.join(CACHE_DIR, '1200.jpg');
const REMOTE_URL = 'https://picsum.photos/1200';
const TIME_TO_LIVE_MS = 10 * 60 * 1000; // 10 minutes

const getImageTimestamp = async (): Promise<number | null> => {
  try {
    const { mtimeMs } = await stat(CACHED_IMG_FILE);
    return mtimeMs;
  } catch {
    return null;
  }
};

const isStale = (timestamp: number): boolean => {
  return Date.now() - timestamp > TIME_TO_LIVE_MS;
};

export const loadImage = async (): Promise<{
  path: string;
  timestamp: number;
}> => {
  const timestamp = await getImageTimestamp();

  if (!timestamp || isStale(timestamp)) {
    // fetch fresh image from remote url
    const res = await fetch(REMOTE_URL, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`failed to fetch ${CACHED_IMG_FILE}: ${res.status}`);
    }

    // then write it to a file
    const imageBuffer = Buffer.from(await res.arrayBuffer());
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(CACHED_IMG_FILE, imageBuffer);

    // read the new fresh timestampm from new image
    const newTimestamp = (await getImageTimestamp()) ?? Date.now();

    logger.debug(`fetched ${CACHED_IMG_FILE} from ${res.url}`);
    return { path: CACHED_IMG_FILE, timestamp: newTimestamp };
  }

  return { path: CACHED_IMG_FILE, timestamp };
};
