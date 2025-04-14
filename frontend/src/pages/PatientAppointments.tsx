import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import AppointmentCard from '../components/AppointmentCard';
import { useAuth } from '../context/AuthContext';
import { getPatientAppointments, Appointment } from '../services/appointmentService';
import { getAllDoctors, Doctor } from '../services/doctorService';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!user) return;

      const appointmentsResponse = await getPatientAppointments(user.id);
      setAppointments(appointmentsResponse.data);

      const doctorsResponse = await getAllDoctors();
      setDoctors(doctorsResponse.data);
    } catch (err) {
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const getDoctorById = (doctorId: number) => {
    return doctors.find((doctor) => doctor.id === doctorId);
  };

  const renderAppointmentsByDate = (date: string) => {
    const filteredAppointments = appointments.filter(
      (appointment) => appointment.date === date && appointment.status === 'scheduled'
    );

    if (filteredAppointments.length === 0) return null;

    return (
      <div key={date} className="mb-6">
        <h3 className="text-lg font-medium text-accent-beige mb-3">
          {new Date(date).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h3>
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const doctor = getDoctorById(appointment.doctor_id);
            return (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                doctorInfo={doctor ? {
                  name: doctor.name,
                  specialization: doctor.specialization,
                  email: doctor.email
                } : undefined}
                onStatusChange={fetchData}
                userType="patient"
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderPastAppointments = () => {
    const pastAppointments = appointments.filter(
      (appointment) => appointment.status === 'completed' || appointment.status === 'canceled'
    );

    if (pastAppointments.length === 0) {
      return <p className="text-sm text-neutral-lightGray">No past appointments.</p>;
    }

    return (
      <div className="space-y-4">
        {pastAppointments.map((appointment) => {
          const doctor = getDoctorById(appointment.doctor_id);
          return (
            <div key={appointment.id} className="bg-neutral-offBlack/80 rounded-xl shadow-lg border-primary-sageGreen/90 border-2">
              <AppointmentCard
                appointment={appointment}
                doctorInfo={doctor ? {
                  name: doctor.name,
                  specialization: doctor.specialization,
                  email: doctor.email
                } : undefined}
                onStatusChange={fetchData}
                userType="patient"
              />
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const upcomingDates = [...new Set(
    appointments
      .filter((appointment) => appointment.status === 'scheduled')
      .map((appointment) => appointment.date)
  )].sort();

  return (
    <Layout>
      <div className="bg-neutral-offBlack rounded-xl shadow-lg border-l-4 border-primary-sageGreen mb-6">
        <div className="px-6 py-8 sm:p-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-accent-beige">My Appointments</h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-lightGray">
              View and manage your appointments
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              to="/medical-history"
              className="inline-flex items-center px-4 py-2 border border-accent-deepPlum text-sm font-medium rounded-md text-accent-beige bg-transparent hover:bg-accent-deepPlum/30"
            >
              Medical History
            </Link>
            <Link
              to="/appointments/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-deepPlum hover:bg-accent-deepPlum/70"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <ErrorAlert 
        message={error}
        onDismiss={() => setError('')}
        className="mb-4"
      />
      ) : appointments.length === 0 ? (
        <div className="bg-neutral-offBlack rounded-xl shadow-lg border-l-4 border-primary-sageGreen">
          <div className="px-6 py-8 sm:p-8 text-center">
            <h3 className="text-lg font-medium text-accent-beige">No appointments found</h3>
            <div className="mt-2 text-sm text-neutral-lightGray mx-auto">
              <p>You don't have any appointments scheduled.</p>
            </div>
            <div className="mt-5">
              <Link
                to="/appointments/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-oceanTeal hover:bg-primary-sageGreen"
              >
                Book Your First Appointment
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-neutral-offBlack rounded-xl shadow-lg border-l-4 border-primary-sageGreen">
            <div className="px-6 py-8 sm:p-8">
              <h2 className="text-lg font-medium text-accent-beige">Upcoming Appointments</h2>
            </div>
            <div className="border-t border-primary-sageGreen/30 px-6 py-8 sm:p-8">
              {upcomingDates.length === 0 ? (
                <p className="text-sm text-neutral-lightGray">No upcoming appointments.</p>
              ) : (
                upcomingDates.map((date) => renderAppointmentsByDate(date))
              )}
            </div>
          </div>

          <div className="bg-neutral-offBlack rounded-xl shadow-lg border-l-4 border-primary-sageGreen">
            <div className="px-6 py-8 sm:p-8">
              <h2 className="text-lg font-medium text-accent-beige">Past Appointments</h2>
            </div>
            <div className="border-t border-primary-sageGreen/30 px-6 py-8 sm:p-8">
              {renderPastAppointments()}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PatientAppointments;