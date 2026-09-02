import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import BusinessSearchPage from '@/pages/search/BusinessSearchPage';
import ServiceSelectionPage from '@/pages/booking/ServiceSelectionPage';
import DateTimeSelectionPage from '@/pages/booking/DateTimeSelectionPage';
import LiveQueuePage from '@/pages/booking/LiveQueuePage';
import BusinessOnboardingPage from '@/pages/onboarding/BusinessOnboardingPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/pages/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import AppointmentsManagementPage from '@/pages/admin/AppointmentsManagementPage';
import ServicesPage from '@/pages/admin/ServicesPage';
import EmployeesPage from '@/pages/admin/EmployeesPage';
import SettingsPage from '@/pages/admin/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/search" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/search" element={<BusinessSearchPage />} />
        <Route path="/b/:businessSlug/booking" element={<ServiceSelectionPage />} />
        <Route path="/b/:businessSlug/booking/datetime" element={<DateTimeSelectionPage />} />
        <Route path="/booking/queue/:appointmentId" element={<LiveQueuePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['customer', 'business_owner']} />}>
        <Route path="/onboarding/business" element={<BusinessOnboardingPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['business_owner', 'employee']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsManagementPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;