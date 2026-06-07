import { useState, useCallback } from 'react';
import type { Task } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { PRIORITY_LABELS } from '../constants';
import { formatDate, isOverdue, isToday } from '../utils/helpers';
import HandCheckbox from './HandCheckbox';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDeleted: (message: string) => void;
}

export default function TaskCard({ task, onEdit, onDeleted }: TaskCardProps) {
  const { dispatch } = useTaskContext();
  const [removing, setRemoving] = useState(false);

  const handleToggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_TASK', payload: task.id });
  }, [dispatch, task.id]);

  const handleDelete = useCallback(() => {
    setRemoving(true);
    // Wait for animation then dispatch
    setTimeout(() => {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
      onDeleted('🗑 任务已删除');
    }, 350);
  }, [dispatch, task.id, onDeleted]);

  const dueDateStr = formatDate(task.dueDate);
  const overdue = !task.completed && isOverdue(task.dueDate);
  const today = !task.completed && isToday(task.dueDate);
  const dueClass = overdue ? 'overdue' : today ? 'today' : '';

  return (
    <div
      className={`task-card${task.completed ? ' completed' : ''}${removing ? ' removing' : ''}`}
      data-id={task.id}
      data-category={task.category}
    >
      <HandCheckbox
        completed={task.completed}
        onToggle={handleToggle}
        title={task.completed ? '标记未完成' : '标记完成'}
      />
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">
          <span className={`priority-stamp priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className={`category-tag category-${task.category}`}>{task.category}</span>
          {dueDateStr && (
            <span className={`due-date ${dueClass}`}>
              📅 {dueDateStr}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button
          className="btn btn-outline btn-icon btn-sm"
          onClick={() => onEdit(task)}
          title="编辑"
        >
          ✏️
        </button>
        <button
          className="btn btn-outline btn-icon btn-sm btn-danger"
          onClick={handleDelete}
          title="删除"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
