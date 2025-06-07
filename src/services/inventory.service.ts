import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import { InventoryItem, transformBackendItem, transformFrontendItem } from '../contexts/inventory-context';

export interface CreateInventoryItemDTO {
  name: string;
  description: string;
  categoryId?: number;
  stockQuantity: number;
  sellingPrice: number;
  costPrice?: number;
  sku: string;
  brandId?: number;
  imageUrl?: string;
}

export const inventoryService = {
  async getItems(): Promise<InventoryItem[]> {
    try {
      const response = await api.get(API_ENDPOINTS.inventory.list);
      // Transform backend response to frontend format
      return response.data.map(transformBackendItem);
    } catch (error) {
      console.error('Failed to fetch inventory items:', error);
      throw error;
    }
  },

  async createItem(data: CreateInventoryItemDTO | any) {
    try {
      // Transform frontend data to backend format if needed
      const backendData = data.name ? transformFrontendItem(data) : data;
      const response = await api.post(API_ENDPOINTS.inventory.create, backendData);
      return transformBackendItem(response.data);
    } catch (error) {
      console.error('Failed to create inventory item:', error);
      throw error;
    }
  },

  async updateItem(id: string, data: Partial<InventoryItem>) {
    try {
      // Transform frontend data to backend format
      const backendData = transformFrontendItem(data);
      const response = await api.put(
        API_ENDPOINTS.inventory.update.replace(':id', id),
        backendData
      );
      return transformBackendItem(response.data);
    } catch (error) {
      console.error('Failed to update inventory item:', error);
      throw error;
    }
  },

  async deleteItem(id: string) {
    try {
      const response = await api.delete(
        API_ENDPOINTS.inventory.delete.replace(':id', id)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete inventory item:', error);
      throw error;
    }
  },

  async getItem(id: string): Promise<InventoryItem> {
    try {
      const response = await api.get(
        API_ENDPOINTS.inventory.detail.replace(':id', id)
      );
      return transformBackendItem(response.data);
    } catch (error) {
      console.error('Failed to fetch inventory item:', error);
      throw error;
    }
  },
};