import React from 'react';
import { useTaskActions } from '../store/useTaskActions';
import { useAppSelector } from '../store/hooks';
import { TaskCard } from './TaskCard';
import { ClipboardList, Loader2 } from 'lucide-react';

export const TaskList: React.FC = () => {
  const { tasks, loading } = useTaskActions();
  const theme = useAppSelector((state) => state.ui.theme);
  const viewMode = useAppSelector((state) => state.ui.viewMode);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-400">Đang tải danh sách công việc...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed rounded-2xl border-slate-700/50">
        <ClipboardList className="w-12 h-12 text-slate-400" />
        <p className="font-medium text-slate-500">Không tìm thấy công việc nào phù hợp.</p>
      </div>
    );
  }

  if (viewMode === 'kanban') {
    const columns = [
      { id: 'todo', title: 'Cần làm (To Do)', status: 'todo' },
      { id: 'in-progress', title: 'Đang thực hiện (In Progress)', status: 'in-progress' },
      { id: 'completed', title: 'Đã hoàn thành (Completed)', status: 'completed' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.id}
              className={`rounded-2xl p-4 border ${
                theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-semibold text-sm">{col.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold">
                  {colTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};