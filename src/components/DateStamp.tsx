import { useMemo } from 'react';
import './DateStamp.css';

export default function DateStamp() {
  const { month, day, weekday } = useMemo(() => {
    const now = new Date();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return {
      month: now.toLocaleDateString('zh-CN', { month: 'short' }).replace('月', ''),
      day: now.getDate(),
      weekday: '周' + weekdays[now.getDay()],
    };
  }, []);

  return (
    <div className="date-stamp">
      <span className="stamp-month">{month}</span>
      <span className="stamp-day">{day}</span>
      <span className="stamp-weekday">{weekday}</span>
    </div>
  );
}
