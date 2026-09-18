export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tags: string[];
  createdAt?: string;
}

export type CreateTaskDTO = Omit<Task, 'id' | 'createdAt'>;
export type UpdateTaskDTO = Partial<Task>;

export type ViewMode = 'grid' | 'kanban';
export type EngineMode = 'thunk' | 'rtk-query';
export type ThemeMode = 'light' | 'dark';

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  sortBy: 'dueDate' | 'title' | 'priority' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}