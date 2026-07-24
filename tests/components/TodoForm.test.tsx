import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoForm } from '../../src/components/TodoForm';

describe('TodoForm', () => {
  it('renderiza los campos de título y descripción', () => {
    render(<TodoForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
  });

  it('llama a onSubmit con el título y descripción correctos', () => {
    const handleSubmit = vi.fn();
    render(<TodoForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Mi tarea de prueba' },
    });
    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'Descripción de prueba' },
    });
    fireEvent.submit(screen.getByTestId('todo-form'));

    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Mi tarea de prueba',
      description: 'Descripción de prueba',
      completed: false,
      priority: 'medium',
      dueDate: undefined,
    });
  });

  it('no llama a onSubmit si el título está vacío', () => {
    const handleSubmit = vi.fn();
    render(<TodoForm onSubmit={handleSubmit} />);
    fireEvent.submit(screen.getByTestId('todo-form'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('limpia los campos luego de enviar', () => {
    render(<TodoForm onSubmit={vi.fn()} />);
    const input = screen.getByLabelText(/título/i);
    fireEvent.change(input, { target: { value: 'Tarea' } });
    fireEvent.submit(screen.getByTestId('todo-form'));
    expect(input).toHaveValue('');
  });

  it('muestra botón Cancelar si onCancel está provisto', () => {
    render(<TodoForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText(/cancelar/i)).toBeInTheDocument();
  });
});
