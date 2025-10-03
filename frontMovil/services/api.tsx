import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8085/api/v1'; // Adjust if needed

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  email: string;
  username: string;
  roles: string[];
}

interface User {
  idUser: number;
  username: string;
  email: string;
  password?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  resetCode?: string;
  resetCodeExpire?: number;
  roles?: { id: number; name: string; description: string }[];
}

interface Role {
  id: number;
  name: string;
  description: string;
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

class ApiService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data: LoginResponse = await response.json();
    await AsyncStorage.setItem('jwt_token', data.token);
    return data;
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/user/all`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${API_BASE_URL}/role/all`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }

    return response.json();
  }

  async createUser(userData: CreateUserRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/user/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return response.json();
  }

  async deleteUser(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return response.json();
  }

  async createRole(roleData: { name: string; description: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/role/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      throw new Error('Failed to create role');
    }

    return response.json();
  }

  async deleteRole(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/role/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete role');
    }

    return response.json();
  }

  // Note: Update not implemented in backend, would need PUT endpoint
  // async updateUser(id: number, userData: Partial<User>): Promise<any> {
  //   // Implement if backend adds PUT
  // }
}

export default new ApiService();
