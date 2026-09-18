import React from 'react';
import type { Task } from '../types/task';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { openEditModal, openDeleteModal, addToast } from '../store/slices/uiSlice';
import { useTaskActions } from '../store/useTaskActions';
import { Calendar, Tag, Edit2, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const { toggleTaskStatus, deleteTask } = useTaskActions();

  const handleToggleStatus = async () => {
    try {
      await toggleTaskStatus(task);
      dispatch(addToast({ type: 'success', message: 'Đã cập nhật trạng thái công việc!' }));
    } catch {
      dispatch(addToast({ type: 'error', message: 'Cập nhật thất bại!' }));
    }
  };

  const handleDelete = () => {
    dispatch(openDeleteModal(task));
  };

  const priorityColors = {
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    urgent: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };

  const statusIcons = {
    todo: <Clock className="w-4 h-4 text-slate-400" />,
    'in-progress': <AlertCircle className="w-4 h-4 text-amber-500" />,
    completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
  };

  return (
    <div
      className={`border rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700 text-white'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium border uppercase tracking-wider ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleStatus}
              className="p-1.5 hover:bg-slate-500/10 rounded-lg transition-colors"
              title="Chuyển trạng thái"
            >
              {statusIcons[task.status]}
            </button>
            <button
              onClick={() => dispatch(openEditModal(task))}
              className="p-1.5 hover:bg-slate-500/10 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"
              title="Sửa"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-slate-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{task.title}</h3>
        <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          {task.description}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${
                theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className={`flex items-center justify-between pt-3 border-t text-xs ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{task.dueDate}</span>
          </div>
          <span className="capitalize font-medium px-2 py-0.5 rounded bg-slate-500/10">
            {task.status.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};