// src/services/medicalHistoryService.ts
import api from './api';

export interface MedicalHistory {
  id: number;
  patient_id: number;
  doctor_id: number;
  diagnosis_id: number;
  date: string;
  notes: string;
  created_on: string;
  diagnosis_name?: string;
  doctor_name?: string;
}

export interface MedicalHistoryCreation {
  patient_id: number;
  doctor_id: number;
  diagnosis_id: number;
  date: string;
  notes: string;
}

// Get all medical history records
export const getAllMedicalHistory = () => {
  return api.get<MedicalHistory[]>('/medical-history');
};

// Get medical history for a patient
export const getPatientMedicalHistory = (patientId: number) => {
  return api.get<MedicalHistory[]>(`/medical-history/patient/${patientId}`);
};

// Get medical history records created by a doctor
export const getDoctorMedicalHistory = (doctorId: number) => {
  return api.get<MedicalHistory[]>(`/medical-history/doctor/${doctorId}`);
};

// Create a new medical history record
export const createMedicalHistory = (data: MedicalHistoryCreation) => {
  return api.post<MedicalHistory>('/medical-history', data);
};

// Update a medical history record
export const updateMedicalHistory = (id: number, data: Partial<MedicalHistoryCreation>) => {
  return api.put<MedicalHistory>(`/medical-history/${id}`, data);
};

// Delete a medical history record
export const deleteMedicalHistory = (id: number) => {
  return api.delete(`/medical-history/${id}`);
};