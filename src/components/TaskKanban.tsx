import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';
import type { TaskStatus } from '../types/task';

export const TaskKanban: React.FC = () => {
  const { filteredTasks } = useTaskContext();

  const getColumnTasks = (status: TaskStatus) => {
    return filteredTasks.filter(t => t.status === status);
  };

  const columns: { status: TaskStatus; title: string; icon: React.ReactNode; color: string }[] = [
    {
      status: 'pending',
      title: 'Chờ Xử Lý',
      icon: <Clock size={18} />,
      color: '#f59e0b',
    },
    {
      status: 'in_progress',
      title: 'Đang Thực Hiện',
      icon: <Loader2 size={18} />,
      color: '#3b82f6',
    },
    {
      status: 'completed',
      title: 'Đã Hoàn Thành',
      icon: <CheckCircle2 size={18} />,
      color: '#10b981',
    },
  ];

  return (
    <div className="kanban-board animate-fade-in">
      {columns.map(col => {
        const colTasks = getColumnTasks(col.status);

        return (
          <div key={col.status} className="kanban-column">
            <div className="kanban-header">
              <div className="kanban-title" style={{ color: col.color }}>
                {col.icon}
                <span>{col.title}</span>
              </div>
              <span className="kanban-count">{colTasks.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {colTasks.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  Trống
                </div>
              ) : (
                colTasks.map(task => <TaskCard key={task.id} task={task} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
