import React from 'react';
import { useTaskActions } from '../store/useTaskActions';
import { useAppSelector } from '../store/hooks';
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';

export const TaskStats: React.FC = () => {
  const { tasks } = useTaskActions();
  const theme = useAppSelector((state) => state.ui.theme);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const urgent = tasks.filter((t) => t.priority === 'urgent').length;

  const stats = [
    { title: 'Tổng công việc', value: total, icon: ListTodo, color: 'text-indigo-500 bg-indigo-500/10' },
    { title: 'Đang thực hiện', value: inProgress, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Đã hoàn thành', value: completed, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Khẩn cấp', value: urgent, icon: AlertTriangle, color: 'text-rose-500 bg-rose-500/10' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">{item.title}</p>
              <h4 className="text-2xl font-bold">{item.value}</h4>
            </div>
            <div className={`p-3 rounded-xl ${item.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};