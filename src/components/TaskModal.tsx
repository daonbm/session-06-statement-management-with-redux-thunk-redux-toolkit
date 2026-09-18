import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closeTaskModal, addToast } from '../store/slices/uiSlice';
import { useTaskActions } from '../store/useTaskActions';
import type { TaskStatus, TaskPriority } from '../types/task';
import { X } from 'lucide-react';

export const TaskModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isTaskModalOpen, editingTask, theme } = useAppSelector((state) => state.ui);
  const { createTask, updateTask } = useTaskActions();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setTagsInput(editingTask.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]);
      setTagsInput('React, Redux');
    }
  }, [editingTask, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingTask) {
        await updateTask(editingTask.id, { title, description, status, priority, dueDate, tags });
        dispatch(addToast({ type: 'success', message: 'Cập nhật công việc thành công!' }));
      } else {
        await createTask({ title, description, status, priority, dueDate, tags });
        dispatch(addToast({ type: 'success', message: 'Tạo công việc mới thành công!' }));
      }
      dispatch(closeTaskModal());
    } catch {
      dispatch(addToast({ type: 'error', message: 'Đã xảy ra lỗi khi lưu công việc!' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-xl ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-500/20">
          <h2 className="text-lg font-bold">
            {editingTask ? 'Chỉnh sửa Công việc' : 'Thêm Công việc mới'}
          </h2>
          <button
            onClick={() => dispatch(closeTaskModal())}
            className="p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Tiêu đề</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Mô tả</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Mức độ ưu tiên</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Hạn chót</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Tags (phân tách bởi dấu phẩy)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, Redux"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-500/20">
            <button
              type="button"
              onClick={() => dispatch(closeTaskModal())}
              className="px-4 py-2 rounded-xl border border-slate-500/20 text-sm font-medium hover:bg-slate-500/10"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md"
            >
              {editingTask ? 'Lưu thay đổi' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};