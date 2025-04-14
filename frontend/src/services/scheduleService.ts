// src/services/scheduleService.ts
import api from './api';

// Define types
export interface Schedule {
  id: number;
  doctor_id: number;
  day_of_week: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  start_time: string;
  end_time: string;
  break_start: string | null;
  break_end: string | null;
  is_enable: 'true' | 'false';
  created_on: string;
}

export interface ScheduleCreation {
  doctor_id: number;
  day_of_week: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  start_time: string;
  end_time: string;
  break_start?: string | null;
  break_end?: string | null;
  is_enable?: 'true' | 'false';
}

// Get doctor's schedule
export const getDoctorSchedule = (doctorId: number) => {
  return api.get<Schedule[]>(`/schedule/doctor/${doctorId}`);
};

// Create new schedule
export const createSchedule = (data: ScheduleCreation) => {
  // Make sure all required fields are present and properly formatted
  const scheduleData = {
    doctor_id: data.doctor_id,
    day_of_week: data.day_of_week,
    start_time: data.start_time,
    end_time: data.end_time,
    break_start: data.break_start || null,
    break_end: data.break_end || null,
    is_enable: data.is_enable || 'true'
  };
  
  console.log('Creating schedule with data:', scheduleData);
  return api.post<Schedule>('/schedule', scheduleData);
};

// Update schedule
export const updateSchedule = (scheduleId: number, data: Partial<ScheduleCreation>) => {
  return api.put<Schedule>(`/schedule/${scheduleId}`, data);
};

// Delete schedule
export const deleteSchedule = (scheduleId: number) => {
  return api.delete(`/schedule/${scheduleId}`);
};