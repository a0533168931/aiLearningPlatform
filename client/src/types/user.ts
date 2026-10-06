export type Role = 'USER' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
