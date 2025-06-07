import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchDTO {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
}

export const branchService = {
  async getBranches(): Promise<Branch[]> {
    try {
      const response = await api.get(API_ENDPOINTS.branches.list);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      throw error;
    }
  },

  async createBranch(data: CreateBranchDTO): Promise<Branch> {
    try {
      console.log('Creating branch with data:', data);
      const response = await api.post(API_ENDPOINTS.branches.create, data);
      console.log('Branch created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create branch:', error);
      throw error;
    }
  },

  async updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
    try {
      console.log('Updating branch with ID:', id, 'Data:', data);
      const response = await api.put(
        API_ENDPOINTS.branches.update.replace(':id', id),
        data
      );
      console.log('Branch updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update branch:', error);
      throw error;
    }
  },

  async deleteBranch(id: string): Promise<void> {
    try {
      console.log('Deleting branch with ID:', id);
      await api.delete(API_ENDPOINTS.branches.delete.replace(':id', id));
      console.log('Branch deleted successfully');
    } catch (error) {
      console.error('Failed to delete branch:', error);
      throw error;
    }
  },

  async getBranch(id: string): Promise<Branch> {
    try {
      const response = await api.get(
        API_ENDPOINTS.branches.detail.replace(':id', id)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch branch:', error);
      throw error;
    }
  },
};