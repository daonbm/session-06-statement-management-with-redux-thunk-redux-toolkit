import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';

const STORAGE_KEY = 'redux_tasks_app_data';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Nghiên cứu Redux Toolkit Query',
    description: 'Tìm hiểu về caching, invalidation tags và auto-generated hooks.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-06-15',
    tags: ['React', 'Redux', 'Architecture'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Xây dựng Engine Switcher',
    description: 'Tạo cơ chế chuyển đổi trực quan giữa Thunk và RTK Query.',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-06-20',
    tags: ['Frontend', 'UI/UX'],
    createdAt: new Date().toISOString()
  }
];

const getStoredTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
      return initialTasks;
    }
    return JSON.parse(data);
  } catch {
    return initialTasks;
  }
};

const saveStoredTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getStoredTasks();
  },

  async getTaskById(id: string): Promise<Task> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const tasks = getStoredTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    return task;
  },

  async createTask(dto: CreateTaskDTO): Promise<Task> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const tasks = getStoredTasks();
    const newTask: Task = {
      ...dto,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    saveStoredTasks(tasks);
    return newTask;
  },

  async updateTask(id: string, dto: UpdateTaskDTO): Promise<Task> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const tasks = getStoredTasks();
    let updated: Task | null = null;
    const newTasks = tasks.map((t) => {
      if (t.id === id) {
        updated = { ...t, ...dto };
        return updated;
      }
      return t;
    });
    if (!updated) throw new Error('Task not found');
    saveStoredTasks(newTasks);
    return updated;
  },

  async deleteTask(id: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const tasks = getStoredTasks();
    const newTasks = tasks.filter((t) => t.id !== id);
    saveStoredTasks(newTasks);
    return id;
  },

  async seedTasks(): Promise<Task[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    saveStoredTasks(initialTasks);
    return initialTasks;
  }
};