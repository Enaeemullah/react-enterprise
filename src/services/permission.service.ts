import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Permission } from '../pages/dashboard/permissions';

export interface CreatePermissionDTO {
  name: string;
  description: string;
  module: string;
  actions?: string[];
}

export const permissionService = {
  async getPermissions() {
    const response = await api.get(API_ENDPOINTS.permissions.list);
    return response.data;
  },

  async createPermission(data: CreatePermissionDTO) {
    const response = await api.post(API_ENDPOINTS.permissions.create, data);
    return response.data;
  },

  async updatePermission(id: string, data: Partial<Permission>) {
    const response = await api.put(
      API_ENDPOINTS.permissions.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deletePermission(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.permissions.delete.replace(':id', id)
    );
    return response.data;
  },

  async getPermission(id: string) {
    const response = await api.get(
      API_ENDPOINTS.permissions.detail.replace(':id', id)
    );
    return response.data;
  },

  async assignActions(id: string, actions: string[]) {
    const response = await api.post(
      API_ENDPOINTS.permissions.actions.replace(':id', id),
      { actions }
    );
    return response.data;
  },
};