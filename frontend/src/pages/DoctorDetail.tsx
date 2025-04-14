// src/pages/DoctorDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { getDoctorById, Doctor } from '../services/doctorService';
import { getDoctorSchedule, Schedule } from '../services/scheduleService';
import { useAuth } from '../context/AuthContext';

const DoctorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const daysOfWeek: Record<string, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      setIsLoading(true);
      try {
        if (!id) return;

        const doctorResponse = await getDoctorById(Number(id));
        setDoctor(doctorResponse.data);

        const scheduleResponse = await getDoctorSchedule(Number(id));
        setSchedules(scheduleResponse.data);
      } catch (err) {
        setError('Failed to load doctor information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (user?.type !== 'patient') {
      toast.error('Only patients can book appointments');
      return;
    }

    navigate(`/appointments/new?doctorId=${id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout>
        <ErrorAlert 
    message={error || 'Doctor not found'}
    onDismiss={() => setError('')}
    className="mb-4"
  />
        <div className="mt-4">
          <Link
            to="/doctors"
            className="text-neutral-offBlack hover:text-accent-beige transition-colors"
          >
            &larr; Back to doctors list
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-neutral-offBlack rounded-xl shadow-lg border-l-4 border-primary-oceanTeal mb-6">
        <div className="px-6 py-8 sm:p-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-accent-beige">
              Dr. {doctor.name}
            </h1>
            <p className="mt-2 text-sm text-primary-sageGreen">
              {doctor.specialization}
            </p>
          </div>
          <button
            onClick={handleBookAppointment}
            className="px-6 py-2 bg-accent-deepPlum text-accent-beige rounded-lg hover:bg-accent-deepPlum/70 transition-colors"
          >
            Book Appointment
          </button>
        </div>
        <div className="border-t border-primary-sageGreen/30">
          <dl className="divide-y divide-primary-sageGreen/20">
            <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
              <dt className="text-sm font-medium text-accent-beige">Email</dt>
              <dd className="mt-1 text-sm text-neutral-lightGray sm:mt-0 sm:col-span-2">
                {doctor.email}
              </dd>
            </div>
            <div className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
              <dt className="text-sm font-medium text-accent-beige">Gender</dt>
              <dd className="mt-1 text-sm text-neutral-lightGray sm:mt-0 sm:col-span-2">
                {doctor.gender.charAt(0).toUpperCase() + doctor.gender.slice(1)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-neutral-offBlack rounded-xl shadow-lg border-l-4 border-primary-sageGreen">
        <div className="px-6 py-8 sm:p-8">
          <h2 className="text-lg font-semibold text-accent-beige">
            Available Schedule
          </h2>
          <p className="mt-2 text-sm text-primary-oceanTeal">
            Doctor's weekly availability
          </p>
        </div>

        {schedules.length === 0 ? (
          <div className="px-6 py-8 sm:p-8">
            <p className="text-sm text-neutral-lightGray">
              No schedule available for this doctor.
            </p>
          </div>
        ) : (
          <div className="border-t border-primary-sageGreen/30 px-6 py-8 sm:p-8 space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-primary-oceanTeal/10 rounded-xl p-6 shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <span className="text-sm font-medium text-accent-beige w-32">
                    {daysOfWeek[schedule.day_of_week]}
                  </span>
                  <span className="text-sm text-neutral-lightGray">
                    {new Date(`2000-01-01T${schedule.start_time}`).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(`2000-01-01T${schedule.end_time}`).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {schedule.break_start && schedule.break_end && (
                      <span className="ml-3 text-primary-sageGreen">
                        (Break:{' '}
                        {new Date(`2000-01-01T${schedule.break_start}`).toLocaleTimeString(
                          [],
                          { hour: '2-digit', minute: '2-digit' }
                        )}{' '}
                        -{' '}
                        {new Date(`2000-01-01T${schedule.break_end}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        )
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          to="/doctors"
          className="text-neutral-offBlack hover:text-accent-beige transition-colors"
        >
          &larr; Back to doctors list
        </Link>
      </div>
    </Layout>
  );
};

export default DoctorDetail;
