import { useState } from 'react';
import type { Task, NewTask, Priority } from '../types';

interface TodoFormProps {
  onSubmit: (task: NewTask) => void;
  initialValues?: Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>;
  submitLabel?: string;
  onCancel?: () => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; emoji: string }[] = [
  { value: 'low', label: 'Baja', emoji: '🟢' },
  { value: 'medium', label: 'Media', emoji: '🟡' },
  { value: 'high', label: 'Alta', emoji: '🔴' },
];

export const TodoForm = ({
  onSubmit,
  initialValues,
  submitLabel = 'Agregar tarea',
  onCancel,
}: TodoFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ? initialValues.dueDate.toISOString().split('T')[0] : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : undefined,
    });
    if (!initialValues) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form" data-testid="todo-form">
      <div className="form-group">
        <label htmlFor="task-title">Título</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué tenés que hacer?"
          required
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description">Descripción</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción opcional..."
          rows={2}
          maxLength={500}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-priority">Prioridad</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.emoji} {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-due-date">Fecha límite</label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
