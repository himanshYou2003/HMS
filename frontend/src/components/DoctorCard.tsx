import { Link } from 'react-router-dom';
import { Doctor } from '../services/doctorService';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl border-l-4 border-primary-oceanTeal">
      <div className="bg-accent-beige px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="h-14 w-14 bg-primary-oceanTeal rounded-full flex items-center justify-center text-white">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-accent-deepPlum">Dr. {doctor.name}</h3>
            {doctor.specialization && (
              <p className="mt-1 text-sm text-primary-oceanTeal font-medium">
                {doctor.specialization}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-5 bg-accent-deepPlum/30">
        <dl className="space-y-4 ">
          <div className="bg-neutral-lightGray p-4 rounded-lg">
            <dt className="text-sm font-medium text-accent-deepPlum flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-primary-sageGreen" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email
            </dt>
            <dd className="mt-1 text-sm text-neutral-offBlack pl-7">{doctor.email}</dd>
          </div>

          <div className="bg-neutral-lightGray p-4 rounded-lg">
            <dt className="text-sm font-medium text-accent-deepPlum flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-primary-sageGreen" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              Gender
            </dt>
            <dd className="mt-1 text-sm text-neutral-offBlack pl-7">
              {doctor.gender.charAt(0).toUpperCase() + doctor.gender.slice(1)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-6 pb-5 bg-accent-deepPlum/30">
        <Link
          to={`/doctors/${doctor.id}`}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
              clipRule="evenodd" 
            />
          </svg>
          View Profile & Book Appointment
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;