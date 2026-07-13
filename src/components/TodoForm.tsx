import { useState } from 'react';
import type { Task, NewTask } from '../types';

interface TodoFormProps {
  onSubmit: (task: NewTask) => void;
  initialValues?: Pick<Task, 'title' | 'description'>;
  submitLabel?: string;
  onCancel?: () => void;
}

export const TodoForm = ({ onSubmit, initialValues, submitLabel = 'Agregar tarea', onCancel }: TodoFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), completed: false });
    if (!initialValues) {
      setTitle('');
      setDescription('');
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
          rows={3}
          maxLength={500}
        />
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
