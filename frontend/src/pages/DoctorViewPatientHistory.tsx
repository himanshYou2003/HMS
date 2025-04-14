import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { getPatientById } from '../services/patientService';
import { getDiagnosisByAppointment } from '../services/diagnosisService';
import { getPatientAppointments } from '../services/appointmentService';

const DoctorViewPatientHistory = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [diagnoses, setDiagnoses] = useState<{ [key: number]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setError('Patient ID is required');
        setIsLoading(false);
        return;
      }

      try {
        const patientResponse = await getPatientById(Number(patientId));
        setPatient(patientResponse.data);

        const appointmentsResponse = await getPatientAppointments(Number(patientId));
        setAppointments(appointmentsResponse.data);

        const diagnosesMap: { [key: number]: any[] } = {};

        for (const appointment of appointmentsResponse.data) {
          try {
            const diagnosisResponse = await getDiagnosisByAppointment(appointment.id);
            if (diagnosisResponse.data.length > 0) {
              diagnosesMap[appointment.id] = diagnosisResponse.data;
            }
          } catch (err) {
            console.error(`Error fetching diagnosis for appointment ${appointment.id}:`, err);
          }
        }

        setDiagnoses(diagnosesMap);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
      <div className="bg-neutral-offBlack border border-primary-sageGreen/30 rounded-xl shadow-md mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-accent-beige">Patient Medical History</h1>
            {patient && (
              <p className="mt-1 text-sm text-accent-beige/70">Patient: {patient.name}</p>
            )}
          </div>
          <Link
            to="/patients"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-primary-sageGreen text-primary-sageGreen hover:bg-primary-sageGreen/10 transition"
          >
            Back to Patients
          </Link>
        </div>
      </div>

      {error ? (
        <ErrorAlert 
    message={error}
    onDismiss={() => setError('')}
    className="mb-4"
  />
      ) : !patient ? (
        <ErrorAlert 
    message="Patient not found"
    onDismiss={() => setError('')}
    className="mb-4"
  />
      ) : (
        <>
          {/* Patient Info */}
          <div className="bg-neutral-offBlack border border-primary-sageGreen/20 rounded-xl shadow-md mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-semibold text-accent-beige">Patient Information</h2>
            </div>
            <div className="border-t border-neutral-800 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-accent-beige/90">
                <div>
                  <dt className="text-sm font-medium">Full Name</dt>
                  <dd className="mt-1 text-sm">{patient.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium">Email</dt>
                  <dd className="mt-1 text-sm">{patient.email}</dd>
                </div>
                {patient.gender && (
                  <div>
                    <dt className="text-sm font-medium">Gender</dt>
                    <dd className="mt-1 text-sm capitalize">{patient.gender}</dd>
                  </div>
                )}
                {patient.phone && (
                  <div>
                    <dt className="text-sm font-medium">Phone</dt>
                    <dd className="mt-1 text-sm">{patient.phone}</dd>
                  </div>
                )}
                {patient.street_address && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium">Address</dt>
                    <dd className="mt-1 text-sm">{patient.street_address}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Medical Records */}
          <div className="bg-neutral-offBlack border border-primary-sageGreen/20 rounded-xl shadow-md">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-semibold text-accent-beige">Medical Records</h2>
            </div>
            <div className="border-t border-neutral-800">
              {appointments.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-sm text-accent-beige/60">No appointments found for this patient.</p>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-700">
                  {appointments.map((appointment) => {
                    const appointmentDiagnoses = diagnoses[appointment.id] || [];
                    return (
                      <li key={appointment.id} className="px-4 py-5 sm:p-6">
                        <div className="mb-3">
                          <h3 className="text-md font-medium text-accent-beige">
                            Appointment on {formatDate(appointment.date)}
                          </h3>
                          <p className="text-sm text-accent-beige/70">
                            Status: <span className='text-primary-sageGreen'>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                          </p>
                        </div>

                        {appointmentDiagnoses.length > 0 ? (
                          <div className="border-t border-neutral-800 pt-3 mt-3">
                            <h4 className="text-sm font-semibold text-accent-beige mb-2">Diagnoses:</h4>
                            {appointmentDiagnoses.map((diagnosis, index) => (
                              <div key={diagnosis.id} className={index > 0 ? 'mt-4' : ''}>
                                <div className="bg-primary-oceanTeal/10 border border-primary-oceanTeal/30 p-4 rounded-lg text-accent-beige">
                                  <p className="text-sm font-medium">{diagnosis.diagnosis}</p>
                                  <p className="text-sm mt-1">
                                    <span className="font-medium">Prescription:</span> {diagnosis.prescription}
                                  </p>
                                  {diagnosis.notes && (
                                    <p className="text-sm mt-1">
                                      <span className="font-medium">Notes:</span> {diagnosis.notes}
                                    </p>
                                  )}
                                  <p className="text-xs text-accent-beige/50 mt-2">
                                    {new Date(diagnosis.created_on).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : appointment.status === 'completed' ? (
                          <div className="border-t border-neutral-800 pt-3 mt-3">
                            <p className="text-sm italic text-accent-beige/60">
                              No diagnosis recorded for this appointment.
                            </p>
                            <div className="mt-2">
                              <Link
                                to={`/appointments/${appointment.id}/diagnose`}
                                className="text-sm text-indigo-400 hover:underline"
                              >
                                Add Diagnosis
                              </Link>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default DoctorViewPatientHistory;
