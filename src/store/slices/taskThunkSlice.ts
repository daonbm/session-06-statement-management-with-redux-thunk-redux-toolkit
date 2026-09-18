import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../../types/task';
import { taskService } from '../../services/taskService';
import type { RootState } from '../index';

interface TaskThunkState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  isFallbackMode: boolean;
}

const initialState: TaskThunkState = {
  tasks: [],
  loading: false,
  error: null,
  isFallbackMode: false
};

export const fetchTasksThunk = createAsyncThunk('tasksThunk/fetchAll', async () => {
  return await taskService.getTasks();
});

export const createTaskThunk = createAsyncThunk(
  'tasksThunk/create',
  async (dto: CreateTaskDTO) => {
    return await taskService.createTask(dto);
  }
);

export const updateTaskThunk = createAsyncThunk(
  'tasksThunk/update',
  async ({ id, dto }: { id: string; dto: UpdateTaskDTO }) => {
    return await taskService.updateTask(id, dto);
  }
);

export const deleteTaskThunk = createAsyncThunk('tasksThunk/delete', async (id: string) => {
  return await taskService.deleteTask(id);
});

export const toggleTaskStatusThunk = createAsyncThunk(
  'tasksThunk/toggleStatus',
  async (task: Task, { dispatch }) => {
    const nextStatus: Task['status'] =
      task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'todo';
    const result = await dispatch(
      updateTaskThunk({ id: task.id, dto: { status: nextStatus } })
    ).unwrap();
    return result;
  }
);

export const seedTasksThunk = createAsyncThunk('tasksThunk/seed', async () => {
  return await taskService.seedTasks();
});

export const taskThunkSlice = createSlice({
  name: 'tasksThunk',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // create
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      // update
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // delete
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      // seed
      .addCase(seedTasksThunk.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  }
});

// Memoized Selector
const selectTasksData = (state: RootState) => state.tasksThunk.tasks;
const selectFilterData = (state: RootState) => state.filters;

export const selectFilteredTasksThunk = createSelector(
  [selectTasksData, selectFilterData],
  (tasks, filters) => {
    const { search, status, priority, sortBy, sortOrder } = filters;

    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || task.status === status;
        const matchesPriority = priority === 'all' || task.priority === priority;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }
);

export default taskThunkSlice.reducer;