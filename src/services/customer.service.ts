import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerType?: "individual" | "business";
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  status: "active" | "inactive";
  services?: CustomerService[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerService {
  id: string;
  customerId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerType?: "individual" | "business";
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  status?: "active" | "inactive";
}

export interface CreateCustomerServiceDTO {
  customerId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  status?: "active" | "inactive";
}

export const customerService = {
  // Customer CRUD operations
  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await api.get(API_ENDPOINTS.customers.list);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  },

  async createCustomer(data: CreateCustomerDTO): Promise<Customer> {
    try {
      const response = await api.post(API_ENDPOINTS.customers.create, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  },

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    try {
      const response = await api.put(
        API_ENDPOINTS.customers.update.replace(':id', id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.customers.delete.replace(':id', id));
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  },

  async getCustomer(id: string): Promise<Customer> {
    try {
      const response = await api.get(
        API_ENDPOINTS.customers.detail.replace(':id', id)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      throw error;
    }
  },

  // Customer Services CRUD operations
  async getCustomerServices(customerId?: string): Promise<CustomerService[]> {
    try {
      const url = customerId 
        ? `${API_ENDPOINTS.services.list}?customerId=${customerId}`
        : API_ENDPOINTS.services.list;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer services:', error);
      throw error;
    }
  },

  async createCustomerService(data: CreateCustomerServiceDTO): Promise<CustomerService> {
    try {
      const response = await api.post(API_ENDPOINTS.services.create, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create customer service:', error);
      throw error;
    }
  },

  async updateCustomerService(id: string, data: Partial<CustomerService>): Promise<CustomerService> {
    try {
      const response = await api.put(
        API_ENDPOINTS.services.update.replace(':id', id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update customer service:', error);
      throw error;
    }
  },

  async deleteCustomerService(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.services.delete.replace(':id', id));
    } catch (error) {
      console.error('Failed to delete customer service:', error);
      throw error;
    }
  },

  async getCustomerService(id: string): Promise<CustomerService> {
    try {
      const response = await api.get(
        API_ENDPOINTS.services.detail.replace(':id', id)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer service:', error);
      throw error;
    }
  },

  // Search and filter operations
  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const response = await api.get(`${API_ENDPOINTS.customers.list}?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search customers:', error);
      throw error;
    }
  },

  async filterCustomers(filters: {
    status?: string;
    customerType?: string;
    city?: string;
    state?: string;
    country?: string;
  }): Promise<Customer[]> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await api.get(`${API_ENDPOINTS.customers.list}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to filter customers:', error);
      throw error;
    }
  },
};