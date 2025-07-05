import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface CreateCurrencyDTO {
  code: string;
  shortName: string;
  description: string;
}

export interface Currency {
  id: string;
  code: string;
  shortName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const currencyService = {
  async getCurrencies(): Promise<Currency[]> {
    try {
      const response = await api.get(API_ENDPOINTS.currencies.list);
      return response.data;
    } catch (error) {
      // Return mock data for development
      return [
        {
          id: "1",
          code: "101",
          shortName: "PKR",
          description: "Pakistani Rupees",
          createdAt: "2024-03-15T10:00:00Z",
          updatedAt: "2024-03-15T10:00:00Z",
        },
        {
          id: "2",
          code: "102",
          shortName: "USD",
          description: "US Dollar",
          createdAt: "2024-03-15T10:00:00Z",
          updatedAt: "2024-03-15T10:00:00Z",
        }
      ];
    }
  },

  async createCurrency(data: CreateCurrencyDTO): Promise<Currency> {
    const response = await api.post(API_ENDPOINTS.currencies.create, data);
    return response.data;
  },

  async updateCurrency(id: string, data: Partial<Currency>): Promise<Currency> {
    const response = await api.put(
      API_ENDPOINTS.currencies.update.replace(':id', id),
      data
    );
    return response.data;
  },

  async deleteCurrency(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.currencies.delete.replace(':id', id));
  },

  async getCurrency(id: string): Promise<Currency> {
    const response = await api.get(
      API_ENDPOINTS.currencies.detail.replace(':id', id)
    );
    return response.data;
  },
};