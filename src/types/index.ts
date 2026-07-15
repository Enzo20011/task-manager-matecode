// Tipos compartidos de la aplicación

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  priority: Priority;
  dueDate?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'order'>;

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
