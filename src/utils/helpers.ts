import type { DateGroupKey } from '../types/task';

export function uuid(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return '今天';
  if (diff === 1) return '明天';
  if (diff === -1) return '昨天';
  if (diff < 0) return `${Math.abs(diff)}天前`;
  if (diff <= 7) return `${diff}天后`;
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return dateStr < todayStr();
}

export function isToday(dateStr: string | null): boolean {
  return dateStr === todayStr();
}

export function getDateGroup(dateStr: string | null): DateGroupKey {
  if (!dateStr) return 'later';
  if (dateStr < todayStr()) return 'overdue';
  if (dateStr === todayStr()) return 'today';
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff <= 7) return 'thisWeek';
  return 'later';
}

export function loadTasks<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks<T>(key: string, tasks: T[]): void {
  localStorage.setItem(key, JSON.stringify(tasks));
}
