import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import filterReducer from './slices/filterSlice';
import taskThunkReducer from './slices/taskThunkSlice';
import { taskApi } from '../services/api/taskApi';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    filters: filterReducer,
    tasksThunk: taskThunkReducer,
    [taskApi.reducerPath]: taskApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;