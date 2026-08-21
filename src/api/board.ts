import mockData from '../data/mock-data.json'

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId: number;
  dueDate: string;
  sprintId: number;
  order: number;
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export const fetchTasks = async (): Promise<Task[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Return the first 30 tasks
  return (mockData.tasks as unknown as Task[]).slice(0, 30);
};

export const fetchUsers = async (): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockData.users as User[];
};
