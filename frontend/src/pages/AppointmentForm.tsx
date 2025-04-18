// src/pages/AppointmentForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { createAppointment, AppointmentCreation } from '../services/appointmentService';
import { getAllDoctors, Doctor } from '../services/doctorService';
import { getDoctorSchedule, Schedule } from '../services/scheduleService';

interface FormData {
  doctor_id: string;
  schedule_id: string; // Changed from date to schedule_id
  date: string;        // This will be calculated based on schedule
  start_time: string;
  end_time: string;
}

const AppointmentForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [availableTimes, setAvailableTimes] = useState<{start: string, end: string}[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedDoctorId = watch('doctor_id');
  const selectedScheduleId = watch('schedule_id');
  
  const daysOfWeek: Record<string, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };
  
  // Parse query params for pre-selected doctor
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const doctorId = searchParams.get('doctorId');
    if (doctorId) {
      setValue('doctor_id', doctorId);
    }
  }, [location.search, setValue]);
  
  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoadingDoctors(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  // Fetch doctor schedules when doctor changes
  useEffect(() => {
    if (!selectedDoctorId) {
      setSchedules([]);
      setAvailableTimes([]);
      return;
    }
    
    const fetchSchedules = async () => {
      setLoadingSchedules(true);
      try {
        const response = await getDoctorSchedule(Number(selectedDoctorId));
        setSchedules(response.data);
      } catch (err) {
        setError('Failed to load doctor schedules. Please try again later.');
      } finally {
        setLoadingSchedules(false);
      }
    };
    
    fetchSchedules();
  }, [selectedDoctorId]);
  
  // Generate available times when schedule changes
  useEffect(() => {
    if (!selectedScheduleId || schedules.length === 0) {
      setAvailableTimes([]);
      return;
    }
    
    const schedule = schedules.find(s => s.id === Number(selectedScheduleId));
    if (!schedule) {
      setAvailableTimes([]);
      return;
    }
    
    // Calculate next date for the selected day of week
    const today = new Date();
    const dayMapping: Record<string, number> = {
      'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
    };
    const targetDay = dayMapping[schedule.day_of_week];
    const currentDay = today.getDay();
    
    // Calculate days to add to get to the next occurrence of the target day
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Move to next week if target day is today or earlier
    }
    
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + daysToAdd);
    
    // Format the date for the appointment
    const formattedDate = appointmentDate.toISOString().split('T')[0];
    setValue('date', formattedDate);
    
    // Generate time slots in 30-minute intervals
    const slots: {start: string, end: string}[] = [];
    let currentTime = new Date(`${formattedDate}T${schedule.start_time}`);
    const endTime = new Date(`${formattedDate}T${schedule.end_time}`);
    const breakStart = schedule.break_start ? new Date(`${formattedDate}T${schedule.break_start}`) : null;
    const breakEnd = schedule.break_end ? new Date(`${formattedDate}T${schedule.break_end}`) : null;
    
    while (currentTime < endTime) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime.getTime() + 30 * 60000); // 30 minutes later
      
      // Skip slots during break time
      if (
        !(breakStart && breakEnd && slotStart >= breakStart && slotStart < breakEnd)
        && slotEnd <= endTime
      ) {
        slots.push({
          start: slotStart.toTimeString().substring(0, 5),
          end: slotEnd.toTimeString().substring(0, 5)
        });
      }
      
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    
    setAvailableTimes(slots);
  }, [selectedScheduleId, schedules, setValue]);
  
  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('You must be logged in to book an appointment');
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const appointmentData: AppointmentCreation = {
        patient_id: user.id,
        doctor_id: Number(data.doctor_id),
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        status: 'scheduled'
      };
      
      await createAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loadingDoctors) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
  // bg-accent-beige
  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-accent-deepPlum rounded-xl shadow-lg overflow-hidden border-l-4 border-primary-oceanTeal">
        <div className="px-6 py-8 sm:p-8">
          <h2 className="text-2xl font-bold text-accent-beige mb-8">Book an Appointment</h2>
          <h2 className="text-2xl font-semibold text-accent-beige mb-8">Book an Appointment</h2>

          
          {error &&<ErrorAlert 
    message={error}
    onDismiss={() => setError('')}
    className="mb-4"
  />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label htmlFor="doctor_id" className="block text-sm font-medium text-accent-beige mb-2">
                Select Doctor
              </label>
              <select
                id="doctor_id"
                className={`w-full px-4 py-3 bg-accent-deepPlum border ${
                  errors.doctor_id ? 'border-accent-warmBrick' : 'border-primary-sageGreen/30'
                } rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray`}
                {...register('doctor_id', { required: 'Doctor is required' })}
              >
                <option value="">Choose a doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id} className="text-accent-beige">
                    Dr. {doctor.name} ({doctor.specialization})
                  </option>
                ))}
              </select>
              {errors.doctor_id && (
                <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.doctor_id.message}
                </p>
              )}
            </div>

            {selectedDoctorId && loadingSchedules && (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            )}

            {selectedDoctorId && !loadingSchedules && schedules.length === 0 && (
              <div className="bg-primary-oceanTeal border-l-4 border-accent-warmBrick p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-accent-warmBrick" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-accent-beige">
                    This doctor has no available schedules. Please select another doctor.
                  </p>
                </div>
              </div>
            )}

{selectedDoctorId && !loadingSchedules && schedules.length > 0 && (
              <div>
                <label htmlFor="schedule_id" className="block text-sm font-medium text-accent-beige mb-2">
                  Available Days
                </label>
                <select
                  id="schedule_id"
                  className={`w-full px-4 py-3 bg-accent-deepPlum/10 border  ${
                    errors.schedule_id ? 'border-accent-warmBrick' : 'border-primary-sageGreen/30'
                  } rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray`}
                  {...register('schedule_id', { required: 'Schedule is required' })}
                >
                  <option value="">Select a day</option>
                  {schedules.map(schedule => (
                    <option key={schedule.id} value={schedule.id} className="bg-accent-deepPlum/10">
                      {daysOfWeek[schedule.day_of_week]} (
                      {new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(`2000-01-01T${schedule.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </option>
                  ))}
                </select>
                {errors.schedule_id && (
  <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    {errors.schedule_id.message}
  </p>
)}
                
                {selectedScheduleId && (
                  <div className="mt-4 bg-primary-oceanTeal p-4 rounded-lg">
                    <p className="text-sm text-accent-beige">
                      Your appointment will be scheduled for the next{' '}
                      <span className="font-semibold text-primary-sageGreen">
                        {daysOfWeek[schedules.find(s => s.id === Number(selectedScheduleId))?.day_of_week || 'mon']}
                      </span>: {' '}
                      <span className="text-neutral-lightGray">{watch('date')}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedScheduleId && availableTimes.length > 0 && (
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-accent-beige mb-2">
                  Select Time Slot
                </label>
                <select
                  id="start_time"
                  className={`w-full px-4 py-3 bg-primary-oceanTeal border ${
                    errors.start_time ? 'border-accent-warmBrick' : 'border-primary-sageGreen/30'
                  } rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray`}
                  {...register('start_time', { required: 'Time slot is required' })}
                  onChange={(e) => {
                    const selectedIndex = e.target.selectedIndex - 1;
                    if (selectedIndex >= 0 && availableTimes[selectedIndex]) {
                      setValue('end_time', availableTimes[selectedIndex].end);
                    }
                  }}
                >
                  <option value="">Choose a time slot</option>
                  {availableTimes.map((slot, index) => (
                    <option key={index} value={slot.start} className="text-neutral-lightGray">
                      {new Date(`2000-01-01T${slot.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(`2000-01-01T${slot.end}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </option>
                  ))}
                </select>
                <input type="hidden" {...register('end_time')} />
                <input type="hidden" {...register('date')} />
                {errors.schedule_id && (
  <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
    {errors.schedule_id.message}
  </p>
)}
              </div>
            )}

<div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border-2 border-accent-warmBrick text-accent-warmBrick rounded-lg hover:bg-accent-warmBrick/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || availableTimes.length === 0 || !selectedScheduleId}
                className="px-6 py-2 bg-primary-oceanTeal text-accent-beige rounded-lg hover:bg-primary-sageGreen transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    Booking...
                  </div>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentForm;