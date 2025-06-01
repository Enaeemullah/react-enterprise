import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface CreateTransferDTO {
  sourceBranchId: string;
  destinationBranchId: string;
  itemId: string;
  quantity: number;
  notes?: string;
}

export interface Transfer {
  id: string;
  sourceBranchId: string;
  destinationBranchId: string;
  itemId: string;
  quantity: number;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const transferService = {
  async getTransfers() {
    const response = await api.get(API_ENDPOINTS.transfers.list);
    return response.data;
  },

  async createTransfer(data: CreateTransferDTO) {
    const response = await api.post(API_ENDPOINTS.transfers.create, data);
    return response.data;
  },

  async updateTransfer(id: string, data: Partial<Transfer>) {
    const response = await api.put(
      API_ENDPOINTS.transfers.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async cancelTransfer(id: string) {
    const response = await api.post(
      API_ENDPOINTS.transfers.cancel.replace(':id', id)
    );
    return response.data;
  },

  async getTransfer(id: string) {
    const response = await api.get(
      API_ENDPOINTS.transfers.detail.replace(':id', id)
    );
    return response.data;
  },
};