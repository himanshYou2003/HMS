// src/services/patientService.ts
import api from './api';

export interface Patient {
  id: number;
  name: string;
  email: string;
  gender: string;
  street_address?: string;
  city_id?: number;
  state_id?: number;
  pin_code?: string;
  created_on?: string;
  phone?: string;
}

export interface PatientRegistration {
  name: string;
  email: string;
  password: string;
  gender: string;
  street_address: string;
  city_id: number;
  state_id: number;
  pin_code: string;
}

export interface PatientLogin {
  email: string;
  password: string;
}

export const loginPatient = async (credentials: PatientLogin) => {
  return api.post<Patient>('/patient/login', credentials);
};

export const registerPatient = async (data: PatientRegistration) => {
  try {
    const response = await api.post<{ message: string, id: number }>('/patient/register', data);
    return response;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('An account already exists with this email');
    }
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Other patient service functions
export const getAllPatients = () => api.get<Patient[]>('/patient');
export const getPatientById = (id: number) => api.get<Patient>(`/patient/id/${id}`);
export const getPatientByEmail = (email: string) => api.get<Patient>(`/patient/${email}`);
export const updatePatient = (id: number, data: Partial<Patient>) => api.put<Patient>(`/patient/id/${id}`, data);
export const deletePatient = (id: number) => api.delete(`/patient/id/${id}`);