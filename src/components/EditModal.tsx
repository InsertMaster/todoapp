import { useState, useEffect, type FormEvent } from 'react';
import type { Task, Priority, Category, TaskFormData } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { CATEGORIES, PRIORITIES } from '../constants';
import './EditModal.css';

interface EditModalProps {
  task: Task | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export default function EditModal({ task, onClose, onSaved }: EditModalProps) {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('其他');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate || '');
      setPriority(task.priority);
      setCategory(task.category);
    }
  }, [task]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!task || !title.trim()) return;

    const data: TaskFormData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      category,
    };
    dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, data } });
    onSaved('💾 任务已更新');
    onClose();
  };

  return (
    <div
      className={`modal-overlay${task ? ' open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <h3>✏️ 编辑任务</h3>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>任务标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          <div className="form-group">
            <label>描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>截止日期</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label>优先级</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.emoji} {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>分类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              💾 保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
