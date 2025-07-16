import { ApiInfo } from '@/@types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://testnode.propelapps.com/EBS';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Generic API request function
const apiRequest = async (endpoint: string, method: string, data?: any, requiresAuth = true) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed');
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await apiRequest('/20D/login', 'POST', {
      username,
      password,
      isSSO: 'N'
    }, false);
    
    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user || { username }));
    }
    
    return response;
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  isAuthenticated: async () => {
    const token = await getAuthToken();
    return !!token;
  }
};

// Expense API
export const expenseAPI = {
  createExpenseReport: async (reportData: any, operation: 'save' | 'create') => {
    return apiRequest('/23B/createExpenseReport', 'POST', {
      ...reportData,
      operation
    });
  },
  
  getExpenseReports: async () => {
    return apiRequest('/23B/getExpenseReports', 'GET');
  },
  
  getExpenseReportDetails: async (reportId: string) => {
    return apiRequest(`/23B/getExpenseReportDetails/${reportId}`, 'GET');
  }
};




export async function fetchApi(apiInfo: ApiInfo): Promise<any> {
  try {
    const response = await fetch(apiInfo.endpoint);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${apiInfo.name}:`, error);
    throw error;
  }
}

// Mock implementation for development/testing
export async function mockFetchApi(apiInfo: ApiInfo): Promise<any> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Randomly succeed or fail (80% success rate)
      const shouldSucceed = Math.random() < 0.8;
      
      if (shouldSucceed) {
        resolve({ success: true, data: { message: `Mock data for ${apiInfo.name}` } });
      } else {
        reject(new Error(`Failed to fetch ${apiInfo.name}: Server error 500`));
      }
    }, 1500); // 1.5 second delay
  });
}