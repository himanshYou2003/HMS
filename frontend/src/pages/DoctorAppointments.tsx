// src/pages/DoctorAppointments.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import AppointmentCard from '../components/AppointmentCard';
import { useAuth } from '../context/AuthContext';
import { getDoctorAppointments, Appointment } from '../services/appointmentService';
import { getAllPatients, Patient } from '../services/patientService';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!user) return;
      
      // Fetch appointments
      const appointmentsResponse = await getDoctorAppointments(user.id);
      setAppointments(appointmentsResponse.data);
      
      // Fetch all patients
      try {
        const patientsResponse = await getAllPatients();
        setPatients(patientsResponse.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
      
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [user]);
  
  const getPatientById = (patientId: number) => {
    return patients.find(patient => patient.id === patientId);
  };
  
  const renderAppointmentsByDate = (date: string) => {
    const filteredAppointments = appointments.filter(
      appointment => appointment.date === date && appointment.status === 'scheduled'
    );
    
    if (filteredAppointments.length === 0) {
      return null;
    }
    
    return (
      <div key={date} className="mb-6">
        <h3 className="text-lg font-medium text-accent-beige mb-3">
          {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
        <div className="space-y-4">
          {filteredAppointments.map(appointment => {
            const patient = getPatientById(appointment.patient_id);
            return (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                patientInfo={patient ? {
                  name: patient.name,
                  email: patient.email,
                  gender: patient.gender,
                  phone: patient.phone
                } : { name: `Patient #${appointment.patient_id}` }}
                onStatusChange={fetchData}
                userType="doctor"
              />
            );
  })}
        </div>
      </div>
    );
  };
  
  const renderPastAppointments = () => {
    const pastAppointments = appointments.filter(
      appointment => appointment.status === 'completed' || appointment.status === 'canceled'
    );
    
    if (pastAppointments.length === 0) {
      return <p className="text-sm text-gray-500">No past appointments.</p>;
    }
    
    return (
      <div className="space-y-4">
        {pastAppointments.map(appointment => {
          const patient = getPatientById(appointment.patient_id);
          return (
            <div key={appointment.id} className="bg-neutral-offBlack/80 rounded-xl shadow-lg border-primary-sageGreen/90 border-2">
              <AppointmentCard
                appointment={appointment}
                patientInfo={patient ? {
                  name: patient.name,
                  email: patient.email,
                  gender: patient.gender,
                  phone: patient.phone
                } : { name: `Patient #${appointment.patient_id}` }}
                onStatusChange={fetchData}
                userType="doctor"
              />
              
              {/* Add Diagnosis Button for Completed Appointments */}
              {appointment.status === 'completed' && (
                <div className="px-4 py-3  text-right sm:px-6">
                  <Link
                    to={`/appointments/${appointment.id}/diagnose`}
                    className="inline-flex justify-center py-2  px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-accent-beige bg-primary-oceanTeal hover:bg-primary-sageGreen transition-colors"
                    
                  >
                    Add Diagnosis
                  </Link>
                </div>
              )}
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
  
  // Get unique upcoming dates
  const upcomingDates = [...new Set(
    appointments
      .filter(appointment => appointment.status === 'scheduled')
      .map(appointment => appointment.date)
  )].sort();
  
  return (
    <Layout>
      <div className="bg-neutral-offBlack rounded-xl shadow-lg border-l-4 border-primary-oceanTeal mb-6">
        <div className="px-6 py-8 sm:p-8">
          <h1 className="text-2xl font-bold text-accent-beige">Doctor Appointments</h1>
          <p className="mt-2 text-sm text-neutral-lightGray">
            View and manage your patient appointments
          </p>
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
                upcomingDates.map(date => renderAppointmentsByDate(date))
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

export default DoctorAppointments;