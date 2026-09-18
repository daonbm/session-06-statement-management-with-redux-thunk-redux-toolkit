import React, { useEffect } from 'react';
import { useAppSelector } from './store/hooks';
import { useTaskActions } from './store/useTaskActions';
import { Navbar } from './components/Navbar';
import { TaskStats } from './components/TaskStats';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/Toast';
import { ApiConfigModal } from './components/ApiConfigModal';

export const App: React.FC = () => {
  const theme = useAppSelector((state) => state.ui.theme);
  const { fetchTasks } = useTaskActions();

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <TaskStats />
        <TaskFilterBar />
        <TaskList />
      </main>
      <TaskModal />
      <ConfirmModal />
      <ApiConfigModal />
      <ToastContainer />
    </div>
  );
};