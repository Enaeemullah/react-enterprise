import api from './api';
import { API_ENDPOINTS } from '../constants/config';
import type { Currency } from '../components/currencies/currency-form';

export interface CreateCurrencyDTO {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isBaseCurrency: boolean;
  status: "active" | "inactive";
  decimalPlaces: number;
  country: string;
}

export const currencyService = {
  async getCurrencies() {
    const response = await api.get('/currencies');
    return response.data;
  },

  async createCurrency(data: CreateCurrencyDTO) {
    const response = await api.post('/currencies', data);
    return response.data;
  },

  async updateCurrency(id: string, data: Partial<Currency>) {
    const response = await api.put(`/currencies/${id}`, data);
    return response.data;
  },

  async deleteCurrency(id: string) {
    const response = await api.delete(`/currencies/${id}`);
    return response.data;
  },

  async getCurrency(id: string) {
    const response = await api.get(`/currencies/${id}`);
    return response.data;
  },

  async setBaseCurrency(id: string) {
    const response = await api.post(`/currencies/${id}/set-base`);
    return response.data;
  },

  async updateExchangeRates() {
    const response = await api.post('/currencies/update-rates');
    return response.data;
  },

  async getExchangeRate(fromCurrency: string, toCurrency: string) {
    const response = await api.get(`/currencies/exchange-rate?from=${fromCurrency}&to=${toCurrency}`);
    return response.data;
  },
};