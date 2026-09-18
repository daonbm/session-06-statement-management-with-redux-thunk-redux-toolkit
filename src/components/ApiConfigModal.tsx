import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeApiModal } from '../store/slices/uiSlice';
import { Server, Database, X } from 'lucide-react';

export const ApiConfigModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isApiModalOpen, engineMode, theme } = useAppSelector((state) => state.ui);

  if (!isApiModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-xl ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-500/20">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold">Cấu hình API & Engine</h2>
          </div>
          <button
            onClick={() => dispatch(closeApiModal())}
            className="p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-slate-500/20 bg-slate-500/5">
            <h4 className="font-semibold text-sm mb-1">Trạng thái Engine hiện tại:</h4>
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-2">
              <Database className="w-4 h-4" />
              {engineMode === 'thunk' ? 'Redux Thunk Middleware' : 'Redux Toolkit Query (RTK Query)'}
            </p>
          </div>

          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Ứng dụng đang kết nối tới Local Storage Mock Service qua Base URL: <code className="px-1.5 py-0.5 rounded bg-slate-500/10 font-mono">/api/v1</code>. Bạn có thể chuyển đổi Engine trực tiếp trên Navbar để so sánh cơ chế caching và bất đồng bộ.
          </p>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-slate-500/20">
          <button
            onClick={() => dispatch(closeApiModal())}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};