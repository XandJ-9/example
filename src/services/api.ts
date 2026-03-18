// Mock Data Service
// This file separates data fetching from view components.

import { User, Role, mockUsers as initialUsers, mockRoles as initialRoles } from './mockData';

export type { User, Role };

let mockUsers: User[] = [...initialUsers];
let mockRoles: Role[] = [...initialRoles];

export const api = {
  // User Management
  getUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockUsers]), 300));
  },
  addUser: async (user: Omit<User, 'id' | 'createTime'>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...user,
          id: Math.max(0, ...mockUsers.map(u => u.id)) + 1,
          createTime: new Date().toISOString().split('T')[0],
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }, 300);
    });
  },
  updateUser: async (id: number, data: Partial<User>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id);
        if (index !== -1) mockUsers[index] = { ...mockUsers[index], ...data };
        resolve();
      }, 300);
    });
  },
  deleteUser: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUsers = mockUsers.filter(u => u.id !== id);
        resolve();
      }, 300);
    });
  },

  // Role Management
  getRoles: async (): Promise<Role[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockRoles]), 300));
  },
  addRole: async (role: Omit<Role, 'id' | 'createTime'>): Promise<Role> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRole: Role = {
          ...role,
          id: Math.max(0, ...mockRoles.map(r => r.id)) + 1,
          createTime: new Date().toISOString().split('T')[0],
        };
        mockRoles.push(newRole);
        resolve(newRole);
      }, 300);
    });
  },
  updateRole: async (id: number, data: Partial<Role>): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockRoles.findIndex(r => r.id === id);
        if (index !== -1) mockRoles[index] = { ...mockRoles[index], ...data };
        resolve();
      }, 300);
    });
  },
  deleteRole: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockRoles = mockRoles.filter(r => r.id !== id);
        resolve();
      }, 300);
    });
  },
};
