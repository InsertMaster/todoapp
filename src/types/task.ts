export type Priority = 'high' | 'medium' | 'low';
export type Category = '工作' | '个人' | '学习' | '生活' | '健康' | '其他';
export type FilterStatus = 'all' | 'active' | 'done';
export type DateGroupKey = 'overdue' | 'today' | 'thisWeek' | 'later' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  category: Category;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  category: Category;
}
