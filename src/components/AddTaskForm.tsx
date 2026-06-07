import { useState, type FormEvent } from 'react';
import type { Priority, Category, TaskFormData } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { CATEGORIES, PRIORITIES } from '../constants';
import { decomposeTask } from '../utils/deepseek';
import './AddTaskForm.css';

interface AddTaskFormProps {
  onAdded: (message: string) => void;
}

export default function AddTaskForm({ onAdded }: AddTaskFormProps) {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('其他');
  const [showExtra, setShowExtra] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setCategory('其他');
    setShowExtra(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const data: TaskFormData = {
      title: trimmedTitle,
      description,
      dueDate,
      priority,
      category,
    };
    dispatch({ type: 'ADD_TASK', payload: data });
    onAdded('✅ 任务已添加');
    resetForm();
  };

  const handleAiDecompose = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      onAdded('⚠️ 请先输入任务描述');
      return;
    }

    setAiLoading(true);
    try {
      const subtasks = await decomposeTask(trimmedTitle);
      if (subtasks.length === 0) {
        onAdded('⚠️ AI 未能拆解出子任务，请尝试更具体的描述');
        return;
      }
      dispatch({ type: 'BATCH_ADD_TASKS', payload: subtasks });
      onAdded(`🤖 AI 已拆解为 ${subtasks.length} 个子任务`);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 拆解失败，请重试';
      onAdded(`❌ ${message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit} autoComplete="off">
      <div className="form-row main-row">
        <input
          type="text"
          name="title"
          placeholder="✏️ 添加新任务…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />
        <button
          type="button"
          className={`btn btn-ai${aiLoading ? ' loading' : ''}`}
          onClick={handleAiDecompose}
          disabled={aiLoading}
          title="AI 自动拆解为子任务"
        >
          {aiLoading ? (
            <>
              <span className="ai-spinner" />
              拆解中…
            </>
          ) : (
            '🤖 AI 拆解'
          )}
        </button>
        <input
          type="date"
          name="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.emoji} {p.label}
            </option>
          ))}
        </select>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary" disabled={aiLoading}>
          ＋ 添加
        </button>
      </div>
      <span className="toggle-extra" onClick={() => setShowExtra(!showExtra)}>
        <span className={`arrow${showExtra ? ' open' : ''}`}>▼</span> 更多选项
      </span>
      <div className={`form-row extra-row${showExtra ? ' show' : ''}`}>
        <textarea
          name="description"
          placeholder="📝 添加描述…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>
    </form>
  );
}
