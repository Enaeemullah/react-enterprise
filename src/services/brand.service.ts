import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface Brand {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDTO {
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  status: "active" | "inactive";
}

export const brandService = {
  async getBrands(): Promise<Brand[]> {
    try {
      const response = await api.get(API_ENDPOINTS.brands.list);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      throw error;
    }
  },

  async createBrand(data: CreateBrandDTO): Promise<Brand> {
    try {
      const response = await api.post(API_ENDPOINTS.brands.create, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create brand:', error);
      throw error;
    }
  },

  async updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
    try {
      const response = await api.put(
        API_ENDPOINTS.brands.update.replace(':id', id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update brand:', error);
      throw error;
    }
  },

  async deleteBrand(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.brands.delete.replace(':id', id));
    } catch (error) {
      console.error('Failed to delete brand:', error);
      throw error;
    }
  },

  async getBrand(id: string): Promise<Brand> {
    try {
      const response = await api.get(
        API_ENDPOINTS.brands.detail.replace(':id', id)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch brand:', error);
      throw error;
    }
  },
};