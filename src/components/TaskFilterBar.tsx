import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFilter, resetFilters } from '../store/slices/filterSlice';
import { setViewMode } from '../store/slices/uiSlice';
import { Search, LayoutGrid, Kanban, RotateCcw } from 'lucide-react';

export const TaskFilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { theme, viewMode } = useAppSelector((state) => state.ui);

  return (
    <div
      className={`p-4 rounded-2xl border mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={filters.search}
            onChange={(e) => dispatch(setFilter({ key: 'search', value: e.target.value }))}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 focus:border-indigo-500 text-white'
                : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-800'
            }`}
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => dispatch(setFilter({ key: 'status', value: e.target.value }))}
          className={`w-full sm:w-auto px-3 py-2 rounded-xl border text-sm outline-none ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => dispatch(setFilter({ key: 'priority', value: e.target.value }))}
          className={`w-full sm:w-auto px-3 py-2 rounded-xl border text-sm outline-none ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <option value="all">Tất cả mức độ</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
        {/* Reset filter button */}
        <button
          onClick={() => dispatch(resetFilters())}
          className="p-2 rounded-xl border border-slate-500/20 hover:bg-slate-500/10 text-slate-400 hover:text-indigo-500 transition-colors"
          title="Đặt lại bộ lọc"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-500/10 rounded-xl">
          <button
            onClick={() => dispatch(setViewMode('grid'))}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Lưới (Grid View)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(setViewMode('kanban'))}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Kanban Board"
          >
            <Kanban className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};