import axios from 'axios';
import { API_BASE_URL } from '@/config/env';

/**
 * Axios instance configured for API requests
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Response Types
 */
export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    createdAt: string;
  };
}

export interface ErrorResponse {
  statusCode?: number;
  message: string | string[];
  error?: string;
}

export interface UserListItem {
  id: number;
  email: string;
  createdAt: string;
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data: UserListItem[];
}

/**
 * Register a new user
 * @param data - User registration data (email and password)
 * @returns Promise with user response data
 */
export async function registerUser(data: { email: string; password: string }): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/user/register', data);
  return response.data;
}

/**
 * Login user
 */
export async function loginUser(data: { email: string; password: string }): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/user/login', data);
  return response.data;
}

/**
 * Fetch list of users
 */
export async function getUsers(): Promise<UsersListResponse> {
  const response = await apiClient.get<UsersListResponse>('/user');
  return response.data;
}

