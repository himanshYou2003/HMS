// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import { loginPatient } from '../services/patientService';
import { loginDoctor } from '../services/doctorService';

interface LoginForm {
  email: string;
  password: string;
  userType: 'patient' | 'doctor';
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { userType: 'patient' }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    // Client-side email validation
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const response = data.userType === 'patient' 
        ? await loginPatient(data)
        : await loginDoctor(data);
  
      login({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        type: data.userType
      });
  
      toast.success('Login successful');
      navigate(location.state?.from || (data.userType === 'patient' ? '/' : '/'));
    } catch (err: any) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.error?.toLowerCase() || '';
      
      if (status === 401) {
        setError('Incorrect password');
      } else if (status === 404) {
        setError('not-found');
      } else if (serverMessage.includes('email')) {
        setError('Invalid email format');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-neutral-offBlack shadow-lg rounded-md overflow-hidden">
        <div className="px-6 py-8 sm:p-8">
          <h2 className="text-2xl font-bold text-accent-beige mb-6">Login</h2>
          
          {error && (
            <ErrorAlert 
              message={
                error === 'not-found' ? (
                  <span>
                    No account found. Please {' '}
                    <Link to="/register/patient" className="text-primary-sageGreen hover:underline">
                      register as Patient
                    </Link>{' '}
                    or {' '}
                    <Link to="/register/doctor" className="text-primary-sageGreen hover:underline">
                      register as Doctor
                    </Link>
                  </span>
                ) : (
                  error
                )
              }
              onDismiss={() => setError('')}
              className="mb-4"
            />
          )}

          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-accent-beige mb-2">
                Login As
              </label>
              <select
                id="userType"
                className="w-full bg-accent-beige/10 border border-primary-sageGreen rounded-md p-2 text-accent-beige focus:ring-2 focus:ring-primary-oceanTeal"
                {...register('userType', { required: 'User type is required' })}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
              {errors.userType && (
                <p className="mt-1 text-sm text-red-500">{errors.userType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-accent-beige mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full bg-accent-beige/10 border border-primary-sageGreen rounded-md p-2 text-accent-beige focus:ring-2 focus:ring-primary-oceanTeal"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Write correct email'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-accent-beige mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full bg-accent-beige/10 border border-primary-sageGreen rounded-md p-2 text-accent-beige focus:ring-2 focus:ring-primary-oceanTeal"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-sageGreen text-accent-beige py-2 px-4 rounded-md hover:bg-primary-oceanTeal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-accent-beige/80">
              Don't have an account?{' '}
              <Link to="/register/patient" className="text-primary-sageGreen hover:underline">
                Register as Patient
              </Link>{' '}or{' '}
              <Link to="/register/doctor" className="text-primary-sageGreen hover:underline">
                Register as Doctor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;