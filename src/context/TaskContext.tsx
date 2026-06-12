import { createContext, useContext, useReducer, useEffect, type Dispatch, type ReactNode } from 'react';
import type { Task, TaskFormData, FilterStatus, Category } from '../types/task';
import { STORAGE_KEY } from '../constants';
import { uuid, loadTasks, saveTasks } from '../utils/helpers';

// ---- State ----
interface TaskState {
  tasks: Task[];
  filter: FilterStatus;
  category: Category | 'all';
  search: string;
  initialized: boolean;
}

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  category: 'all',
  search: '',
  initialized: false,
};

// ---- Actions ----
type TaskAction =
  | { type: 'INIT_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: TaskFormData }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: { id: string; data: TaskFormData } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'CLEAR_DONE' }
  | { type: 'IMPORT_TASKS'; payload: Task[] }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'SET_CATEGORY'; payload: Category | 'all' }
  | { type: 'SET_SEARCH'; payload: string };

// ---- Reducer ----
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'INIT_TASKS':
      return { ...state, tasks: action.payload, initialized: true };

    case 'ADD_TASK': {
      const data = action.payload;
      const task: Task = {
        id: uuid(),
        title: data.title.trim(),
        description: (data.description || '').trim(),
        dueDate: data.dueDate || null,
        priority: data.priority,
        category: data.category,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      return { ...state, tasks: [task, ...state.tasks] };
    }

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed ? new Date().toISOString() : null,
              }
            : t
        ),
      };

    case 'UPDATE_TASK': {
      const { id, data } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                title: data.title.trim(),
                description: (data.description || '').trim(),
                dueDate: data.dueDate || null,
                priority: data.priority,
                category: data.category,
              }
            : t
        ),
      };
    }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case 'CLEAR_DONE':
      return {
        ...state,
        tasks: state.tasks.filter((t) => !t.completed),
      };

    case 'IMPORT_TASKS':
      return { ...state, tasks: action.payload };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'SET_CATEGORY':
      return { ...state, category: action.payload };

    case 'SET_SEARCH':
      return { ...state, search: action.payload };

    default:
      return state;
  }
}

// ---- Context ----
interface TaskContextValue {
  state: TaskState;
  dispatch: Dispatch<TaskAction>;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const tasks = loadTasks<Task>(STORAGE_KEY);
    dispatch({ type: 'INIT_TASKS', payload: tasks });
  }, []);

  // Save tasks to localStorage on change (skip first render)
  useEffect(() => {
    if (state.initialized) {
      saveTasks(STORAGE_KEY, state.tasks);
    }
  }, [state.tasks, state.initialized]);

  // Demo data disabled — start with empty task list
  //

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
}
