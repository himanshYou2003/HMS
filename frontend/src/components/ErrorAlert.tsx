import { ReactNode } from 'react';

interface ErrorAlertProps {
  message: ReactNode;  // Changed from string to ReactNode
  className?: string;
  onDismiss?: () => void;
}

const ErrorAlert = ({ message, className, onDismiss }: ErrorAlertProps) => {
  return (
    <div className={`bg-accent-warmBrick/10 border-l-4 border-accent-warmBrick rounded-lg p-4 ${className || ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg 
              className="h-5 w-5 text-accent-warmBrick" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-accent-warmBrick">
              {message}
            </div>
          </div>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="ml-4 text-accent-warmBrick hover:text-accent-warmBrick/75"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;