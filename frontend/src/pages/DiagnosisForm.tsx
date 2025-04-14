// src/pages/DiagnosisForm.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { createDiagnosis, DiagnosisCreation, getDiagnosisByAppointment } from '../services/diagnosisService';
import { getAppointmentById, Appointment } from '../services/appointmentService';
import { getPatientById, Patient } from '../services/patientService';

interface FormData {
  diagnosis: string;
  prescription: string;
  notes?: string;
}

const DiagnosisForm = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [existingDiagnosis, setExistingDiagnosis] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId || !user) return;
      
      setIsLoading(true);
      try {
        // Fetch the actual appointment data
        const appointmentResponse = await getAppointmentById(Number(appointmentId));
        setAppointment(appointmentResponse.data);
        
        // Fetch patient data - Updated to use new endpoint format
        try {
          const patientResponse = await getPatientById(appointmentResponse.data.patient_id);
          setPatient(patientResponse.data);
        } catch (err) {
          console.error("Error fetching patient:", err);
          // Patient fetch might fail, don't block the whole flow
        }
        
        // Check if diagnosis already exists
        const diagnosisResponse = await getDiagnosisByAppointment(Number(appointmentId));
        if (diagnosisResponse.data.length > 0) {
          setExistingDiagnosis(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load appointment data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [appointmentId, user]);
  
  const onSubmit = async (data: FormData) => {
    if (!user || !appointmentId) return;
    
    setIsSubmitting(true);
    try {
      const diagnosisData: DiagnosisCreation = {
        appointment_id: Number(appointmentId),
        doctor_id: user.id,
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        notes: data.notes
      };
      
      await createDiagnosis(diagnosisData);
      toast.success('Diagnosis added successfully!');
      navigate('/doctor/appointments');
    } catch (err) {
      console.error("Error submitting diagnosis:", err);
      setError('Failed to add diagnosis. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
  
  if (existingDiagnosis) {
    return (
      <Layout>
        <div className="bg-neutral-offBlack rounded-xl shadow-lg border-l-4 border-primary-oceanTeal">
          <div className="px-6 py-8 sm:p-8 text-center">
            <h3 className="text-lg font-medium text-accent-beige">Diagnosis already added</h3>
            <div className="mt-2 max-w-xl text-sm text-neutral-lightGray mx-auto">
              <p>A diagnosis has already been recorded for this appointment.</p>
            </div>
            <div className="mt-6">
              <Link
                to="/doctor/appointments"
                className="px-6 py-2 bg-primary-oceanTeal text-accent-beige rounded-lg hover:bg-primary-sageGreen transition-colors"
              >
                Back to Appointments
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !appointment) {
    return (
      <Layout>
        <ErrorAlert 
  message={error || 'Appointment not found'}  
  onDismiss={() => setError('')}
  className="mb-4"
/>
        <div className="mt-4">
          <Link 
            to="/doctor/appointments" 
            className="text-primary-sageGreen hover:text-accent-beige transition-colors"
          >
            &larr; Back to appointments
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-700 rounded-xl shadow-lg overflow-hidden border-l-4 border-primary-oceanTeal">
        <div className="px-6 py-8 sm:p-8">
          <h1 className="text-2xl font-bold text-accent-beige">Add Diagnosis</h1>
          <p className="mt-2 text-sm text-neutral-lightGray">
            Record diagnosis and prescription for your patient
          </p>
        </div>
        
        <div className="border-t border-primary-sageGreen/30 px-6 py-8 sm:p-8">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-accent-beige">Appointment Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-lightGray">Date</dt>
                <dd className="mt-1 text-sm text-accent-beige">
                  {new Date(appointment.date).toLocaleDateString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-lightGray">Time</dt>
                <dd className="mt-1 text-sm text-accent-beige">
                  {new Date(`2000-01-01T${appointment.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(`2000-01-01T${appointment.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-lightGray">Patient</dt>
                <dd className="mt-1 text-sm text-accent-beige">
                  {patient ? patient.name : `Patient ID: ${appointment.patient_id}`}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-neutral-lightGray">Status</dt>
                <dd className="mt-1 text-sm text-accent-beige">
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </dd>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label htmlFor="diagnosis" className="block text-sm font-medium text-accent-beige mb-2">
                Diagnosis
              </label>
              <textarea
                id="diagnosis"
                rows={3}
                className={`w-full px-4 py-3 bg-primary-oceanTeal/15  border ${
                  errors.diagnosis ? 'border-accent-warmBrick' : 'border-primary-sageGreen/30'
                } rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray`}
                {...register('diagnosis', { required: 'Diagnosis is required' })}
                placeholder="Enter detailed diagnosis"
              />
              {errors.diagnosis && (
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
                  {errors.diagnosis.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="prescription" className="block text-sm font-medium text-accent-beige mb-2">
                Prescription
              </label>
              <textarea
                id="prescription"
                rows={3}
                className={`w-full px-4 py-3 bg-primary-oceanTeal/15  border ${
                  errors.prescription ? 'border-accent-warmBrick' : 'border-primary-sageGreen/30'
                } rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray`}
                {...register('prescription', { required: 'Prescription is required' })}
                placeholder="Enter prescriptions, medications, dosages, etc."
              />
              {errors.prescription && (
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
                  {errors.prescription.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-accent-beige mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="w-full px-4 py-3 bg-primary-oceanTeal/15  border border-primary-sageGreen/30 rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray"
                {...register('notes')}
                placeholder="Additional notes, follow-up instructions, etc."
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <Link
                to="/doctor/appointments"
                className="px-6 py-2 border-2 border-accent-warmBrick text-accent-warmBrick rounded-lg hover:bg-accent-warmBrick/20 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-oceanTeal text-accent-beige rounded-lg hover:bg-primary-sageGreen transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    Saving...
                  </div>
                ) : 'Save Diagnosis'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosisForm;