import { mockUsers, mockRoles, mockMenus, User, Role, Menu } from './mockData';

class SystemService {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  }

  async getRoles(): Promise<Role[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRoles), 500);
    });
  }

  async getMenus(): Promise<Menu[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMenus), 500);
    });
  }
}

export const systemService = new SystemService();
