const DEFAULT_MAX_TODO_LENGTH = 140;

const config = {
  maxTodoLength:
    Number(process.env.MAX_TODO_LENGTH) >= 1
      ? Number(process.env.MAX_TODO_LENGTH)
      : DEFAULT_MAX_TODO_LENGTH,
  operating_mode: process.env.OPERATING_MODE || 'log',
} as const;

export default config;
