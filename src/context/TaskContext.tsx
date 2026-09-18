import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskFilter, ViewMode, ToastAlert, TaskStatus } from '../types/task';
import { taskService } from '../services/taskService';
import { getStoredApiUrl, setStoredApiUrl, testApiConnection } from '../services/api';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  isFallbackMode: boolean;
  apiUrl: string;
  filters: TaskFilter;
  viewMode: ViewMode;
  theme: 'dark' | 'light';
  toasts: ToastAlert[];
  
  // Modal states
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  deletingTask: Task | null;
  isApiModalOpen: boolean;

  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (task: Task) => Promise<void>;
  seedTasks: () => Promise<void>;
  
  // Filter & UI Controls
  setFilters: React.Dispatch<React.SetStateAction<TaskFilter>>;
  updateFilter: (key: keyof TaskFilter, value: any) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTheme: () => void;
  updateApiUrl: (url: string) => Promise<boolean>;

  // Toast Alerts
  addToast: (type: ToastAlert['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Modal Handlers
  openCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeTaskModal: () => void;
  openDeleteModal: (task: Task) => void;
  closeDeleteModal: () => void;
  openApiModal: () => void;
  closeApiModal: () => void;
}

const defaultFilters: TaskFilter = {
  search: '',
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>(getStoredApiUrl());
  const [filters, setFilters] = useState<TaskFilter>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  // Apply Theme attribute to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast Helper
  const addToast = useCallback((type: ToastAlert['type'], title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch tasks using Axios service
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { tasks: fetched, isFallback } = await taskService.getTasks();
      setTasks(fetched);
      setIsFallbackMode(isFallback);
    } catch (err: any) {
      addToast('error', 'Lỗi tải dữ liệu', err.message || 'Không thể kết nối tới server API.');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create Task
  const createTask = async (data: CreateTaskDto) => {
    setLoading(true);
    try {
      const { task, isFallback } = await taskService.createTask(data);
      setTasks(prev => [task, ...prev]);
      setIsFallbackMode(isFallback);
      addToast(
        'success',
        'Tạo công việc thành công',
        `Task "${task.title}" đã được lưu ${isFallback ? '(Chế độ Fallback Local)' : 'trên MockAPI.io'}.`
      );
      closeTaskModal();
    } catch (err: any) {
      addToast('error', 'Lỗi tạo task', err.message || 'Không thể tạo task mới.');
    } finally {
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async (id: string, data: UpdateTaskDto) => {
    setLoading(true);
    try {
      const { task, isFallback } = await taskService.updateTask(id, data);
      setTasks(prev => prev.map(t => (t.id === id ? task : t)));
      setIsFallbackMode(isFallback);
      addToast('success', 'Cập nhật thành công', `Công việc "${task.title}" đã được cập nhật.`);
      closeTaskModal();
    } catch (err: any) {
      addToast('error', 'Lỗi cập nhật', err.message || 'Không thể cập nhật thông tin task.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Task
  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      const taskToDelete = tasks.find(t => t.id === id);
      const { isFallback } = await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setIsFallbackMode(isFallback);
      addToast('success', 'Đã xóa công việc', `Công việc "${taskToDelete?.title || id}" đã bị xóa.`);
      closeDeleteModal();
    } catch (err: any) {
      addToast('error', 'Lỗi xóa task', err.message || 'Không thể xóa công việc này.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Status Toggle: pending -> in_progress -> completed -> pending
  const toggleTaskStatus = async (task: Task) => {
    let nextStatus: TaskStatus = 'pending';
    if (task.status === 'pending') nextStatus = 'in_progress';
    else if (task.status === 'in_progress') nextStatus = 'completed';
    else nextStatus = 'pending';

    await updateTask(task.id, { status: nextStatus });
  };

  // Seed sample tasks to MockAPI / local
  const seedTasks = async () => {
    setLoading(true);
    try {
      const { count, isFallback } = await taskService.seedTasks();
      await fetchTasks();
      addToast(
        'info',
        'Khởi tạo dữ liệu mẫu',
        `Đã tạo thành công ${count} công việc thử nghiệm ${isFallback ? '(Chế độ Fallback Local)' : 'trên MockAPI.io'}.`
      );
    } catch (err: any) {
      addToast('error', 'Lỗi seed data', err.message || 'Không thể tạo dữ liệu mẫu.');
    } finally {
      setLoading(false);
    }
  };

  // Update API Base URL configuration
  const updateApiUrl = async (newUrl: string): Promise<boolean> => {
    setLoading(true);
    const cleanUrl = newUrl.trim();
    const isConnected = await testApiConnection(cleanUrl);
    setStoredApiUrl(cleanUrl);
    setApiUrl(cleanUrl);
    
    if (isConnected) {
      addToast('success', 'Kết nối MockAPI thành công', `Đã chuyển API endpoint sang: ${cleanUrl}`);
    } else {
      addToast('warning', 'Cảnh báo API', `Không thể lấy dữ liệu từ endpoint này. Ứng dụng sẽ sử dụng chế độ Local Fallback.`);
    }
    
    await fetchTasks();
    setIsApiModalOpen(false);
    return isConnected;
  };

  // Helper filter modifier
  const updateFilter = (key: keyof TaskFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modal actions
  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const openDeleteModal = (task: Task) => {
    setDeletingTask(task);
  };

  const closeDeleteModal = () => {
    setDeletingTask(null);
  };

  const openApiModal = () => setIsApiModalOpen(true);
  const closeApiModal = () => setIsApiModalOpen(false);

  // Filtered & Sorted Tasks Memoization
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search term filter
      const matchesSearch =
        filters.search === '' ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignee.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));

      // Status filter
      const matchesStatus = filters.status === 'all' || task.status === filters.status;

      // Priority filter
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        return filters.sortOrder === 'asc'
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (filters.sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return filters.sortOrder === 'asc'
          ? priorityWeight[a.priority] - priorityWeight[b.priority]
          : priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (filters.sortBy === 'title') {
        return filters.sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      // Default: createdAt
      return filters.sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filters]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        loading,
        isFallbackMode,
        apiUrl,
        filters,
        viewMode,
        theme,
        toasts,

        isTaskModalOpen,
        editingTask,
        deletingTask,
        isApiModalOpen,

        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        seedTasks,

        setFilters,
        updateFilter,
        setViewMode,
        toggleTheme,
        updateApiUrl,

        addToast,
        removeToast,

        openCreateModal,
        openEditModal,
        closeTaskModal,
        openDeleteModal,
        closeDeleteModal,
        openApiModal,
        closeApiModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
