// Tipos compartidos de la aplicación

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
