import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { MedicalHistoryCreation, createMedicalHistory } from '../services/medicalHistoryService';

interface MedicalHistoryFormProps {
  patientId: number;
  onSuccess: () => void;
}

type FormData = Omit<MedicalHistoryCreation, 'patient_id'>;

const MedicalHistoryForm = ({ patientId, onSuccess }: MedicalHistoryFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await createMedicalHistory({
        ...data,
        patient_id: patientId
      });
      toast.success('Medical history added successfully');
      reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to add medical history');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-neutral-300 shadow-xl rounded-lg p-6 border-l-4 border-primary-oceanTeal">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-semibold text-primary-oceanTeal">Medical History</h3>
            <p className="mt-2 text-sm text-neutral-offBlack/80">
              Provide comprehensive health information for better care management
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 md:col-span-2">
            <div className="space-y-6">
              {/* Medical Conditions */}
              <div>
                <label htmlFor="conditions" className="block text-sm font-medium text-accent-deepPlum">
                  Medical Conditions
                </label>
                <div className="mt-1">
                  <textarea
                    id="conditions"
                    rows={3}
                    {...register('conditions', { required: 'Medical conditions are required' })}
                    className={`w-full px-4 py-2 border ${
                      errors.conditions ? 'border-accent-warmBrick' : 'border-neutral-lightGray'
                    } rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen`}
                    placeholder="Chronic conditions, allergies, etc."
                  />
                  {errors.conditions && (
                    <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.conditions.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Past Surgeries */}
              <div>
  <label htmlFor="surgeries" className="block text-sm font-medium text-accent-deepPlum">
    Past Surgeries
  </label>
  <div className="mt-1">
    <textarea
      id="surgeries"
      rows={3}
      {...register('surgeries', { required: 'Surgery information is required' })}
      className={`w-full px-4 py-2 border ${
        errors.surgeries ? 'border-accent-warmBrick' : 'border-neutral-lightGray'
      } rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen`}
      placeholder="Previous surgeries with dates"
    />
    {errors.surgeries && (
      <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {errors.surgeries.message}
      </p>
    )}
  </div>
</div>

{/* Current Medications */}
<div>
  <label htmlFor="medications" className="block text-sm font-medium text-accent-deepPlum">
    Current Medications
  </label>
  <div className="mt-1">
    <textarea
      id="medications"
      rows={3}
      {...register('medications', { required: 'Medication information is required' })}
      className={`w-full px-4 py-2 border ${
        errors.medications ? 'border-accent-warmBrick' : 'border-neutral-lightGray'
      } rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen`}
      placeholder="Current medications and dosages"
    />
    {errors.medications && (
      <p className="mt-2 text-sm text-accent-warmBrick flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {errors.medications.message}
      </p>
    )}
  </div>
</div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-accent-deepPlum">
                  Additional Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    rows={3}
                    {...register('notes')}
                    className="w-full px-4 py-2 border border-neutral-lightGray rounded-lg focus:ring-2 focus:ring-primary-oceanTeal focus:border-primary-sageGreen"
                    placeholder="Other relevant health information"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border-2 border-accent-warmBrick text-accent-warmBrick rounded-lg hover:bg-accent-beige transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-primary-oceanTeal text-white rounded-lg hover:bg-primary-sageGreen transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin">↻</span>
                Saving...
              </div>
            ) : (
              'Save Medical History'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MedicalHistoryForm;