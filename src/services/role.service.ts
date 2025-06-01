import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Role } from '../pages/dashboard/roles';

export interface CreateRoleDTO {
  name: string;
  description: string;
  permissions?: string[];
}

export const roleService = {
  async getRoles() {
    const response = await api.get(API_ENDPOINTS.roles.list);
    return response.data;
  },

  async createRole(data: CreateRoleDTO) {
    const response = await api.post(API_ENDPOINTS.roles.create, data);
    return response.data;
  },

  async updateRole(id: string, data: Partial<Role>) {
    const response = await api.put(
      API_ENDPOINTS.roles.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteRole(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.roles.delete.replace(':id', id)
    );
    return response.data;
  },

  async getRole(id: string) {
    const response = await api.get(
      API_ENDPOINTS.roles.detail.replace(':id', id)
    );
    return response.data;
  },

  async assignPermissions(id: string, permissions: string[]) {
    const response = await api.post(
      API_ENDPOINTS.roles.permissions.replace(':id', id),
      { permissions }
    );
    return response.data;
  },
};