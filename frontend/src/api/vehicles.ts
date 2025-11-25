import axios from 'axios';
import { Vehicle } from '../types';

const API_BASE_URL = 'http://localhost:3002';

export const vehicleAPI = {
  getAll: () => axios.get<Vehicle[]>(`${API_BASE_URL}/vehicles`),
  getById: (id: number) => axios.get<Vehicle>(`${API_BASE_URL}/vehicles/${id}`),
  getByUserId: (userId: number) => axios.get<Vehicle[]>(`${API_BASE_URL}/vehicles/user/${userId}`),
  create: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => axios.post<Vehicle>(`${API_BASE_URL}/vehicles`, vehicle),
  update: (id: number, vehicle: Partial<Vehicle>) => axios.put<Vehicle>(`${API_BASE_URL}/vehicles/${id}`, vehicle),
  delete: (id: number) => axios.delete<{ message: string }>(`${API_BASE_URL}/vehicles/${id}`)
};