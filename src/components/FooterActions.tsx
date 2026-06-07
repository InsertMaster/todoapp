import { useRef, useCallback, type ChangeEvent } from 'react';
import { useTaskContext } from '../context/TaskContext';
import type { Task } from '../types/task';
import { todayStr } from '../utils/helpers';
import './FooterActions.css';

interface FooterActionsProps {
  onToast: (message: string) => void;
}

export default function FooterActions({ onToast }: FooterActionsProps) {
  const { state, dispatch } = useTaskContext();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(state.tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techo-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('📥 备份已下载');
  }, [state.tasks, onToast]);

  const handleImport = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (!Array.isArray(data)) throw new Error('Invalid format');
          if (
            confirm(
              `即将导入 ${data.length} 条任务。\n选择"确定"将覆盖现有数据，选择"取消"将合并到现有数据。\n（按确定=覆盖 / 按取消=合并）`
            )
          ) {
            dispatch({ type: 'IMPORT_TASKS', payload: data });
          } else {
            const existingIds = new Set(state.tasks.map((t: Task) => t.id));
            const merged = [...state.tasks, ...data.filter((t: Task) => !existingIds.has(t.id))];
            dispatch({ type: 'IMPORT_TASKS', payload: merged });
          }
          onToast('📤 数据已导入');
        } catch {
          onToast('❌ 导入失败：文件格式错误');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [dispatch, state.tasks, onToast]
  );

  const handleClearDone = useCallback(() => {
    const doneCount = state.tasks.filter((t) => t.completed).length;
    if (doneCount === 0) {
      onToast('没有已完成的任务');
      return;
    }
    if (confirm(`确定要清除 ${doneCount} 条已完成的任务吗？此操作不可撤销。`)) {
      dispatch({ type: 'CLEAR_DONE' });
      onToast(`🗑 已清除 ${doneCount} 条任务`);
    }
  }, [state.tasks, dispatch, onToast]);

  return (
    <div className="footer-actions">
      <button className="btn btn-outline btn-sm" onClick={handleExport}>
        📥 导出备份
      </button>
      <button className="btn btn-outline btn-sm" onClick={handleImport}>
        📤 导入数据
      </button>
      <button className="btn btn-outline btn-sm btn-danger" onClick={handleClearDone}>
        🗑 清除已完成
      </button>
      <input
        type="file"
        ref={fileRef}
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}
