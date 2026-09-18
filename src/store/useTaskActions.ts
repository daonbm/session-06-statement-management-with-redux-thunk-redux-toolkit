import { useAppDispatch, useAppSelector } from './hooks';
import {
  fetchTasksThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
  toggleTaskStatusThunk,
  seedTasksThunk,
  selectFilteredTasksThunk
} from './slices/taskThunkSlice';
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useSeedTasksMutation
} from '../services/api/taskApi';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';
import { useMemo } from 'react';

export const useTaskActions = () => {
  const dispatch = useAppDispatch();
  const engineMode = useAppSelector((state) => state.ui.engineMode);
  const filters = useAppSelector((state) => state.filters);

  // Thunk hooks & data
  const thunkTasks = useAppSelector(selectFilteredTasksThunk);
  const thunkLoading = useAppSelector((state) => state.tasksThunk.loading);

  // RTK Query hooks & data
  const {
    data: queryTasksRaw = [],
    isLoading: queryLoading,
    refetch
  } = useGetTasksQuery(undefined, {
    skip: engineMode !== 'rtk-query'
  });

  const [createTaskMutation] = useCreateTaskMutation();
  const [updateTaskMutation] = useUpdateTaskMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [seedTasksMutation] = useSeedTasksMutation();

  // Filter & Sort for RTK Query data locally since query fetches all
  const queryTasks = useMemo(() => {
    const { search, status, priority, sortBy, sortOrder } = filters;
    return queryTasksRaw
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
  }, [queryTasksRaw, filters]);

  // Unified getters
  const tasks = engineMode === 'thunk' ? thunkTasks : queryTasks;
  const loading = engineMode === 'thunk' ? thunkLoading : queryLoading;

  // Unified actions
  const fetchTasks = () => {
    if (engineMode === 'thunk') {
      dispatch(fetchTasksThunk());
    } else {
      refetch();
    }
  };

  const createTask = async (dto: CreateTaskDTO) => {
    if (engineMode === 'thunk') {
      return dispatch(createTaskThunk(dto)).unwrap();
    } else {
      return createTaskMutation(dto).unwrap();
    }
  };

  const updateTask = async (id: string, dto: UpdateTaskDTO) => {
    if (engineMode === 'thunk') {
      return dispatch(updateTaskThunk({ id, dto })).unwrap();
    } else {
      return updateTaskMutation({ id, dto }).unwrap();
    }
  };

  const deleteTask = async (id: string) => {
    if (engineMode === 'thunk') {
      return dispatch(deleteTaskThunk(id)).unwrap();
    } else {
      return deleteTaskMutation(id).unwrap();
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    if (engineMode === 'thunk') {
      return dispatch(toggleTaskStatusThunk(task)).unwrap();
    } else {
      const nextStatus: Task['status'] =
        task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'todo';
      return updateTaskMutation({ id: task.id, dto: { status: nextStatus } }).unwrap();
    }
  };

  const seedTasks = async () => {
    if (engineMode === 'thunk') {
      return dispatch(seedTasksThunk()).unwrap();
    } else {
      return seedTasksMutation().unwrap();
    }
  };

  return {
    engineMode,
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    seedTasks
  };
};