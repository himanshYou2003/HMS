// src/components/Layout.tsx
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  console.log("Auth state:", { isAuthenticated, userType: user?.type });

  return (
    <div className="min-h-screen flex flex-col bg-neutral-lightGray">
      <nav className="bg-primary-oceanTeal shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link 
                to="/" 
                className="text-2xl font-bold text-accent-beige hover:text-white transition-colors flex items-center gap-2"
              >
                <svg 
                  className="h-8 w-8" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0H3m16 0h2M9 7h6m-6 4h6m-6 4h6M7 7v.01M7 11v.01M7 15v.01" 
                  />
                </svg>
                HMS
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-accent-beige hover:text-white px-3 py-2 font-medium transition-colors"
              >
                Home
              </Link>
              
              {isAuthenticated && user?.type === 'patient' && (
                <>
                  <Link
                    to="/appointments"
                    className="text-accent-beige hover:text-white px-3 py-2 font-medium transition-colors"
                  >
                    My Appointments
                  </Link>
                  <Link
                    to="/medical-history"
                    className="text-accent-beige hover:text-white px-3 py-2 font-medium transition-colors"
                  >
                    Medical History
                  </Link>
                </>
              )}
              
              {isAuthenticated && user?.type === 'doctor' && (
                <>
                  <Link
                    to="/doctor/appointments"
                    className="text-accent-beige hover:text-white px-3 py-2 font-medium transition-colors"
                  >
                    Appointments
                  </Link>
                  <Link
                    to="/doctor/schedule"
                    className="text-accent-beige hover:text-white px-3 py-2 font-medium transition-colors"
                  >
                    My Schedule
                  </Link>
                  <Link
                    to="/patients"
                    className="text-accent-beige hover:text-white px-3 py-2 font-medium transition-colors"
                  >
                    Patient List
                  </Link>
                </>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="bg-accent-beige/70 p-8 rounded-full uppercase text-xl font-medium">
        Hi, {user?.type === 'doctor' ? `Dr. ${user?.name}` : user?.name}
      </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-warmBrick text-white rounded-lg hover:bg-primary-sageGreen transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-accent-beige text-primary-oceanTeal rounded-lg hover:bg-primary-sageGreen hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register/patient"
                    className="px-4 py-2 bg-primary-sageGreen text-white rounded-lg hover:bg-accent-warmBrick transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow py-10 bg-primary-sageGreen/80">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
      </main>

      <footer className="bg-primary-oceanTeal  border-t-2 border-primary-sageGreen">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-accent-beige/80 text-sm">
            &copy; {new Date().getFullYear()} Himanshu Kumar. 
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
