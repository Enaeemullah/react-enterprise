import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Action } from '../pages/dashboard/actions';

export interface CreateActionDTO {
  name: string;
  description: string;
  module: string;
  type: 'create' | 'read' | 'update' | 'delete' | 'custom';
}

export const actionService = {
  async getActions() {
    const response = await api.get(API_ENDPOINTS.actions.list);
    return response.data;
  },

  async createAction(data: CreateActionDTO) {
    const response = await api.post(API_ENDPOINTS.actions.create, data);
    return response.data;
  },

  async updateAction(id: string, data: Partial<Action>) {
    const response = await api.put(
      API_ENDPOINTS.actions.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteAction(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.actions.delete.replace(':id', id)
    );
    return response.data;
  },

  async getAction(id: string) {
    const response = await api.get(
      API_ENDPOINTS.actions.detail.replace(':id', id)
    );
    return response.data;
  },
};