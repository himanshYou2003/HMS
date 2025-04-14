// src/services/doctorService.ts
import api from './api';

export interface Doctor {
  id: number;
  email: string;
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'other';
  is_enable: boolean;
  registered_on: string;
}

export interface DoctorRegistration {
  email: string;
  password: string;
  name: string;
  specialization: string;
  gender: 'male' | 'female' | 'other';
}

export interface DoctorLogin {
  email: string;
  password: string;
}

export const loginDoctor = async (credentials: DoctorLogin) => {
  return api.post<Doctor>('/doctors/login', credentials);
};

export const registerDoctor = async (data: DoctorRegistration) => {
  try {
    const response = await api.post<{ message: string, id: number }>('/doctors/register', data);
    return response;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('An account already exists with this email');
    }
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Other doctor service functions
export const getAllDoctors = () => api.get<Doctor[]>('/doctors');
export const getDoctorById = (id: number) => api.get<Doctor>(`/doctors/${id}`);
export const updateDoctor = (id: number, data: Partial<Doctor>) => api.put<Doctor>(`/doctors/${id}`, data);
export const deleteDoctor = (id: number) => api.delete(`/doctors/${id}`);