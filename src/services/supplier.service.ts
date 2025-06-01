import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Supplier } from '../pages/dashboard/inventory/suppliers';

export interface CreateSupplierDTO {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status: "active" | "inactive";
  paymentTerms: string;
  taxId: string;
  notes: string;
}

export const supplierService = {
  async getSuppliers() {
    const response = await api.get(API_ENDPOINTS.suppliers.list);
    return response.data;
  },

  async createSupplier(data: CreateSupplierDTO) {
    const response = await api.post(API_ENDPOINTS.suppliers.create, data);
    return response.data;
  },

  async updateSupplier(id: string, data: Partial<Supplier>) {
    const response = await api.put(
      API_ENDPOINTS.suppliers.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteSupplier(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.suppliers.delete.replace(':id', id)
    );
    return response.data;
  },

  async getSupplier(id: string) {
    const response = await api.get(
      API_ENDPOINTS.suppliers.detail.replace(':id', id)
    );
    return response.data;
  },
};