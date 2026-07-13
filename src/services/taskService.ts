import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, NewTask } from '../types';

const COLLECTION = 'tasks';

export const createTask = async (userId: string, task: NewTask): Promise<Task> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...task,
    userId,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...task,
    userId,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getTasks = async (userId: string): Promise<Task[]> => {
  const q = query(collection(db, COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      userId: data.userId,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    };
  });
};

export const updateTask = async (taskId: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>): Promise<void> => {
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
