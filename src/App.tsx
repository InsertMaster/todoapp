import { TaskProvider } from './context/TaskContext';
import Notebook from './components/Notebook';

export default function App() {
  return (
    <TaskProvider>
      <Notebook />
    </TaskProvider>
  );
}
