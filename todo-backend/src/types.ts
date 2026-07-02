export interface Todo {
  id: number;
  message: string;
}

export interface ApiError {
  error: {
    message: string;
    code?: string;
  };
}
