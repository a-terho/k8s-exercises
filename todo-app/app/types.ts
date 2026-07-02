export interface Todo {
  id: number;
  message: string;
}

export interface AddTodoState {
  error?: string;
  success: boolean;
}
