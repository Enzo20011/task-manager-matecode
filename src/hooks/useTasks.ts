import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { Task, NewTask } from '../types';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../services/taskService';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks(user.uid);
      setTasks(data);
    } catch (err) {
      setError('Error al cargar las tareas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: NewTask) => {
    if (!user) return;
    try {
      const newTask = await createTask(user.uid, task);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError('Error al crear la tarea');
      console.error(err);
    }
  };

  const editTask = async (taskId: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) => {
    try {
      await updateTask(taskId, updates);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t))
      );
    } catch (err) {
      setError('Error al editar la tarea');
      console.error(err);
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError('Error al eliminar la tarea');
      console.error(err);
    }
  };

  const toggle = async (taskId: string, completed: boolean) => {
    try {
      await toggleTask(taskId, completed);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed, updatedAt: new Date() } : t))
      );
    } catch (err) {
      setError('Error al actualizar la tarea');
      console.error(err);
    }
  };

  return { tasks, loading, error, addTask, editTask, removeTask, toggle, refetch: fetchTasks };
};
