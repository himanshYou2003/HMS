import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import DoctorCard from '../components/DoctorCard';
import { getAllDoctors, Doctor } from '../services/doctorService';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
        setDoctors(response.data);
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <Layout>
      <div className="bg-neutral-offBlack rounded-xl shadow-md mb-6 border border-primary-sageGreen/30">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-accent-beige">Available Doctors</h1>
          <p className="mt-1 text-sm text-accent-beige/70">
            Browse our list of doctors and book an appointment
          </p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert 
    message={error}
    onDismiss={() => setError('')}
    className="mb-4"
  />
      ) : doctors.length === 0 ? (
        <div className="bg-neutral-offBlack border-l-4 border-warn-yellow p-4 rounded-lg shadow-md mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <svg className="h-5 w-5 text-warn-yellow" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 text-sm text-warn-yellow">
              No doctors found. Please check back later.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default DoctorsList;
