import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Branch } from '../pages/dashboard/inventory/branches';

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
  async getBranches() {
    const response = await api.get(API_ENDPOINTS.branches.list);
    return response.data;
  },

  async createBranch(data: CreateBranchDTO) {
    const response = await api.post(API_ENDPOINTS.branches.create, data);
    return response.data;
  },

  async updateBranch(id: string, data: Partial<Branch>) {
    const response = await api.put(
      API_ENDPOINTS.branches.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteBranch(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.branches.delete.replace(':id', id)
    );
    return response.data;
  },

  async getBranch(id: string) {
    const response = await api.get(
      API_ENDPOINTS.branches.detail.replace(':id', id)
    );
    return response.data;
  },
};