import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import PatientRegister from './pages/PatientRegister'
import DoctorRegister from './pages/DoctorRegister'
import DoctorsList from './pages/DoctorsList'
import DoctorDetail from './pages/DoctorDetail'
import PatientAppointments from './pages/PatientAppointments'
import DoctorAppointments from './pages/DoctorAppointments'
import AppointmentForm from './pages/AppointmentForm'
import DoctorSchedule from './pages/DoctorSchedule'
import MedicalHistory from './pages/MedicalHistory'
import DiagnosisForm from './pages/DiagnosisForm'
import PatientMedicalHistory from './pages/PatientMedicalHistory'
import DoctorViewPatientHistory from './pages/DoctorViewPatientHistory'
import DoctorAddMedicalHistory from './pages/DoctorAddMedicalHistory'
import DoctorPatientList from './pages/DoctorPatientList'
import PatientDiagnosisView from './pages/PatientDiagnosisView'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/patient" element={<PatientRegister />} />
          <Route path="/register/doctor" element={<DoctorRegister />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />

          {/* Patient-protected routes */}
          <Route path="/appointments" element={
            <ProtectedRoute requiredRole="patient">
              <PatientAppointments />
            </ProtectedRoute>
          } />
          
          <Route path="/appointments/new" element={
            <ProtectedRoute requiredRole="patient">
              <AppointmentForm />
            </ProtectedRoute>
          } />
          
          <Route path="/medical-history" element={
            <ProtectedRoute requiredRole="patient">
              <MedicalHistory />
            </ProtectedRoute>
          } />
          
          <Route path="/appointments/:appointmentId/view-diagnosis" element={
            <ProtectedRoute requiredRole="patient">
              <PatientDiagnosisView />
            </ProtectedRoute>
          } />

          {/* Doctor-protected routes */}
          <Route path="/doctor/appointments" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor/schedule" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorSchedule />
            </ProtectedRoute>
          } />
          
          <Route path="/appointments/:appointmentId/diagnose" element={
            <ProtectedRoute requiredRole="doctor">
              <DiagnosisForm />
            </ProtectedRoute>
          } />
          
          <Route path="/patients/:patientId/medical-history" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorViewPatientHistory />
            </ProtectedRoute>
          } />
          
          <Route path="/patients/:patientId/medical-history/add" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorAddMedicalHistory />
            </ProtectedRoute>
          } />
          
          <Route path="/patients" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorPatientList />
            </ProtectedRoute>
          } />

          {/* Common protected route example */}
          <Route path="/patient-medical-history" element={
            <ProtectedRoute>
              <PatientMedicalHistory />
            </ProtectedRoute>
          } />

          {/* 404 Handler */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App