const config = {
  backendUrl: process.env.BACKEND_URL ?? 'http://localhost:4000',
  pictureUrl: process.env.PICTURE_URL,
  ttlMins:
    Number(process.env.PICTURE_TTL_MINS) >= 1
      ? Number(process.env.PICTURE_TTL_MINS)
      : 10,
  maxTodoLength:
    Number(process.env.MAX_TODO_LENGTH) >= 1
      ? Number(process.env.MAX_TODO_LENGTH)
      : undefined,
} as const;

export default config;
