import type { Task } from '../types/task';
import type { DateGroupKey } from '../types/task';
import { DATE_GROUP_CONFIG } from '../constants';
import TaskCard from './TaskCard';
import './TaskGroup.css';

interface TaskGroupProps {
  groupKey: DateGroupKey;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDeleted: (message: string) => void;
}

export default function TaskGroup({ groupKey, tasks, onEdit, onDeleted }: TaskGroupProps) {
  const config = DATE_GROUP_CONFIG[groupKey];

  return (
    <div className="task-group">
      <div className="task-group-header">
        <span>{config.emoji}</span> {config.label}
        <span className="group-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
