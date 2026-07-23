export interface Todo {
  id: number;
  message: string;
  done: boolean;
}

export interface ApiError {
  error: {
    message: string;
    code?: string;
  };
}
