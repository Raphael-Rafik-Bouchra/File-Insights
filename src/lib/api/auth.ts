import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const auth = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response?.data?.message || 'An error occurred during login');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  async getProfile(token: string) {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async updateProfile(token: string, name: string) {
    const response = await axios.patch(`${API_URL}/auth/profile`, 
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  async updatePassword(token: string, data: { currentPassword: string; newPassword: string }) {
    const response = await axios.patch(`${API_URL}/auth/password`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};
