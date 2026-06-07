import ProgressRing from './ProgressRing';
import { useTaskContext } from '../context/TaskContext';
import './StatsBar.css';

export default function StatsBar() {
  const { state } = useTaskContext();
  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-number">{total}</span>
        <span className="stat-label">全部任务</span>
      </div>
      <div className="stat-item">
        <span className="stat-number done">{done}</span>
        <span className="stat-label">已完成</span>
      </div>
      <div className="stat-item">
        <ProgressRing percent={percent} />
        <span className="stat-label">完成率</span>
      </div>
    </div>
  );
}
