// src/components/AppointmentCard.tsx
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { updateAppointmentStatus } from "../services/appointmentService";

interface AppointmentCardProps {
  appointment: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    doctor_id?: number;
    patient_id?: number;
  };
  doctorInfo?: {
    name: string;
    specialization?: string;
    email?: string;
    phone?: string;
  };
  patientInfo?: {
    name: string;
    email?: string;
    gender?: string;
    phone?: string;
  };
  onStatusChange: () => void;
  userType?: "patient" | "doctor";
}

const AppointmentCard = ({
  appointment,
  doctorInfo,
  patientInfo,
  onStatusChange,
  userType = "patient",
}: AppointmentCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: string) => {
    setIsUpdating(true);
    try {
      await updateAppointmentStatus(appointment.id, status);
      toast.success(`Appointment ${status}.`);
      onStatusChange();
    } catch (err) {
      toast.error("Failed to update appointment status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-primary-sageGreen rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl border-l-4 border-accent-beige">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Time and Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-primary-deepPlum">
                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                  ${
                    appointment.status === "scheduled"
                      ? "bg-accent-beige text-primary-deepPlum"
                      : appointment.status === "completed"
                      ? "bg-primary-oceanTeal text-white"
                      : "bg-accent-warmBrick text-white"
                  }`}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>

            {/* User Information */}
            <div className="space-y-3">
              {(userType === "patient" && doctorInfo) && (
                <div className="bg-accent-beige/15 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-primary-teal rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-primary-deepPlum">{doctorInfo.name}</h4>
                      {doctorInfo.specialization && (
                        <p className="text-sm text-primary-teal">{doctorInfo.specialization}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {doctorInfo.email && (
                      <p className="flex items-center gap-2 text-neutral-offBlack">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-oceanTeal" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {doctorInfo.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {(userType === "doctor" && patientInfo) && (
                <div className="bg-accent-beige/80 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-primary-sageGreen rounded-full flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-primary-deepPlum">{patientInfo.name}</h4>
                      {patientInfo.gender && (
                        <p className="text-sm text-primary-teal">{patientInfo.gender}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {patientInfo.email && (
                      <p className="flex items-center gap-2 text-neutral-offBlack">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-sageGreen" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        {patientInfo.email}
                      </p>
                    )}
                    {patientInfo.phone && (
                      <p className="flex items-center gap-2 text-neutral-offBlack">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-sageGreen" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {patientInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap gap-4">
              {appointment.status === "completed" && userType === "patient" && (
                <Link
                  to={`/appointments/${appointment.id}/view-diagnosis`}
                  className="flex items-center gap-2 text-primary-teal hover:text-primary-deepPlum transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  View Diagnosis Report
                </Link>
              )}
              {userType === "doctor" && (
                <>
                <Link
                  to={`/patients/${appointment.patient_id}/medical-history`}
                  className="flex items-center gap-2 text-primary-teal hover:text-primary-deepPlum transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Medical History
                </Link>
                <Link
                to={`/appointments/${appointment.id}/diagnose`}
                className="flex items-center gap-2 text-primary-teal hover:text-primary-deepPlum transition-colors"
              >
                Add Diagnosis
              </Link></>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 min-w-[160px]">
            {appointment.status === "scheduled" && userType === "patient" && (
              <button
                onClick={() => handleStatusChange("canceled")}
                disabled={isUpdating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-accent-warmBrick text-accent-warmBrick rounded-lg hover:bg-accent-warmBrick hover:text-white transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel Appointment
              </button>
            )}

            {appointment.status === "scheduled" && userType === "doctor" && (
              <>
                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-sageGreen transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mark Complete
                </button>
                <button
                  onClick={() => handleStatusChange("canceled")}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-beige text-primary-deepPlum rounded-lg hover:bg-accent-warmBrick hover:text-white transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;