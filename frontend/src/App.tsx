import { Routes, Route, Navigate } from 'react-router-dom';
import ServiceSelectionPage from '@/pages/booking/ServiceSelectionPage';
import DateTimeSelectionPage from '@/pages/booking/DateTimeSelectionPage';

function ConfirmationPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-100 text-center">
        <h1 className="text-xl font-bold text-primary-600">رزرو با موفقیت ثبت شد</h1>
        <p className="mt-2 text-sm text-gray-500">صفحه‌ی صف زنده در فاز ۶ اضافه می‌شود.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/booking" replace />} />
      <Route path="/booking" element={<ServiceSelectionPage />} />
      <Route path="/booking/datetime" element={<DateTimeSelectionPage />} />
      <Route path="/booking/confirmation" element={<ConfirmationPlaceholder />} />
    </Routes>
  );
}

export default App;