import './HandCheckbox.css';

interface HandCheckboxProps {
  completed: boolean;
  onToggle: () => void;
  title: string;
}

export default function HandCheckbox({ completed, onToggle, title }: HandCheckboxProps) {
  return (
    <div className="checkbox-wrap">
      <svg
        className={`hand-checkbox${completed ? ' completed' : ''}`}
        viewBox="0 0 26 26"
        width="22"
        height="22"
        onClick={onToggle}
      >
        <title>{title}</title>
        <circle className="circle-bg" cx="13" cy="13" r="10" />
        <path className="check-mark" d="M7 13.5l3.5 3.5 8-7" />
      </svg>
    </div>
  );
}
