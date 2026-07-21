import config from '@/app/util/config';

export const breakApp = async () => {
  return fetch(`${config.backendUrl}/breakz`, { method: 'post' });
};

export const checkHealth = async () => {
  try {
    const res = await fetch(`${config.backendUrl}/healthz`);
    if (!res.ok) throw new Error('Service reported itself being broken');
    return true;
  } catch {
    return false;
  }
};
