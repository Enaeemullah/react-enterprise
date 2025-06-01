import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Customer } from '../pages/dashboard/customers';

export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
}

export const customerService = {
  async getCustomers() {
    const response = await api.get(API_ENDPOINTS.customers.list);
    return response.data;
  },

  async createCustomer(data: CreateCustomerDTO) {
    const response = await api.post(API_ENDPOINTS.customers.create, data);
    return response.data;
  },

  async updateCustomer(id: string, data: Partial<Customer>) {
    const response = await api.put(
      API_ENDPOINTS.customers.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteCustomer(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.customers.delete.replace(':id', id)
    );
    return response.data;
  },

  async getCustomer(id: string) {
    const response = await api.get(
      API_ENDPOINTS.customers.detail.replace(':id', id)
    );
    return response.data;
  },
};