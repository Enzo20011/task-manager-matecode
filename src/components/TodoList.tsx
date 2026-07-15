import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { TodoItem } from './TodoItem';

// Sortable wrapper around TodoItem
interface SortableItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>) => void;
  onDelete: (id: string) => void;
}

const SortableTodoItem = ({ task, onToggle, onEdit, onDelete }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TodoItem
        task={task}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

interface TodoListProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>>) => void;
  onDelete: (id: string) => void;
  onReorder: (newOrder: Task[]) => void;
}

export const TodoList = ({ tasks, onToggle, onEdit, onDelete, onReorder }: TodoListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    onReorder(reordered);
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <span className="empty-state__icon">📋</span>
        <p>No tenés tareas todavía. ¡Creá tu primera tarea!</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="todo-list" data-testid="todo-list">
          {tasks.map((task) => (
            <SortableTodoItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
