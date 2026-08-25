import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ServiceSelectionPage from '@/pages/booking/ServiceSelectionPage';
import DateTimeSelectionPage from '@/pages/booking/DateTimeSelectionPage';
import LiveQueuePage from '@/pages/booking/LiveQueuePage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/pages/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import AppointmentsManagementPage from '@/pages/admin/AppointmentsManagementPage';
import SettingsPage from '@/pages/admin/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/booking" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/booking" element={<ServiceSelectionPage />} />
        <Route path="/booking/datetime" element={<DateTimeSelectionPage />} />
        <Route path="/booking/queue/:appointmentId" element={<LiveQueuePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['business_owner', 'employee']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsManagementPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;