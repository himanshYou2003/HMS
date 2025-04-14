// // src/services/diagnosisService.ts
// import api from './api';

// export interface Diagnosis {
//   id: number;
//   appointment_id: number;
//   doctor_id: number;
//   diagnosis: string;
//   prescription: string;
//   notes?: string;
//   created_on: string;
// }

// export interface DiagnosisCreation {
//   appointment_id: number;
//   doctor_id: number;
//   diagnosis: string;
//   prescription: string;
//   notes?: string;
// }

// export const createDiagnosis = (data: DiagnosisCreation) => {
//   return api.post<Diagnosis>('/diagnosis', data);
// };

// export const getDiagnosisByAppointment = (appointmentId: number) => {
//   return api.get<Diagnosis[]>(`/diagnosis/appointments/${appointmentId}`);
// };


// // Get all diagnoses
// export const getAllDiagnoses = () => {
//   return api.get<Diagnosis[]>('/diagnosis');
// };

// // Get diagnosis by ID
// export const getDiagnosisById = (id: number) => {
//   return api.get<Diagnosis>(`/diagnosis/${id}`);
// };

// src/services/diagnosisService.ts
// src/services/diagnosisService.ts
import api from './api';

export interface Diagnosis {
  id: number;
  name: string;
  description: string;
}

export interface DiagnosisRecord {
  id: number;
  appointment_id: number;
  doctor_id: number;
  diagnosis: string;
  prescription: string;
  notes?: string;
  created_on: string;
}

export interface DiagnosisCreation {
  appointment_id: number;
  doctor_id: number;
  diagnosis: string;
  prescription: string;
  notes?: string;
}

// Create a new diagnosis record
export const createDiagnosis = (data: DiagnosisCreation) => {
  return api.post<DiagnosisRecord>('/diagnosis', data);
};

// Get diagnoses by appointment
export const getDiagnosisByAppointment = (appointmentId: number) => {
  return api.get<DiagnosisRecord[]>(`/diagnosis/appointments/${appointmentId}`);
};

// Get all diagnoses (standard diagnoses list)
export const getAllDiagnoses = () => {
  return api.get<Diagnosis[]>('/diagnosis/types');
};

// Get diagnosis by ID (standard diagnosis)
export const getDiagnosisById = (id: number) => {
  return api.get<Diagnosis>(`/diagnosis/types/${id}`);
};

// Get all diagnosis records
export const getAllDiagnosisRecords = () => {
  return api.get<DiagnosisRecord[]>('/diagnosis');
};

// Get diagnosis record by ID
export const getDiagnosisRecordById = (id: number) => {
  return api.get<DiagnosisRecord>(`/diagnosis/${id}`);
};

