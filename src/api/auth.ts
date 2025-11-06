import { apiClient } from './client';
import { AuthResponse, User } from '../types';
import { storage } from '../utils/storage';

export const authAPI = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/collections/musers/auth-with-password', {
        identity: email,
        password,
      });
      
      if (response.token && response.record) {
        storage.setToken(response.token);
        storage.setUser(response.record);
      }
      
      return response;
    } catch (error: any) {
      // Lấy message lỗi từ error object
      const errorMessage = error.message || 'Đăng nhập thất bại';
      throw new Error(errorMessage);
    }
  },

  async register(email: string, password: string): Promise<User> {
    const response = await apiClient.post('/api/collections/musers/records', {
      email,
      password,
      passwordConfirm: password,
    });
    
    return response;
  },

  logout() {
    storage.clear();
  },

  getCurrentUser(): User | null {
    return storage.getUser();
  },

  getToken(): string | null {
    return storage.getToken();
  },

  isAuthenticated(): boolean {
    return !!storage.getToken();
  },
};