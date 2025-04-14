// src/pages/PatientDiagnosisView.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { getDiagnosisByAppointment } from '../services/diagnosisService';
import { getAppointmentById } from '../services/appointmentService';
import { getDoctorById, Doctor } from '../services/doctorService';

interface Diagnosis {
  id: number;
  appointment_id: number;
  doctor_id: number;
  diagnosis: string;
  prescription: string;
  notes?: string;
  created_on: string;
}

interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_on: string;
}

const PatientDiagnosisView = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId || !user) {
        setError('Missing required information');
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch appointment details
        const appointmentResponse = await getAppointmentById(Number(appointmentId));
        setAppointment(appointmentResponse.data);
        
        // Verify this appointment belongs to the current patient
        if (appointmentResponse.data.patient_id !== user.id) {
          setError('You do not have permission to view this diagnosis');
          setIsLoading(false);
          return;
        }
        
        // Fetch doctor details
        try {
          const doctorResponse = await getDoctorById(appointmentResponse.data.doctor_id);
          setDoctor(doctorResponse.data);
        } catch (err) {
          console.error('Error fetching doctor:', err);
          // Don't block the whole flow if doctor details can't be fetched
        }
        
        // Fetch diagnoses for this appointment
        const diagnosisResponse = await getDiagnosisByAppointment(Number(appointmentId));
        setDiagnoses(diagnosisResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load diagnosis data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [appointmentId, user]);
  
  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Diagnosis Details</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {appointment && new Date(appointment.date).toLocaleDateString()}
            </p>
          </div>
          
          <Link
            to="/appointments"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Appointments
          </Link>
        </div>
      </div>
      
      {error ? (
        <ErrorAlert 
        message={error}
        onDismiss={() => setError('')}
        className="mb-4"
      />
      ) : (
        <>
          {/* Appointment Info */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Appointment Information</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment && new Date(appointment.date).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Time</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment && `${new Date(`2000-01-01T${appointment.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    ${new Date(`2000-01-01T${appointment.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {appointment && appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </dd>
                </div>
                {doctor && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Doctor</dt>
                      <dd className="mt-1 text-sm text-gray-900">{doctor.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                      <dd className="mt-1 text-sm text-gray-900">{doctor.specialization}</dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
          
          {/* Diagnoses */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Diagnosis</h2>
            </div>
            <div className="border-t border-gray-200">
              {diagnoses.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-sm text-gray-500">No diagnosis has been recorded for this appointment yet.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {diagnoses.map((diagnosis) => (
                    <li key={diagnosis.id} className="px-4 py-5 sm:p-6">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <dt className="text-sm font-medium text-gray-500">Diagnosis</dt>
                        <dd className="mt-1 text-sm text-gray-900">{diagnosis.diagnosis}</dd>
                        
                        <dt className="text-sm font-medium text-gray-500 mt-4">Prescription</dt>
                        <dd className="mt-1 text-sm text-gray-900">{diagnosis.prescription}</dd>
                        
                        {diagnosis.notes && (
                          <>
                            <dt className="text-sm font-medium text-gray-500 mt-4">Additional Notes</dt>
                            <dd className="mt-1 text-sm text-gray-900">{diagnosis.notes}</dd>
                          </>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-4">
                          {new Date(diagnosis.created_on).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default PatientDiagnosisView;