import DateStamp from './DateStamp';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1>⚔️ 江湖任务录</h1>
        <p className="subtitle">不良人 · 李星云</p>
      </div>
      <DateStamp />
    </header>
  );
}
