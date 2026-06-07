import './ProgressRing.css';

interface ProgressRingProps {
  percent: number;
}

const CIRCUMFERENCE = 113.1; // 2 * PI * 18

export default function ProgressRing({ percent }: ProgressRingProps) {
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  return (
    <div className="progress-ring">
      <svg width="42" height="42" viewBox="0 0 42 42">
        <circle className="bg" cx="21" cy="21" r="18" />
        <circle
          className="fill"
          cx="21"
          cy="21"
          r="18"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="progress-text">{percent}%</span>
    </div>
  );
}
