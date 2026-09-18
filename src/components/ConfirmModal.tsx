import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeDeleteModal, addToast } from '../store/slices/uiSlice';
import { useTaskActions } from '../store/useTaskActions';
import { AlertTriangle } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deletingTask, theme } = useAppSelector((state) => state.ui);
  const { deleteTask } = useTaskActions();

  if (!deletingTask) return null;

  const handleConfirm = async () => {
    try {
      await deleteTask(deletingTask.id);
      dispatch(addToast({ type: 'success', message: 'Đã xóa công việc thành công!' }));
      dispatch(closeDeleteModal());
    } catch {
      dispatch(addToast({ type: 'error', message: 'Xóa công việc thất bại!' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-xl ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-3 mb-4 text-rose-500">
          <div className="p-3 bg-rose-500/10 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Xác nhận xóa công việc</h2>
        </div>

        <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Bạn có chắc chắn muốn xóa công việc <span className="font-semibold text-rose-500">"{deletingTask.title}"</span> không? Hành động này không thể hoàn tác.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => dispatch(closeDeleteModal())}
            className="px-4 py-2 rounded-xl border border-slate-500/20 text-sm font-medium hover:bg-slate-500/10"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium shadow-md"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};