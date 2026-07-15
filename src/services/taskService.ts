import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, NewTask } from '../types';

const COLLECTION = 'tasks';

export const createTask = async (userId: string, task: NewTask, order: number): Promise<Task> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...task,
    userId,
    completed: false,
    priority: task.priority ?? 'medium',
    dueDate: task.dueDate ?? null,
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...task,
    userId,
    completed: false,
    priority: task.priority ?? 'medium',
    order,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getTasks = async (userId: string): Promise<Task[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      userId: data.userId,
      priority: data.priority ?? 'medium',
      dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : undefined,
      order: data.order ?? 0,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'priority' | 'dueDate'>>
): Promise<void> => {
  const taskRef = doc(db, COLLECTION, taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION, taskId));
};

export const toggleTask = async (taskId: string, completed: boolean): Promise<void> => {
  await updateTask(taskId, { completed });
};

// Reorder tasks in Firestore using a batch write
export const reorderTasks = async (tasks: Task[]): Promise<void> => {
  const batch = writeBatch(db);
  tasks.forEach((task, index) => {
    const ref = doc(db, COLLECTION, task.id);
    batch.update(ref, { order: index, updatedAt: serverTimestamp() });
  });
  await batch.commit();
};
