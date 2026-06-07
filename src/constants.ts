import type { Category, DateGroupKey, Priority } from './types/task';

export const STORAGE_KEY = 'techo_tasks';

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: '工作', label: '工作', emoji: '📋' },
  { value: '个人', label: '个人', emoji: '🌟' },
  { value: '学习', label: '学习', emoji: '📖' },
  { value: '生活', label: '生活', emoji: '🏠' },
  { value: '健康', label: '健康', emoji: '💪' },
  { value: '其他', label: '其他', emoji: '📌' },
];

export const PRIORITIES: { value: Priority; label: string; emoji: string }[] = [
  { value: 'high', label: '高优先级', emoji: '🔴' },
  { value: 'medium', label: '中优先级', emoji: '⚪' },
  { value: 'low', label: '低优先级', emoji: '🔵' },
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: '★ 重要',
  medium: '◇ 普通',
  low: '○ 不急',
};

export const DATE_GROUP_CONFIG: Record<DateGroupKey, { label: string; emoji: string }> = {
  overdue: { label: '⚠️ 已逾期', emoji: '⚠️' },
  today: { label: '☀️ 今天', emoji: '📅' },
  thisWeek: { label: '📆 本周内', emoji: '📆' },
  later: { label: '📌 未安排 / 以后', emoji: '📌' },
  done: { label: '✅ 已完成', emoji: '✅' },
};

export const DATE_GROUP_ORDER: DateGroupKey[] = ['overdue', 'today', 'thisWeek', 'later', 'done'];

export const PRIORITY_SORT: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
