import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoList } from '../../src/components/TodoList';
import type { Task } from '../../src/types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Tarea 1',
    description: 'Descripción 1',
    completed: false,
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Tarea 2',
    description: '',
    completed: true,
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('TodoList', () => {
  it('muestra el estado vacío cuando no hay tareas', () => {
    render(
      <TodoList tasks={[]} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renderiza la lista de tareas correctamente', () => {
    render(
      <TodoList tasks={mockTasks} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('todo-item')).toHaveLength(2);
  });

  it('muestra los títulos de las tareas', () => {
    render(
      <TodoList tasks={mockTasks} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea 2')).toBeInTheDocument();
  });
});
