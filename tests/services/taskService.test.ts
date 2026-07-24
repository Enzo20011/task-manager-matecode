import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so mock functions are available inside vi.mock factories
const mocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
  writeBatch: vi.fn(),
}));

vi.mock('../../src/services/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  collection: mocks.collection,
  addDoc: mocks.addDoc,
  getDocs: mocks.getDocs,
  updateDoc: mocks.updateDoc,
  deleteDoc: mocks.deleteDoc,
  doc: mocks.doc,
  query: mocks.query,
  where: mocks.where,
  orderBy: mocks.orderBy,
  serverTimestamp: mocks.serverTimestamp,
  Timestamp: {},
  writeBatch: mocks.writeBatch,
}));

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
} from '../../src/services/taskService';

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.collection.mockReturnValue('collectionRef');
    mocks.doc.mockReturnValue('docRef');
    mocks.query.mockReturnValue('queryRef');
    mocks.where.mockReturnValue('whereRef');
    mocks.orderBy.mockReturnValue('orderByRef');
  });

  describe('createTask', () => {
    it('llama a addDoc y retorna la tarea con id', async () => {
      mocks.addDoc.mockResolvedValue({ id: 'new-id' });

      const result = await createTask('user-1', {
        title: 'Nueva tarea',
        description: '',
        completed: false,
        priority: 'low',
      }, 0);

      expect(mocks.addDoc).toHaveBeenCalledOnce();
      expect(result.id).toBe('new-id');
      expect(result.title).toBe('Nueva tarea');
      expect(result.userId).toBe('user-1');
    });
  });

  describe('getTasks', () => {
    it('retorna lista de tareas del usuario', async () => {
      mocks.getDocs.mockResolvedValue({
        docs: [
          {
            id: 'task-1',
            data: () => ({
              title: 'Tarea 1',
              description: '',
              completed: false,
              userId: 'user-1',
              priority: 'medium',
              dueDate: null,
              order: 0,
              createdAt: { toDate: () => new Date() },
              updatedAt: { toDate: () => new Date() },
            }),
          },
        ],
      });

      const tasks = await getTasks('user-1');
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Tarea 1');
      expect(tasks[0].id).toBe('task-1');
    });

    it('retorna lista vacía si no hay tareas', async () => {
      mocks.getDocs.mockResolvedValue({ docs: [] });
      const tasks = await getTasks('user-1');
      expect(tasks).toHaveLength(0);
    });
  });

  describe('updateTask', () => {
    it('llama a updateDoc con los campos correctos', async () => {
      mocks.updateDoc.mockResolvedValue(undefined);
      await updateTask('task-1', { title: 'Título actualizado' });
      expect(mocks.updateDoc).toHaveBeenCalledOnce();
      expect(mocks.updateDoc).toHaveBeenCalledWith(
        'docRef',
        expect.objectContaining({ title: 'Título actualizado' })
      );
    });
  });

  describe('deleteTask', () => {
    it('llama a deleteDoc con el id correcto', async () => {
      mocks.deleteDoc.mockResolvedValue(undefined);
      await deleteTask('task-1');
      expect(mocks.deleteDoc).toHaveBeenCalledOnce();
      expect(mocks.doc).toHaveBeenCalledWith(expect.anything(), 'tasks', 'task-1');
    });
  });

  describe('toggleTask', () => {
    it('llama a updateDoc con completed correcto', async () => {
      mocks.updateDoc.mockResolvedValue(undefined);
      await toggleTask('task-1', true);
      expect(mocks.updateDoc).toHaveBeenCalledWith(
        'docRef',
        expect.objectContaining({ completed: true })
      );
    });
  });
});
