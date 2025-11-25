export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number | null;
  userId: number;
  createdAt: string;
}