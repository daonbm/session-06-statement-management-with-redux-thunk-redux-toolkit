import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../../types/task';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      queryFn: async () => {
        const { taskService } = await import('../../services/taskService');
        const data = await taskService.getTasks();
        return { data };
      },
      providesTags: ['Task']
    }),
    getTaskById: builder.query<Task, string>({
      queryFn: async (id) => {
        const { taskService } = await import('../../services/taskService');
        const data = await taskService.getTaskById(id);
        return { data };
      },
      providesTags: (_result, _error, id) => [{ type: 'Task', id }]
    }),
    createTask: builder.mutation<Task, CreateTaskDTO>({
      queryFn: async (dto) => {
        const { taskService } = await import('../../services/taskService');
        const data = await taskService.createTask(dto);
        return { data };
      },
      invalidatesTags: ['Task']
    }),
    updateTask: builder.mutation<Task, { id: string; dto: UpdateTaskDTO }>({
      queryFn: async ({ id, dto }) => {
        const { taskService } = await import('../../services/taskService');
        const data = await taskService.updateTask(id, dto);
        return { data };
      },
      invalidatesTags: ['Task']
    }),
    deleteTask: builder.mutation<string, string>({
      queryFn: async (id) => {
        const { taskService } = await import('../../services/taskService');
        const data = await taskService.deleteTask(id);
        return { data };
      },
      invalidatesTags: ['Task']
    }),
    seedTasks: builder.mutation<Task[], void>({
      queryFn: async () => {
        const { taskService } = await import('../../services/taskService');
        const data = await taskService.seedTasks();
        return { data };
      },
      invalidatesTags: ['Task']
    })
  })
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useSeedTasksMutation
} = taskApi;