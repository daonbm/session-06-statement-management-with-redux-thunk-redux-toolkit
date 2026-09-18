import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ViewMode, EngineMode, ThemeMode, ToastMessage, Task } from '../../types/task';

interface UIState {
  theme: ThemeMode;
  viewMode: ViewMode;
  engineMode: EngineMode;
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  deletingTask: Task | null;
  isApiModalOpen: boolean;
  toasts: ToastMessage[];
}

const initialState: UIState = {
  theme: 'light',
  viewMode: 'grid',
  engineMode: 'thunk',
  isTaskModalOpen: false,
  editingTask: null,
  deletingTask: null,
  isApiModalOpen: false,
  toasts: []
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setEngineMode: (state, action: PayloadAction<EngineMode>) => {
      state.engineMode = action.payload;
    },
    openCreateModal: (state) => {
      state.editingTask = null;
      state.isTaskModalOpen = true;
    },
    openEditModal: (state, action: PayloadAction<Task>) => {
      state.editingTask = action.payload;
      state.isTaskModalOpen = true;
    },
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.editingTask = null;
    },
    openDeleteModal: (state, action: PayloadAction<Task>) => {
      state.deletingTask = action.payload;
    },
    closeDeleteModal: (state) => {
      state.deletingTask = null;
    },
    openApiModal: (state) => {
      state.isApiModalOpen = true;
    },
    closeApiModal: (state) => {
      state.isApiModalOpen = false;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = Date.now().toString() + Math.random().toString();
      state.toasts.push({ id, ...action.payload });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    }
  }
});

export const {
  toggleTheme,
  setViewMode,
  setEngineMode,
  openCreateModal,
  openEditModal,
  closeTaskModal,
  openDeleteModal,
  closeDeleteModal,
  openApiModal,
  closeApiModal,
  addToast,
  removeToast
} = uiSlice.actions;

export default uiSlice.reducer;