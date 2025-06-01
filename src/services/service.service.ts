import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Service } from '../pages/dashboard/customers/services';

export interface CreateServiceDTO {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  status: "active" | "inactive";
}

export const serviceService = {
  async getServices() {
    const response = await api.get(API_ENDPOINTS.services.list);
    return response.data;
  },

  async createService(data: CreateServiceDTO) {
    const response = await api.post(API_ENDPOINTS.services.create, data);
    return response.data;
  },

  async updateService(id: string, data: Partial<Service>) {
    const response = await api.put(
      API_ENDPOINTS.services.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteService(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.services.delete.replace(':id', id)
    );
    return response.data;
  },

  async getService(id: string) {
    const response = await api.get(
      API_ENDPOINTS.services.detail.replace(':id', id)
    );
    return response.data;
  },
};