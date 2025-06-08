import api from './api';
import { API_ENDPOINTS } from '../constants/config';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  position?: string;
  status: 'active' | 'inactive';
  bio?: string;
  location?: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  department?: string;
  position?: string;
  status: 'active' | 'inactive';
}

export interface UpdateUserProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  avatar?: string;
}

export interface Organization {
  id: string;
  orga_code: string;
  orga_desc: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrganizationDTO {
  orga_code?: string;
  orga_desc?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logo?: string;
}

export const userService = {
  // User CRUD operations
  async getUsers() {
    try {
      const response = await api.get(API_ENDPOINTS.users.list);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  async createUser(data: CreateUserDTO) {
    try {
      const response = await api.post(API_ENDPOINTS.users.create, data);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user');
    }
  },

  async updateUser(id: string, data: Partial<User>) {
    try {
      const response = await api.put(
        API_ENDPOINTS.users.update.replace(':id', id),
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user');
    }
  },

  async deleteUser(id: string) {
    try {
      const response = await api.delete(
        API_ENDPOINTS.users.delete.replace(':id', id)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  },

  async getUser(id: string) {
    try {
      const response = await api.get(
        API_ENDPOINTS.users.detail.replace(':id', id)
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user');
    }
  },

  // Profile operations
  async getUserProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.profile.get);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  },

  async updateUserProfile(data: UpdateUserProfileDTO) {
    try {
      const response = await api.put(API_ENDPOINTS.profile.update, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error('Failed to update user profile');
    }
  },

  async updateUserPreferences(preferences: any) {
    try {
      const response = await api.put(API_ENDPOINTS.profile.updatePreferences, { preferences });
      return response.data;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  },

  // Organization operations
  async getOrganization(): Promise<Organization> {
    try {
      console.log('Fetching organization data...');
      const response = await api.get('/organization');
      console.log('Organization data fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch organization:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Organization not found. Please contact your administrator.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view organization details.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error occurred while fetching organization. Please try again later.');
      }
      
      throw new Error('Failed to fetch organization details. Please check your connection and try again.');
    }
  },

  async updateOrganization(data: UpdateOrganizationDTO): Promise<Organization> {
    try {
      console.log('Updating organization with data:', data);
      
      // Validate required fields
      if (data.orga_code && data.orga_code.trim().length < 2) {
        throw new Error('Organization code must be at least 2 characters');
      }
      
      if (data.orga_desc && data.orga_desc.trim().length < 10) {
        throw new Error('Organization description must be at least 10 characters');
      }
      
      if (data.name && data.name.trim().length < 2) {
        throw new Error('Organization name must be at least 2 characters');
      }
      
      // Validate email format if provided
      if (data.email && data.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          throw new Error('Please enter a valid email address');
        }
      }
      
      // Validate phone format if provided
      if (data.phone && data.phone.trim() && data.phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }
      
      // Validate website URL if provided
      if (data.website && data.website.trim()) {
        try {
          new URL(data.website);
        } catch {
          throw new Error('Please enter a valid website URL');
        }
      }
      
      // Validate logo URL if provided
      if (data.logo && data.logo.trim()) {
        try {
          new URL(data.logo);
        } catch {
          throw new Error('Please enter a valid logo URL');
        }
      }
      
      // Clean the data - remove undefined/null/empty values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => 
          value !== undefined && 
          value !== null && 
          (typeof value === 'string' ? value.trim() !== '' : true)
        )
      );
      
      console.log('Sending cleaned organization data to API:', cleanData);
      
      const response = await api.put('/organization', cleanData);
      console.log('Organization updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update organization:', error);
      
      if (error instanceof Error) {
        // If it's a validation error we threw, pass it through
        if (error.message.includes('must be') || error.message.includes('valid')) {
          throw error;
        }
      }
      
      // Handle API errors
      if (error.response?.status === 400) {
        const serverMessage = error.response?.data?.message || error.response?.data?.error;
        if (serverMessage) {
          throw new Error(`Validation error: ${serverMessage}`);
        }
        throw new Error('Invalid organization data provided. Please check all fields and try again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to update organization details.');
      } else if (error.response?.status === 404) {
        throw new Error('Organization not found. Please contact your administrator.');
      } else if (error.response?.status === 409) {
        throw new Error('Organization code already exists. Please choose a different code.');
      } else if (error.response?.status >= 500) {
        const serverMessage = error.response?.data?.message || error.response?.data?.error;
        throw new Error(`Server error: ${serverMessage || 'Please try again later.'}`);
      }
      
      throw new Error('Failed to update organization. Please check your connection and try again.');
    }
  },

  // Organization statistics and additional operations
  async getOrganizationStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalBranches: number;
    activeBranches: number;
    createdAt: string;
    lastUpdated: string;
  }> {
    try {
      console.log('Fetching organization statistics...');
      const response = await api.get('/organization/stats');
      console.log('Organization statistics fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch organization statistics:', error);
      throw new Error('Failed to fetch organization statistics.');
    }
  },

  async validateOrganizationCode(code: string): Promise<{ available: boolean; suggestions?: string[] }> {
    try {
      console.log('Validating organization code:', code);
      const response = await api.post('/organization/validate-code', { code });
      console.log('Organization code validation result:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to validate organization code:', error);
      throw new Error('Failed to validate organization code.');
    }
  },

  async uploadOrganizationLogo(file: File): Promise<{ url: string }> {
    try {
      console.log('Uploading organization logo...');
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await api.post('/organization/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Organization logo uploaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to upload organization logo:', error);
      throw new Error('Failed to upload organization logo. Please try again.');
    }
  },
};