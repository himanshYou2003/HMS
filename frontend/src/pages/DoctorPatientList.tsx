import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { getAllPatients, Patient } from '../services/patientService';

const DoctorPatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients();
        setPatients(response.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-neutral-offBlack text-accent-beige rounded-md px-4 py-6">
        <div className="bg-primary-oceanTeal/10 rounded-xl shadow-lg border-l-4 border-primary-oceanTeal mb-6">
          <div className="px-6 py-8 sm:p-8">
            <h1 className="text-2xl font-bold">Patient List</h1>
            <p className="mt-2 text-sm text-accent-beige/70">
              View and manage patient records
            </p>
          </div>
        </div>

        {error ? (
          <ErrorAlert 
          message={error}
          onDismiss={() => setError('')}
          className="mb-4"
        />
        ) : patients.length === 0 ? (
          <div className="bg-primary-oceanTeal/10 rounded-xl shadow p-6 text-center">
            <h3 className="text-lg font-semibold">No patients found</h3>
            <p className="mt-2 text-sm text-accent-beige/60">
              There are no registered patients in the system.
            </p>
          </div>
        ) : (
          <div className="bg-primary-sageGreen/5 rounded-xl shadow divide-y divide-primary-sageGreen/20 overflow-hidden">
            <ul>
              {patients.map((patient) => (
                <li
                  key={patient.id}
                  className="px-6 py-6 hover:bg-primary-sageGreen/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {patient.name}
                      </p>
                      <p className="text-sm text-accent-beige/80">{patient.email}</p>
                      {patient.gender && (
                        <p className="text-sm text-accent-beige/60 capitalize">
                          Gender: {patient.gender}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <Link
                        to={`/patients/${patient.id}/medical-history`}
                        className="inline-flex items-center px-4 py-1.5 text-sm rounded-md bg-primary-oceanTeal text-accent-beige hover:bg-primary-sageGreen transition"
                      >
                        View History
                      </Link>
                    </div>
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

export default DoctorPatientList;
