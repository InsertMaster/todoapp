import { useState, useCallback } from 'react';
import type { Task } from '../types/task';
import { useToast } from '../hooks/useToast';
import Header from './Header';
import StatsBar from './StatsBar';
import Toolbar from './Toolbar';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import FooterActions from './FooterActions';
import EditModal from './EditModal';
import Toast from './Toast';

export default function Notebook() {
  const { message, visible, showToast } = useToast();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingTask(null);
  }, []);

  return (
    <div className="notebook">
      <div className="main-content">
        <Header />
        <StatsBar />
        <Toolbar />
        <AddTaskForm onAdded={showToast} />
        <TaskList onEdit={handleEdit} onDeleted={showToast} />
        <FooterActions onToast={showToast} />
      </div>
      <EditModal task={editingTask} onClose={handleCloseModal} onSaved={showToast} />
      <Toast message={message} visible={visible} />
    </div>
  );
}
