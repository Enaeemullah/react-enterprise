import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface Transfer {
  id: string;
  sourceBranchId: string;
  destinationBranchId: string;
  itemId: string;
  quantity: number;
  notes?: string;
  status: 'completed' | 'cancelled';
  requestedBy: string;
  completedBy?: string;
  requestedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  sourceBranch?: {
    id: string;
    name: string;
    code: string;
  };
  destinationBranch?: {
    id: string;
    name: string;
    code: string;
  };
  item?: {
    id: string;
    name: string;
    sku: string;
    price: number;
  };
}

export interface CreateTransferDTO {
  sourceBranchId: string;
  destinationBranchId: string;
  itemId: string;
  quantity: number;
  notes?: string;
  status?: 'completed';
}

export const transferService = {
  // Get all transfers
  async getTransfers(): Promise<Transfer[]> {
    try {
      console.log('Fetching transfers from API...');
      const response = await api.get(API_ENDPOINTS.transfers.list);
      console.log('Transfers fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch transfers:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Transfers endpoint not found. Please check your API configuration.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view transfers.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error occurred while fetching transfers. Please try again later.');
      }
      
      throw new Error('Failed to fetch transfers from server. Please check your connection and try again.');
    }
  },

  // Get single transfer by ID
  async getTransfer(id: string): Promise<Transfer> {
    try {
      console.log('Fetching transfer with ID:', id);
      
      if (!id) {
        throw new Error('Transfer ID is required');
      }

      const response = await api.get(
        API_ENDPOINTS.transfers.detail.replace(':id', id)
      );
      console.log('Transfer fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch transfer:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Transfer not found');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view this transfer.');
      }
      
      throw new Error('Failed to fetch transfer details from server. Please try again.');
    }
  },

  // Create new transfer (direct completion)
  async createTransfer(data: CreateTransferDTO): Promise<Transfer> {
    try {
      console.log('Creating direct transfer with data:', data);
      
      // Validate required fields
      const requiredFields: (keyof CreateTransferDTO)[] = [
        'sourceBranchId', 'destinationBranchId', 'itemId', 'quantity'
      ];
      
      for (const field of requiredFields) {
        if (!data[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate quantity
      if (data.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      // Validate that source and destination are different
      if (data.sourceBranchId === data.destinationBranchId) {
        throw new Error('Source and destination branches must be different');
      }

      const response = await api.post(API_ENDPOINTS.transfers.create, {
        ...data,
        status: 'completed', // Direct transfer - immediately completed
      });
      console.log('Transfer completed successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create transfer:', error);
      
      if (error instanceof Error) {
        // If it's a validation error we threw, pass it through
        if (error.message.includes('required') || error.message.includes('must be')) {
          throw error;
        }
      }
      
      // Handle API errors
      if (error.response?.status === 400) {
        const serverMessage = error.response?.data?.message || error.response?.data?.error;
        throw new Error(serverMessage || 'Invalid transfer data provided. Please check all fields and try again.');
      } else if (error.response?.status === 404) {
        throw new Error('One or more referenced items (branch/inventory) not found');
      } else if (error.response?.status === 409) {
        throw new Error('Insufficient stock available for transfer');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error occurred while creating transfer. Please try again later.');
      }
      
      throw new Error('Failed to create transfer. Please check your connection and try again.');
    }
  },

  // Cancel transfer (if needed)
  async cancelTransfer(id: string, reason?: string): Promise<Transfer> {
    try {
      console.log('Cancelling transfer with ID:', id);
      
      if (!id) {
        throw new Error('Transfer ID is required for cancellation');
      }

      const response = await api.post(
        API_ENDPOINTS.transfers.cancel.replace(':id', id),
        { reason }
      );
      console.log('Transfer cancelled successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to cancel transfer:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Transfer not found');
      } else if (error.response?.status === 400) {
        throw new Error('Transfer cannot be cancelled');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to cancel this transfer.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error occurred while cancelling transfer. Please try again later.');
      }
      
      throw new Error('Failed to cancel transfer. Please check your connection and try again.');
    }
  },

  // Search and filter transfers
  async searchTransfers(query: string): Promise<Transfer[]> {
    try {
      console.log('Searching transfers with query:', query);
      
      if (!query || query.trim() === '') {
        return this.getTransfers();
      }

      const response = await api.get(`${API_ENDPOINTS.transfers.list}?search=${encodeURIComponent(query.trim())}`);
      console.log('Transfer search completed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to search transfers:', error);
      throw new Error('Failed to search transfers. Please try again.');
    }
  },

  async filterTransfers(filters: {
    status?: string;
    sourceBranchId?: string;
    destinationBranchId?: string;
    itemId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<Transfer[]> {
    try {
      console.log('Filtering transfers with filters:', filters);
      
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.transfers.list}?${queryString}` : API_ENDPOINTS.transfers.list;
      
      const response = await api.get(url);
      console.log('Transfer filter completed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to filter transfers:', error);
      throw new Error('Failed to filter transfers. Please try again.');
    }
  },

  // Get transfer statistics
  async getTransferStats(): Promise<{
    total: number;
    completed: number;
    cancelled: number;
    byBranch: Record<string, number>;
  }> {
    try {
      console.log('Fetching transfer statistics...');
      const response = await api.get(`${API_ENDPOINTS.transfers.list}/stats`);
      console.log('Transfer statistics fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transfer statistics:', error);
      // Fallback: calculate stats from all transfers
      try {
        const transfers = await this.getTransfers();
        const stats = {
          total: transfers.length,
          completed: transfers.filter(t => t.status === 'completed').length,
          cancelled: transfers.filter(t => t.status === 'cancelled').length,
          byBranch: transfers.reduce((acc, transfer) => {
            const branchName = transfer.sourceBranch?.name || transfer.sourceBranchId;
            acc[branchName] = (acc[branchName] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        };
        console.log('Calculated transfer statistics from data:', stats);
        return stats;
      } catch (fallbackError) {
        throw new Error('Failed to fetch transfer statistics.');
      }
    }
  },
};