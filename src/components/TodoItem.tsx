import { useState } from 'react';
import type { Task, NewTask } from '../types';
import { TodoForm } from './TodoForm';

interface TodoItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, updates: Partial<Pick<Task, 'title' | 'description'>>) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ task, onToggle, onEdit, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (updated: NewTask) => {
    onEdit(task.id, { title: updated.title, description: updated.description });
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${task.completed ? 'todo-item--completed' : ''}`} data-testid="todo-item">
      {isEditing ? (
        <TodoForm
          initialValues={{ title: task.title, description: task.description }}
          onSubmit={handleEdit}
          submitLabel="Guardar cambios"
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="todo-item__check">
            <input
              type="checkbox"
              id={`task-check-${task.id}`}
              checked={task.completed}
              onChange={(e) => onToggle(task.id, e.target.checked)}
              aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
            />
          </div>

          <div className="todo-item__content">
            <h3 className="todo-item__title">{task.title}</h3>
            {task.description && (
              <p className="todo-item__desc">{task.description}</p>
            )}
          </div>

          <div className="todo-item__actions">
            <button
              className="btn-icon"
              onClick={() => setIsEditing(true)}
              aria-label="Editar tarea"
              title="Editar"
            >
              ✏️
            </button>
            <button
              className="btn-icon btn-icon--danger"
              onClick={() => onDelete(task.id)}
              aria-label="Eliminar tarea"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </li>
  );
};
