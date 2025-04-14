import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSchedule, ScheduleCreation } from '../services/scheduleService';
import ErrorAlert from './ErrorAlert';

interface ScheduleFormProps {
  doctorId: number;
  onSuccess: () => void;
}

interface FormData {
  day_of_week: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  start_time: string;
  end_time: string;
  break_start: string;
  break_end: string;
}

const ScheduleForm = ({ doctorId, onSuccess }: ScheduleFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const daysOfWeek = [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
    { value: 'thu', label: 'Thursday' },
    { value: 'fri', label: 'Friday' },
    { value: 'sat', label: 'Saturday' },
    { value: 'sun', label: 'Sunday' },
  ];

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      const formatTime = (time: string) => time.split(':').length === 2 ? `${time}:00` : time;

      const scheduleData: ScheduleCreation = {
        doctor_id: doctorId,
        day_of_week: data.day_of_week,
        start_time: formatTime(data.start_time),
        end_time: formatTime(data.end_time),
        break_start: data.break_start ? formatTime(data.break_start) : null,
        break_end: data.break_end ? formatTime(data.break_end) : null,
        is_enable: 'true',
      };

      await createSchedule(scheduleData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-accent-beige/50 border-l-4 border-primary-oceanTeal  rounded-2xl shadow-xl p-8 text-neutral-offBlack">
      <h2 className="text-2xl font-bold text-primary-oceanTeal mb-8">Add Doctor Schedule</h2>

      {error && <ErrorAlert message={error} className="mb-6" />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Day of Week */}
        <div>
          <label htmlFor="day_of_week" className="block text-sm font-medium text-accent-deepPlum">
            Day of Week
          </label>
          <select
            id="day_of_week"
            className={`mt-1 block w-full py-2 px-4 bg-white/10 backdrop-blur-sm border ${
              errors.day_of_week ? 'border-accent-warmBrick' : 'border-primary-oceanTeal/40'
            } rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen text-neutral-offBlack`}
            {...register('day_of_week', { required: 'Day of week is required' })}
          >
            <option value="">Select a day</option>
            {daysOfWeek.map(day => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          {errors.day_of_week && (
            <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
              ⚠️ {errors.day_of_week.message}
            </p>
          )}
        </div>

        {/* Work Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Time */}
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-accent-deepPlum">
              Start Time
            </label>
            <input
              type="time"
              id="start_time"
              className={`mt-1 block w-full py-2 px-4 bg-white/10 backdrop-blur-sm border ${
                errors.start_time ? 'border-accent-warmBrick' : 'border-primary-oceanTeal/40'
              } rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen text-neutral-offBlack`}
              {...register('start_time', { required: 'Start time is required' })}
            />
            {errors.start_time && (
              <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
                ⏰ {errors.start_time.message}
              </p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-accent-deepPlum">
              End Time
            </label>
            <input
              type="time"
              id="end_time"
              className={`mt-1 block w-full py-2 px-4 bg-white/10 backdrop-blur-sm border ${
                errors.end_time ? 'border-accent-warmBrick' : 'border-primary-oceanTeal/40'
              } rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen text-neutral-offBlack`}
              {...register('end_time', { required: 'End time is required' })}
            />
            {errors.end_time && (
              <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
                ⏰ {errors.end_time.message}
              </p>
            )}
          </div>
        </div>

        {/* Break Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="break_start" className="block text-sm font-medium text-accent-deepPlum">
              Break Start (Optional)
            </label>
            <input
              type="time"
              id="break_start"
              className="mt-1 block w-full py-2 px-4 bg-white/10 backdrop-blur-sm border border-primary-oceanTeal/20 rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen text-neutral-offBlack"
              {...register('break_start')}
            />
          </div>

          <div>
            <label htmlFor="break_end" className="block text-sm font-medium text-accent-deepPlum">
              Break End (Optional)
            </label>
            <input
              type="time"
              id="break_end"
              className="mt-1 block w-full py-2 px-4 bg-white/10 backdrop-blur-sm border border-primary-oceanTeal/20 rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen text-neutral-offBlack"
              {...register('break_end')}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-primary-oceanTeal text-white font-medium rounded-lg hover:bg-primary-sageGreen transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">↻</span> Saving...
              </span>
            ) : (
              'Save Schedule'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
