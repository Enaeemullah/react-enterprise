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

export interface UpdateBranchDTO {
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  status?: "active" | "inactive";
}

export const branchService = {
  // Get all branches
  async getBranches(): Promise<Branch[]> {
    try {
      console.log('Fetching branches from API...');
      const response = await api.get(API_ENDPOINTS.branches.list);
      console.log('Branches fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      throw new Error('Failed to fetch branches from server. Please check your connection and try again.');
    }
  },

  // Get single branch by ID
  async getBranch(id: string): Promise<Branch> {
    try {
      console.log('Fetching branch with ID:', id);
      
      if (!id) {
        throw new Error('Branch ID is required');
      }

      const response = await api.get(
        API_ENDPOINTS.branches.detail.replace(':id', id)
      );
      console.log('Branch fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch branch:', error);
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error('Branch not found');
      }
      throw new Error('Failed to fetch branch details from server. Please try again.');
    }
  },

  // Create new branch
  async createBranch(data: CreateBranchDTO): Promise<Branch> {
    try {
      console.log('Creating branch with data:', data);
      
      // Validate required fields
      const requiredFields: (keyof CreateBranchDTO)[] = [
        'name', 'code', 'address', 'city', 'state', 'country', 'zipCode', 'phone', 'email'
      ];
      
      for (const field of requiredFields) {
        if (!data[field] || data[field].toString().trim() === '') {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone format (basic validation)
      if (data.phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      const response = await api.post(API_ENDPOINTS.branches.create, data);
      console.log('Branch created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create branch:', error);
      
      if (error instanceof Error) {
        // If it's a validation error we threw, pass it through
        if (error.message.includes('required') || error.message.includes('valid')) {
          throw error;
        }
        
        // Handle API errors
        if (error.message.includes('409') || error.message.includes('conflict')) {
          throw new Error('A branch with this code or email already exists');
        }
        
        if (error.message.includes('400')) {
          throw new Error('Invalid branch data provided. Please check all fields and try again.');
        }
      }
      
      throw new Error('Failed to create branch. Please check your connection and try again.');
    }
  },

  // Update existing branch
  async updateBranch(id: string, data: UpdateBranchDTO): Promise<Branch> {
    try {
      console.log('Updating branch with ID:', id, 'Data:', data);
      
      if (!id) {
        throw new Error('Branch ID is required for update');
      }

      // Validate email format if provided
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new Error('Please enter a valid email address');
        }
      }

      // Validate phone format if provided
      if (data.phone && data.phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      const response = await api.put(
        API_ENDPOINTS.branches.update.replace(':id', id),
        data
      );
      console.log('Branch updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update branch:', error);
      
      if (error instanceof Error) {
        // If it's a validation error we threw, pass it through
        if (error.message.includes('valid')) {
          throw error;
        }
        
        // Handle API errors
        if (error.message.includes('404')) {
          throw new Error('Branch not found');
        }
        
        if (error.message.includes('409') || error.message.includes('conflict')) {
          throw new Error('A branch with this code or email already exists');
        }
        
        if (error.message.includes('400')) {
          throw new Error('Invalid branch data provided. Please check all fields and try again.');
        }
      }
      
      throw new Error('Failed to update branch. Please check your connection and try again.');
    }
  },

  // Delete branch
  async deleteBranch(id: string): Promise<void> {
    try {
      console.log('Deleting branch with ID:', id);
      
      if (!id) {
        throw new Error('Branch ID is required for deletion');
      }

      await api.delete(API_ENDPOINTS.branches.delete.replace(':id', id));
      console.log('Branch deleted successfully');
    } catch (error) {
      console.error('Failed to delete branch:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          throw new Error('Branch not found');
        }
        
        if (error.message.includes('409') || error.message.includes('conflict')) {
          throw new Error('Cannot delete branch as it is being used by other records');
        }
      }
      
      throw new Error('Failed to delete branch. Please check your connection and try again.');
    }
  },

  // Bulk operations
  async bulkUpdateBranches(updates: Array<{ id: string; data: UpdateBranchDTO }>): Promise<Branch[]> {
    try {
      console.log('Bulk updating branches:', updates);
      
      if (!updates || updates.length === 0) {
        throw new Error('No updates provided');
      }

      const promises = updates.map(({ id, data }) => this.updateBranch(id, data));
      const results = await Promise.all(promises);
      console.log('Bulk update completed successfully');
      return results;
    } catch (error) {
      console.error('Failed to bulk update branches:', error);
      throw new Error('Failed to update multiple branches. Some updates may have succeeded.');
    }
  },

  async bulkDeleteBranches(ids: string[]): Promise<void> {
    try {
      console.log('Bulk deleting branches:', ids);
      
      if (!ids || ids.length === 0) {
        throw new Error('No branch IDs provided');
      }

      const promises = ids.map(id => this.deleteBranch(id));
      await Promise.all(promises);
      console.log('Bulk delete completed successfully');
    } catch (error) {
      console.error('Failed to bulk delete branches:', error);
      throw new Error('Failed to delete multiple branches. Some deletions may have succeeded.');
    }
  },

  // Search and filter
  async searchBranches(query: string): Promise<Branch[]> {
    try {
      console.log('Searching branches with query:', query);
      
      if (!query || query.trim() === '') {
        return this.getBranches();
      }

      const response = await api.get(`${API_ENDPOINTS.branches.list}?search=${encodeURIComponent(query.trim())}`);
      console.log('Branch search completed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to search branches:', error);
      throw new Error('Failed to search branches. Please try again.');
    }
  },

  async filterBranches(filters: { 
    status?: string; 
    city?: string; 
    state?: string; 
    country?: string;
    page?: number;
    limit?: number;
  }): Promise<Branch[]> {
    try {
      console.log('Filtering branches with filters:', filters);
      
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.branches.list}?${queryString}` : API_ENDPOINTS.branches.list;
      
      const response = await api.get(url);
      console.log('Branch filter completed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to filter branches:', error);
      throw new Error('Failed to filter branches. Please try again.');
    }
  },

  // Get branch statistics
  async getBranchStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byState: Record<string, number>;
    byCountry: Record<string, number>;
  }> {
    try {
      console.log('Fetching branch statistics...');
      const response = await api.get(`${API_ENDPOINTS.branches.list}/stats`);
      console.log('Branch statistics fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch branch statistics:', error);
      // Fallback: calculate stats from all branches
      try {
        const branches = await this.getBranches();
        const stats = {
          total: branches.length,
          active: branches.filter(b => b.status === 'active').length,
          inactive: branches.filter(b => b.status === 'inactive').length,
          byState: branches.reduce((acc, branch) => {
            acc[branch.state] = (acc[branch.state] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byCountry: branches.reduce((acc, branch) => {
            acc[branch.country] = (acc[branch.country] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        };
        console.log('Calculated branch statistics from data:', stats);
        return stats;
      } catch (fallbackError) {
        throw new Error('Failed to fetch branch statistics.');
      }
    }
  },
};