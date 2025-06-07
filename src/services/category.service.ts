import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface Category {
  id: number;
  name: string;
  description?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  status: "active" | "inactive";
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get(API_ENDPOINTS.categories.list);
      // Ensure all categories have required fields with defaults
      return response.data.map((category: any) => ({
        id: category.id,
        name: category.name || 'Unnamed Category',
        description: category.description || '',
        status: category.status || 'active',
        createdAt: category.createdAt || new Date().toISOString(),
        updatedAt: category.updatedAt || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    try {
      const response = await api.post(API_ENDPOINTS.categories.create, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  },

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    try {
      const response = await api.put(
        API_ENDPOINTS.categories.update.replace(':id', id.toString()),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.categories.delete.replace(':id', id.toString()));
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  },

  async getCategory(id: number): Promise<Category> {
    try {
      const response = await api.get(
        API_ENDPOINTS.categories.detail.replace(':id', id.toString())
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      throw error;
    }
  },
};