// src/pages/DoctorRegister.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ErrorAlert from '../components/ErrorAlert';
import { registerDoctor, DoctorRegistration } from '../services/doctorService';

const DoctorRegister = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DoctorRegistration>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: DoctorRegistration) => {
    setIsLoading(true);
    setError('');

    try {
      await registerDoctor(data);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      if (err.message === 'An account already exists with this email') {
        setError('An account already exists with this email');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className=" rounded-md flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-neutral-offBlack rounded-xl shadow-lg p-8 text-accent-beige">
          <h2 className="text-2xl font-bold mb-6 text-center ">Doctor Registration</h2>

          {error && (
  <ErrorAlert 
    message={error}
    onDismiss={() => setError('')}
    className="mb-4"
  />
)}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="input bg-neutral-offBlack border border-primary-sageGreen text-accent-beige"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input bg-neutral-offBlack border border-primary-sageGreen text-accent-beige"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input bg-neutral-offBlack border border-primary-sageGreen text-accent-beige"
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

            <div>
              <label htmlFor="specialization" className="block text-sm font-medium mb-1">
                Specialization
              </label>
              <input
                id="specialization"
                type="text"
                className="input bg-neutral-offBlack border border-primary-sageGreen text-accent-beige"
                {...register('specialization', { required: 'Specialization is required' })}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-500">{errors.specialization.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender
              </label>
              <select
                id="gender"
                className="input bg-neutral-offBlack border border-primary-sageGreen text-accent-beige"
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-primary-oceanTeal hover:bg-primary-sageGreen transition text-accent-beige font-semibold py-2 px-4 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-accent-beige/80">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-sageGreen hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorRegister;
