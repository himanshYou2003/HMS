// src/pages/PatientMedicalHistory.tsx
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../context/AuthContext';
import { getPatientMedicalHistory, MedicalHistory } from '../services/medicalHistoryService';
import { getDiagnosisById } from '../services/diagnosisService';
import { getDoctorById } from '../services/doctorService';

const PatientMedicalHistory = () => {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const response = await getPatientMedicalHistory(user.id);
        const historyWithDetails = await Promise.all(
          response.data.map(async (record) => {
            try {
              // Fetch diagnosis information
              const diagnosisResponse = await getDiagnosisById(record.diagnosis_id);
              // Fetch doctor information
              const doctorResponse = await getDoctorById(record.doctor_id);
              
              return {
                ...record,
                diagnosis_name: diagnosisResponse.data.name,
                doctor_name: doctorResponse.data.name
              };
            } catch (err) {
              return record;
            }
          })
        );
        
        setMedicalHistory(historyWithDetails);
      } catch (err) {
        setError('Failed to load medical history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedicalHistory();
  }, [user]);
  
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
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View your complete medical history
          </p>
        </div>
      </div>
      
      {error ? (
        <ErrorAlert message={error} />
      ) : medicalHistory.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">No medical history found</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
              <p>You don't have any medical history records yet.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {medicalHistory.map((record) => (
              <li key={record.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {record.diagnosis_name || `Diagnosis #${record.diagnosis_id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Date:</span> {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Doctor:</span> {record.doctor_name || `Doctor #${record.doctor_id}`}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 whitespace-pre-line">
                        <span className="font-medium">Notes:</span> {record.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default PatientMedicalHistory;