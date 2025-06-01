import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Module } from '../pages/dashboard/modules';

export interface CreateModuleDTO {
  name: string;
  description: string;
  path: string;
  icon?: string;
  status: 'active' | 'inactive';
  order: number;
}

export const moduleService = {
  async getModules() {
    const response = await api.get(API_ENDPOINTS.modules.list);
    return response.data;
  },

  async createModule(data: CreateModuleDTO) {
    const response = await api.post(API_ENDPOINTS.modules.create, data);
    return response.data;
  },

  async updateModule(id: string, data: Partial<Module>) {
    const response = await api.put(
      API_ENDPOINTS.modules.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteModule(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.modules.delete.replace(':id', id)
    );
    return response.data;
  },

  async getModule(id: string) {
    const response = await api.get(
      API_ENDPOINTS.modules.detail.replace(':id', id)
    );
    return response.data;
  },
};