import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import { InventoryItem } from '../contexts/inventory-context';

export interface CreateInventoryItemDTO {
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  sku: string;
  barcode?: string;
  reorderPoint: number;
  unit: string;
  supplier?: string;
  location?: string;
  tags?: string[];
}

export const inventoryService = {
  async getItems() {
    const response = await api.get(API_ENDPOINTS.inventory.list);
    return response.data;
  },

  async createItem(data: CreateInventoryItemDTO) {
    const response = await api.post(API_ENDPOINTS.inventory.create, data);
    return response.data;
  },

  async updateItem(id: string, data: Partial<InventoryItem>) {
    const response = await api.put(
      API_ENDPOINTS.inventory.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteItem(id: string) {
    const response = await api.delete(
      API_ENDPOINTS.inventory.delete.replace(':id', id)
    );
    return response.data;
  },

  async getItem(id: string) {
    const response = await api.get(
      API_ENDPOINTS.inventory.detail.replace(':id', id)
    );
    return response.data;
  },
};