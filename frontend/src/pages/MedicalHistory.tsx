// src/pages/MedicalHistory.tsx
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import MedicalHistoryForm from '../components/MedicalHistoryForm';
import { useAuth } from '../context/AuthContext';
import { getPatientMedicalHistory, MedicalHistory as MedicalHistoryType } from '../services/medicalHistoryService';

const MedicalHistory = () => {
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  
  const fetchMedicalHistory = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await getPatientMedicalHistory(user.id);
      setMedicalHistories(response.data);
    } catch (err) {
      setError('Failed to load medical history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMedicalHistory();
  }, [user]);
  
  const handleFormSuccess = () => {
    setShowForm(false);
    fetchMedicalHistory();
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
      <div className="bg-neutral-offBlack shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-accent-beige">Medical History</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-300">
              View and manage your medical records
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border-none bg-slate-600 text-sm font-medium rounded-md shadow-sm text-gray-200 bg-primary-600 hover:bg-primary-700"
          >
            {showForm ? 'Cancel' : 'Add Medical History'}
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
          <MedicalHistoryForm patientId={user.id} onSuccess={handleFormSuccess} />
        </div>
      )}
      
      {medicalHistories.length === 0 ? (
        <div className="bg-neutral-offBlack shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">No medical history found</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
              <p>Add your medical history using the button above.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {medicalHistories.map(history => (
            <div key={history.id} className="bg-neutral-offBlack shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-accent-beige">
                  Medical History Record
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-300">
                  Created on: {new Date(history.created_on).toLocaleDateString()}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-neutral-offBlack px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-300">Medical Conditions</dt>
                    <dd className="mt-1 text-sm text-accent-beige sm:mt-0 sm:col-span-2">{history.conditions}</dd>
                  </div>
                  <div className="bg-neutral-offBlack px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-300">Past Surgeries</dt>
                    <dd className="mt-1 text-sm text-accent-beige sm:mt-0 sm:col-span-2">{history.surgeries}</dd>
                  </div>
                  <div className="bg-neutral-offBlack px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-300">Current Medications</dt>
                    <dd className="mt-1 text-sm text-accent-beige sm:mt-0 sm:col-span-2">{history.medications}</dd>
                  </div>
                  {history.notes && (
                    <div className="bg-neutral-offBlack px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-300">Additional Notes</dt>
                      <dd className="mt-1 text-sm text-accent-beige sm:mt-0 sm:col-span-2">{history.notes}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MedicalHistory;