// src/pages/DoctorAddMedicalHistory.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { createMedicalHistory, MedicalHistoryCreation } from '../services/medicalHistoryService';
import { getAllDiagnoses, Diagnosis } from '../services/diagnosisService';
import { getPatientById } from '../services/patientService';

const DoctorAddMedicalHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<MedicalHistoryCreation>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [loadingDiagnoses, setLoadingDiagnoses] = useState(true);
  const [error, setError] = useState('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [patientName, setPatientName] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      
      try {
        const response = await getPatientById(Number(patientId));
        setPatientName(response.data.name);
      } catch (err) {
        setError('Failed to load patient information.');
      } finally {
        setLoadingPatient(false);
      }
    };
    
    const fetchDiagnoses = async () => {
      try {
        const response = await getAllDiagnoses();
        setDiagnoses(response.data);
      } catch (err) {
        setError('Failed to load diagnoses. Please try again later.');
      } finally {
        setLoadingDiagnoses(false);
      }
    };
    
    fetchPatient();
    fetchDiagnoses();
  }, [patientId]);
  
  const onSubmit = async (data: Omit<MedicalHistoryCreation, 'doctor_id' | 'patient_id'>) => {
    if (!user || !patientId) {
      setError('Missing required information.');
      return;
    }
    
    setIsLoading(true);
    try {
      const medicalHistoryData: MedicalHistoryCreation = {
        ...data,
        doctor_id: user.id,
        patient_id: Number(patientId),
      };
      
      await createMedicalHistory(medicalHistoryData);
      toast.success('Medical history added successfully!');
      navigate(-1);
    } catch (err) {
      setError('Failed to add medical history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loadingPatient || loadingDiagnoses) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-gray-700 rounded-xl shadow-lg overflow-hidden border-l-4 border-primary-oceanTeal">
        <div className="px-6 py-8 sm:p-8">
          <h2 className="text-2xl font-bold text-accent-beige mb-6">Add Medical History</h2>
          <p className="mb-4 text-neutral-lightGray">
            Patient: <span className="font-semibold text-primary-sageGreen">{patientName}</span>
          </p>
          
          {error && (
  <ErrorAlert 
    message={error}
    onDismiss={() => setError('')}
    className="mb-4"
  />
)}
          
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
            <div>
              <label htmlFor="diagnosis_id" className="block text-sm font-medium text-accent-beige mb-2">
                Diagnosis
              </label>
              <select
                id="diagnosis_id"
                className={`w-full px-4 py-3 bg-gray-700/10 border ${
                  errors.diagnosis_id ? 'border-accent-warmBrick' : 'border-primary-sageGreen/30'
                } rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray`}
                {...register('diagnosis_id', { required: 'Diagnosis is required' })}
              >
                <option value="">Select a diagnosis</option>
                {diagnoses.map(diagnosis => (
                  <option key={diagnosis.id} value={diagnosis.id} className="text-neutral-lightGray">
                    {diagnosis.name}
                  </option>
                ))}
              </select>
              {errors.diagnosis_id && (
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
                  {errors.diagnosis_id.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-accent-beige mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                className={`w-full px-4 py-3 bg-gray-700/10 border ${
                  errors.date ? 'border-accent-warmBrick' : 'border-primary-sageGreen/30'
                } rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray`}
                defaultValue={new Date().toISOString().slice(0, 10)}
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && (
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
                  {errors.date.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-accent-beige mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                className={`w-full px-4 py-3 bg-gray-700/10 border ${
                  errors.notes ? 'border-accent-warmBrick' : 'border-primary-sageGreen/30'
                } rounded-lg focus:ring-2 focus:ring-primary-sageGreen focus:border-primary-oceanTeal text-neutral-lightGray`}
                placeholder="Add detailed notes about the diagnosis and treatment"
                {...register('notes', { required: 'Notes are required' })}
              />
              {errors.notes && (
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
                  {errors.notes.message}
                </p>
              )}
            </div>
            
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
                disabled={isLoading}
                className="px-6 py-2 bg-primary-oceanTeal text-accent-beige rounded-lg hover:bg-primary-sageGreen transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    Saving...
                  </div>
                ) : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorAddMedicalHistory;