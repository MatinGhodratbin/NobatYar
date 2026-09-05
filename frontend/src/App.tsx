import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/pages/admin/AdminLayout';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const EmailVerificationPage = lazy(() => import('@/pages/auth/EmailVerificationPage'));
const BusinessSearchPage = lazy(() => import('@/pages/search/BusinessSearchPage'));
const ServiceSelectionPage = lazy(() => import('@/pages/booking/ServiceSelectionPage'));
const DateTimeSelectionPage = lazy(() => import('@/pages/booking/DateTimeSelectionPage'));
const LiveQueuePage = lazy(() => import('@/pages/booking/LiveQueuePage'));
const MyAppointmentsPage = lazy(() => import('@/pages/customer/MyAppointmentsPage'));
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage'));
const BusinessOnboardingPage = lazy(() => import('@/pages/onboarding/BusinessOnboardingPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AppointmentsManagementPage = lazy(() => import('@/pages/admin/AppointmentsManagementPage'));
const ServicesPage = lazy(() => import('@/pages/admin/ServicesPage'));
const EmployeesPage = lazy(() => import('@/pages/admin/EmployeesPage'));
const WorkingHoursPage = lazy(() => import('@/pages/admin/WorkingHoursPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/verify-email" element={<EmailVerificationPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/search" element={<BusinessSearchPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
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
            <Route path="working-hours" element={<WorkingHoursPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
