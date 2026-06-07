import type { ChangeEvent } from 'react';
import type { FilterStatus, Category } from '../types/task';
import { useTaskContext } from '../context/TaskContext';
import { CATEGORIES } from '../constants';
import './Toolbar.css';

export default function Toolbar() {
  const { state, dispatch } = useTaskContext();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
  };

  const handleFilter = (filter: FilterStatus) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const handleCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_CATEGORY', payload: e.target.value as Category | 'all' });
  };

  return (
    <div className="toolbar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="搜索任务…"
          value={state.search}
          onChange={handleSearch}
          autoComplete="off"
        />
      </div>
      {(['all', 'active', 'done'] as FilterStatus[]).map((f) => {
        const labels: Record<FilterStatus, string> = { all: '全部', active: '未完成', done: '已完成' };
        return (
          <button
            key={f}
            className={`filter-btn${state.filter === f ? ' active' : ''}`}
            onClick={() => handleFilter(f)}
          >
            {labels[f]}
          </button>
        );
      })}
      <select className="filter-btn" value={state.category} onChange={handleCategory}>
        <option value="all">全部分类</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.emoji} {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
