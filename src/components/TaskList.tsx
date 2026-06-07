import { useMemo } from 'react';
import type { Task, DateGroupKey } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { DATE_GROUP_ORDER, PRIORITY_SORT } from '../constants';
import { getDateGroup } from '../utils/helpers';
import TaskGroup from './TaskGroup';
import './TaskList.css';

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDeleted: (message: string) => void;
}

export default function TaskList({ onEdit, onDeleted }: TaskListProps) {
  const { state } = useTaskContext();

  const filtered = useMemo(() => {
    let result = [...state.tasks];

    // Filter by status
    if (state.filter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (state.filter === 'done') {
      result = result.filter((t) => t.completed);
    }

    // Filter by category
    if (state.category !== 'all') {
      result = result.filter((t) => t.category === state.category);
    }

    // Filter by search
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const ga = DATE_GROUP_ORDER.indexOf(getDateGroup(a.dueDate));
      const gb = DATE_GROUP_ORDER.indexOf(getDateGroup(b.dueDate));
      if (ga !== gb) return ga - gb;
      const pa = PRIORITY_SORT[a.priority];
      const pb = PRIORITY_SORT[b.priority];
      if (pa !== pb) return pa - pb;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [state.tasks, state.filter, state.category, state.search]);

  const groups = useMemo(() => {
    const map: Record<string, Task[]> = {};
    filtered.forEach((task) => {
      const key: DateGroupKey = task.completed ? 'done' : getDateGroup(task.dueDate);
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [filtered]);

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📭</span>
        <p>
          {state.tasks.length === 0
            ? '还没有任务，开始写第一条吧 ✨'
            : '没有匹配的任务'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {DATE_GROUP_ORDER.map((key) => {
        if (groups[key] && groups[key].length > 0) {
          return (
            <TaskGroup
              key={key}
              groupKey={key}
              tasks={groups[key]}
              onEdit={onEdit}
              onDeleted={onDeleted}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
