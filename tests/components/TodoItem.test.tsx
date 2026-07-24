import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoItem } from '../../src/components/TodoItem';
import type { Task } from '../../src/types';

const baseTask: Task = {
  id: 'task-1',
  title: 'Tarea de prueba',
  description: 'Descripción de prueba',
  completed: false,
  priority: 'medium',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TodoItem', () => {
  it('renderiza el título de la tarea', () => {
    render(
      <TodoItem task={baseTask} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
  });

  it('renderiza el badge de prioridad media', () => {
    render(
      <TodoItem task={baseTask} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText(/Media/i)).toBeInTheDocument();
  });

  it('renderiza el badge de prioridad alta', () => {
    render(
      <TodoItem
        task={{ ...baseTask, priority: 'high' }}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText(/Alta/i)).toBeInTheDocument();
  });

  it('llama a onToggle al hacer click en el checkbox', () => {
    const handleToggle = vi.fn();
    render(
      <TodoItem task={baseTask} onToggle={handleToggle} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleToggle).toHaveBeenCalledWith('task-1', true);
  });

  it('llama a onDelete al hacer click en el botón eliminar', () => {
    const handleDelete = vi.fn();
    render(
      <TodoItem task={baseTask} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={handleDelete} />
    );
    fireEvent.click(screen.getByLabelText(/eliminar tarea/i));
    expect(handleDelete).toHaveBeenCalledWith('task-1');
  });

  it('muestra el formulario de edición al hacer click en editar', () => {
    render(
      <TodoItem task={baseTask} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    fireEvent.click(screen.getByLabelText(/editar tarea/i));
    expect(screen.getByTestId('todo-form')).toBeInTheDocument();
  });

  it('aplica clase completada cuando la tarea está completada', () => {
    render(
      <TodoItem
        task={{ ...baseTask, completed: true }}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByTestId('todo-item')).toHaveClass('todo-item--completed');
  });

  it('muestra la descripción si existe', () => {
    render(
      <TodoItem task={baseTask} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
  });

  it('no muestra descripción si está vacía', () => {
    render(
      <TodoItem
        task={{ ...baseTask, description: '' }}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.queryByText('Descripción de prueba')).not.toBeInTheDocument();
  });
});
