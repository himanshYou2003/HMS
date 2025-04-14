// src/pages/PatientRegister.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import { registerPatient, PatientRegistration } from '../services/patientService';
import { getAllStates, getCitiesByState, State, City } from '../services/masterService';

const PatientRegister = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PatientRegistration>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const navigate = useNavigate();

  const selectedStateId = watch('state_id');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await getAllStates();
        setStates(response.data);
      }  catch (err: any) {
          if (err.message === 'An account already exists with this email') {
            setError('An account already exists with this email');
          } else {
            setError('Registration failed. Please try again.');
          }
        } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedStateId) {
      const fetchCities = async () => {
        setLoadingCities(true);
        try {
          const response = await getCitiesByState(Number(selectedStateId));
          setCities(response.data);
        } catch (error) {
          setError('Failed to load cities. Please try again later.');
        } finally {
          setLoadingCities(false);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedStateId]);

 const onSubmit = async (data: PatientRegistration) => {
  setIsLoading(true);
  setError('');

  try {
    await registerPatient({
      ...data,
      state_id: Number(data.state_id),
      city_id: Number(data.city_id)
    });
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

  if (loadingStates) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-2xl mx-auto bg-deepPlum shadow-lg bg-neutral-offBlack rounded-2xl p-8 text-beige">
          <h2 className="text-3xl font-bold mb-6 text-accent-beige">Patient Registration</h2>

          {error && (
  <ErrorAlert 
    message={error}
    onDismiss={() => setError('')}
    className="mb-4"
  />
)}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label text-accent-beige">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="input border-none bg-accent-beige/80"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="label text-accent-beige">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input border-none bg-accent-beige/80"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="label text-accent-beige">Password</label>
                <input
                  id="password"
                  type="password"
                  className="input border-none bg-accent-beige/80"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="gender" className="label text-accent-beige">Gender</label>
                <select
                  id="gender"
                  className="input border-none bg-accent-beige/80"
                  {...register('gender', { required: 'Gender is required' })}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-sm text-red-400 mt-1">{errors.gender.message}</p>}
              </div>

              <div>
                <label htmlFor="state_id" className="label text-accent-beige">State</label>
                <select
                  id="state_id"
                  className="input border-none bg-accent-beige/80"
                  {...register('state_id', { required: 'State is required' })}
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>{state.state}</option>
                  ))}
                </select>
                {errors.state_id && <p className="text-sm text-red-400 mt-1">{errors.state_id.message}</p>}
              </div>

              <div>
                <label htmlFor="city_id" className="label text-accent-beige">City</label>
                <select
                  id="city_id"
                  className="input border-none bg-accent-beige/80"
                  disabled={!selectedStateId || loadingCities}
                  {...register('city_id', { required: 'City is required' })}
                >
                  <option value="">
                    {loadingCities ? 'Loading cities...' : 'Select city'}
                  </option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.city}</option>
                  ))}
                </select>
                {errors.city_id && <p className="text-sm text-red-400 mt-1">{errors.city_id.message}</p>}
              </div>

              <div>
                <label htmlFor="street_address" className="label text-accent-beige">Street Address</label>
                <input
                  id="street_address"
                  type="text"
                  className="input border-none bg-accent-beige/80"
                  {...register('street_address', { required: 'Address is required' })}
                />
                {errors.street_address && <p className="text-sm text-red-400 mt-1">{errors.street_address.message}</p>}
              </div>

              <div>
                <label htmlFor="pin_code" className="label text-accent-beige">PIN Code</label>
                <input
                  id="pin_code"
                  type="text"
                  className="input border-none bg-accent-beige/80"
                  {...register('pin_code', {
                    required: 'PIN code is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'PIN code must be 6 digits'
                    }
                  })}
                />
                {errors.pin_code && <p className="text-sm text-red-400 mt-1">{errors.pin_code.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-sageGreen hover:text-beige text-blue-300 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientRegister;
