// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Layout>
      <div className="min-h-[50vh] bg-deepPlum/60 backdrop-blur-md rounded-2xl p-8 text-beige">
      <h1 className="text-7xl font-bold text-accent-beige drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
  Hospital Management System
</h1>

        <p className="mt-2 text-gray-700 text-lightGray max-w-xl">
          A comprehensive solution for managing patients, doctors, appointments, and medical records with ease and elegance.
        </p>

        {!isAuthenticated ? (
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="/register/patient"
              className="px-6 py-3 rounded-md bg-accent-deepPlum text-white font-semibold hover:bg-sageGreen transition"
            >
              Register as Patient
            </Link>
            <Link
              to="/register/doctor"
              className="px-6 py-3 rounded-md bg-accent-deepPlum text-white font-semibold hover:bg-sageGreen transition"
            >
              Register as Doctor
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-md bg-beige border-accent-deepPlum text-accent-deepPlum  font-semibold border-2  hover:bg-warmBrick hover:text-beige transition"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-4">
            {user?.type === 'patient' ? (
              <>
                <Link
                  to="/doctors"
                  className="px-5 py-2.5 rounded-md bg-accent-deepPlum text-white font-medium hover:bg-sageGreen transition"
                >
                  Book Appointment
                </Link>
                <Link
                  to="/appointments"
                  className="px-5 py-2.5 rounded-md border-2  border-accent-deepPlum text-accent-deepPlum   bg-transparent hover:bg-sageGreen hover:text-deepPlum font-medium transition"
                >
                  View My Appointments
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/doctor/appointments"
                  className="px-5 py-2.5 rounded-md bg-accent-deepPlum text-white font-medium hover:bg-sageGreen transition"
                >
                  View Appointments
                </Link>
                <Link
                  to="/doctor/schedule"
                  className="px-5 py-2.5 rounded-md border border-accent-deepPlum text-accent-deepPlum bg-transparent hover:bg-sageGreen hover:text-deepPlum font-medium transition"
                >
                  Manage Schedule
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-md bg-accent-deepPlum max-w-[40vw] backdrop-blur-md shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-accent-beige">Patient Management</h3>
          <p className="mt-2 text-primary-sageGreen text-sm">
            Register patients, view medical history, and manage appointments seamlessly.
          </p>
        </div>
        <div className="rounded-md bg-accent-deepPlum backdrop-blur-md shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-accent-beige">Doctor Scheduling</h3>
          <p className="mt-2 text-primary-sageGreen text-sm">
            Set doctor availability, manage appointment slots, and optimize efficiency.
          </p>
        </div>
        <div className="rounded-md bg-accent-deepPlum backdrop-blur-md shadow-md p-6 hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-accent-beige">Appointment Management</h3>
          <p className="mt-2 text-primary-sageGreen text-sm">
            Book, reschedule, and cancel appointments with ease and clarity.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
