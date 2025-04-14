import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ScheduleForm from '../components/ScheduleForm';
import { useAuth } from '../context/AuthContext';
import { getDoctorSchedule, Schedule } from '../services/scheduleService';

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const daysOfWeek: Record<string, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  const fetchSchedules = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await getDoctorSchedule(user.id);
      setSchedules(response.data);
    } catch (err) {
      setError('Failed to load schedules. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user]);

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchSchedules();
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-neutral-offBlack rounded-xl shadow-md mb-6 border border-primary-sageGreen/30">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-accent-beige">My Schedule</h1>
            <p className="mt-1 text-sm text-accent-beige/70">
              Manage your availability for appointments
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-accent-beige bg-primary-oceanTeal hover:bg-primary-sageGreen transition"
          >
            {showForm ? 'Cancel' : 'Add Schedule'}
          </button>
        </div>
      </div>

      {error && <ErrorAlert 
    message={error}
    onDismiss={() => setError('')}
    className="mb-4"
  />}

      {showForm && user && (
        <div className="mb-6">
          <ScheduleForm doctorId={user.id} onSuccess={handleFormSuccess} />
        </div>
      )}

      <div className="bg-neutral-offBlack rounded-xl shadow-md border border-neutral-offBlack">
      {/* <div className="bg-neutral-offBlack rounded-xl shadow-md border border-primary-sageGreen/30"> */}
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-semibold text-accent-beige">Current Schedule</h2>
        </div>

        {schedules.length === 0 ? (
          <div className="border-t border-primary-sageGreen/20 px-4 py-5 sm:p-6">
            <p className="text-sm text-accent-beige/70">
              No schedule available. Add your availability using the button above.
            </p>
          </div>
        ) : (
          <div className="border-t border-primary-sageGreen/20">
            <ul className="divide-y divide-primary-sageGreen/20">
              {schedules.map(schedule => (
                <li key={schedule.id} className="px-4 py-4 sm:px-6 text-accent-beige">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">
                        {daysOfWeek[schedule.day_of_week]}
                      </h3>
                      <p className="text-sm text-accent-beige/70">
                        {new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(`2000-01-01T${schedule.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {schedule.break_start && schedule.break_end && (
                        <p className="text-sm text-accent-beige/60">
                          Break: {new Date(`2000-01-01T${schedule.break_start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {new Date(`2000-01-01T${schedule.break_end}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    {/* Future enhancement: Edit/Delete buttons */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DoctorSchedule;
