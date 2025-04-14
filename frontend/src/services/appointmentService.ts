// src/services/appointmentService.ts
import api from './api';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_on: string;
}

export interface AppointmentCreation {
  patient_id: number;
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

// Create a new appointment
export const createAppointment = (data: AppointmentCreation) => {
  return api.post<Appointment>('/appointments', data);
};

// Get all appointments
export const getAllAppointments = () => {
  return api.get<Appointment[]>('/appointments');
};

// Get appointments for a patient
export const getPatientAppointments = (patientId: number) => {
  return api.get<Appointment[]>(`/appointments/patient/${patientId}`);
};

// Get appointments for a doctor
export const getDoctorAppointments = (doctorId: number) => {
  return api.get<Appointment[]>(`/appointments/doctor/${doctorId}`);
};

// Update appointment status
export const updateAppointmentStatus = (appointmentId: number, status: string) => {
  return api.put<Appointment>(`/appointments/${appointmentId}/status`, { status });
};

export const getAppointmentById = (id: number) => {
  return api.get<Appointment>(`/appointments/${id}`);
};