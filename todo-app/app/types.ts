export interface Todo {
  id: number;
  message: string;
  done: boolean;
}

export interface AddTodoState {
  error?: string;
  success: boolean;
}
