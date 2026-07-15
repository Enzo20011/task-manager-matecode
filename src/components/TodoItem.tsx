import { useState } from 'react';
import type { Task, NewTask } from '../types';
import { TodoForm } from './TodoForm';

interface TodoItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const PRIORITY_CONFIG = {
  low:    { label: 'Baja',  color: 'priority--low',    dot: '🟢' },
  medium: { label: 'Media', color: 'priority--medium', dot: '🟡' },
  high:   { label: 'Alta',  color: 'priority--high',   dot: '🔴' },
};

function formatDate(date: Date): string {
  const now = new Date();
  const diff = Math.ceil((date.getTime() - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));
  const formatted = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  if (diff < 0) return `⚠️ Vencida (${formatted})`;
  if (diff === 0) return `🔔 Hoy`;
  if (diff === 1) return `Mañana`;
  return formatted;
}

export const TodoItem = ({ task, onToggle, onEdit, onDelete, dragHandleProps }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
  const isOverdue = task.dueDate && !task.completed && task.dueDate < new Date();

  const handleEdit = (updated: NewTask) => {
    onEdit(task.id, {
      title: updated.title,
      description: updated.description,
      priority: updated.priority,
      dueDate: updated.dueDate,
    });
    setIsEditing(false);
  };

  return (
    <li
      className={`todo-item ${task.completed ? 'todo-item--completed' : ''} ${isOverdue ? 'todo-item--overdue' : ''}`}
      data-testid="todo-item"
    >
      {isEditing ? (
        <TodoForm
          initialValues={{ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate }}
          onSubmit={handleEdit}
          submitLabel="Guardar cambios"
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {/* Drag handle */}
          <div className="todo-item__drag" {...dragHandleProps} title="Arrastrar para reordenar">
            ⠿
          </div>

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
            <div className="todo-item__header">
              <h3 className="todo-item__title">{task.title}</h3>
              <span className={`priority-badge ${priority.color}`}>
                {priority.dot} {priority.label}
              </span>
            </div>
            {task.description && (
              <p className="todo-item__desc">{task.description}</p>
            )}
            {task.dueDate && (
              <span className={`due-date ${isOverdue ? 'due-date--overdue' : ''}`}>
                📅 {formatDate(task.dueDate)}
              </span>
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
