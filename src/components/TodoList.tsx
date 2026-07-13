import type { Task, NewTask } from '../types';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, updates: Partial<Pick<Task, 'title' | 'description'>>) => void;
  onDelete: (id: string) => void;
}

export const TodoList = ({ tasks, onToggle, onEdit, onDelete }: TodoListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <span className="empty-state__icon">📋</span>
        <p>No tenés tareas todavía. ¡Creá tu primera tarea!</p>
      </div>
    );
  }

  return (
    <ul className="todo-list" data-testid="todo-list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
