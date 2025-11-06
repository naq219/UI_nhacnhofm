import { storage } from '../utils/storage';

const API_BASE_URL = 'https://s1.vq.id.vn/p8090';

interface RequestOptions extends RequestInit {
  body?: any;
}

export const apiClient = {
  async request(endpoint: string, options: RequestOptions = {}) {
    const token = storage.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Log request details
    console.log('📤 API Request:', {
      url: `${API_BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      timestamp: new Date().toISOString(),
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (response.status === 401) {
      storage.clear();
      window.location.href = '/login';
    }

    const data = await response.json();

    // Log response details
    console.log('📥 API Response:', {
      url: `${API_BASE_URL}${endpoint}`,
      status: response.status,
      statusText: response.statusText,
      data: data,
      timestamp: new Date().toISOString(),
    });

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return data;
  },

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint: string, body: any) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint: string, body: any) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};