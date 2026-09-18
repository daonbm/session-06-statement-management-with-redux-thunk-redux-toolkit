import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  toggleTheme,
  setEngineMode,
  openCreateModal,
  openApiModal,
  addToast
} from '../store/slices/uiSlice';
import { Sun, Moon, Plus, RefreshCw, Database, Server, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, engineMode } = useAppSelector((state) => state.ui);

  const handleToggleEngine = () => {
    const nextMode = engineMode === 'thunk' ? 'rtk-query' : 'thunk';
    dispatch(setEngineMode(nextMode));
    dispatch({
      type: 'tasksThunk/fetchAll/fulfilled',
      payload: []
    });
    dispatch(
      addToast({
        type: 'info',
        message: `Đã chuyển sang chế độ: ${nextMode === 'thunk' ? 'Redux Thunk' : 'RTK Query'}`
      })
    );
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b px-6 py-4 transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">TaskFlow Pro</h1>
            <p className="text-xs text-slate-400">Redux Toolkit, Thunk & RTK Query Architecture</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Engine Switcher Badge */}
          <button
            onClick={handleToggleEngine}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-sm ${
              engineMode === 'thunk'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20'
            }`}
            title="Nhấn để đổi Engine Mode"
          >
            {engineMode === 'thunk' ? (
              <>
                <Server className="w-3.5 h-3.5" />
                <span>Redux Thunk Mode</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>RTK Query Mode</span>
              </>
            )}
            <RefreshCw className="w-3 h-3 ml-1 opacity-70 animate-spin-hover" />
          </button>

          {/* API Config Modal Button */}
          <button
            onClick={() => dispatch(openApiModal())}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
            title="Cấu hình API"
          >
            <Database className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`p-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'border-slate-700 hover:bg-slate-800 text-amber-400'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
            title="Đổi giao diện Sáng/Tối"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* New Task Button */}
          <button
            onClick={() => dispatch(openCreateModal())}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Công Việc</span>
          </button>
        </div>
      </div>
    </header>
  );
};