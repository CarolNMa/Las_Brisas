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

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  tipoDocumento: string;
  documentNumber: string;
  birthdate: string;
  photoProfile?: string;
  gender: string;
  phone: string;
  email: string;
  civilStatus: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  userId: number;
}

interface Position {
  id: number;
  namePost: string;
  description: string;
  jobFunction: string;
  requirements: string;
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

  async getAreas(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/areas/all`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch areas');
    }

    return response.json();
  }

  async createArea(areaData: { name: string; description: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/areas/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(areaData),
    });

    if (!response.ok) {
      throw new Error('Failed to create area');
    }

    return response.json();
  }

  async deleteArea(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete area');
    }

    return response.json();
  }

  async getLocations(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/location/all`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    return response.json();
  }

  async createLocation(locationData: { nameLocation: string; address: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/location/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      throw new Error('Failed to create location');
    }

    return response.json();
  }

  async deleteLocation(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/location/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete location');
    }

    return response.json();
  }

  async getEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE_URL}/employees/all`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    return response.json();
  }

  async createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to create employee');
    }

    return response.json();
  }

  async updateEmployee(id: number, employeeData: Partial<Employee>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee');
    }

    return response.json();
  }

  async deleteEmployee(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete employee');
    }

    return response.json();
  }

  async getPositions(): Promise<Position[]> {
    const response = await fetch(`${API_BASE_URL}/positions/all`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch positions');
    }

    return response.json();
  }

  async createPosition(positionData: Omit<Position, 'id'>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/positions/`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(positionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create position');
    }

    return response.json();
  }

  async deletePosition(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete position');
    }

    return response.json();
  }

  // Note: Update not implemented in backend, would need PUT endpoint
  // async updateUser(id: number, userData: Partial<User>): Promise<any> {
  //   // Implement if backend adds PUT
  // }
}

export default new ApiService();
