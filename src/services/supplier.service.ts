import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface Supplier {
  id: string;
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
  paymentTerms?: string;
  taxId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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
  paymentTerms?: string;
  taxId?: string;
  notes?: string;
}

export const supplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await api.get(API_ENDPOINTS.suppliers.list);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      throw error;
    }
  },

  async createSupplier(data: CreateSupplierDTO): Promise<Supplier> {
    try {
      const response = await api.post(API_ENDPOINTS.suppliers.create, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create supplier:', error);
      throw error;
    }
  },

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    try {
      const response = await api.put(
        API_ENDPOINTS.suppliers.update.replace(':id', id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update supplier:', error);
      throw error;
    }
  },

  async deleteSupplier(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.suppliers.delete.replace(':id', id));
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      throw error;
    }
  },

  async getSupplier(id: string): Promise<Supplier> {
    try {
      const response = await api.get(
        API_ENDPOINTS.suppliers.detail.replace(':id', id)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch supplier:', error);
      throw error;
    }
  },
};