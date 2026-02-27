import axios from 'axios';
import { User } from '../types';

const API_BASE_URL = 'http://localhost:3001';

export const userAPI = {
  getAll: (): User[] => { 
    return axios.get(`${API_BASE_URL}/users`);
  },
  getById: (id: number) => axios.get<User>(`${API_BASE_URL}/users/${id}`),
  create: (user: Omit<User, 'id' | 'createdAt'>) => axios.post(`${API_BASE_URL}/users`, user),
  update: (id: number, user: Partial<User>) => axios.put(`${API_BASE_URL}/users/${id}`, user),
  delete: (id: number) => axios.delete(`${API_BASE_URL}/users/${id}`),
};