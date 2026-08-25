import { Routes, Route, Navigate } from 'react-router-dom';
import ServiceSelectionPage from '@/pages/booking/ServiceSelectionPage';
import DateTimeSelectionPage from '@/pages/booking/DateTimeSelectionPage';
import LiveQueuePage from '@/pages/booking/LiveQueuePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/booking" replace />} />
      <Route path="/booking" element={<ServiceSelectionPage />} />
      <Route path="/booking/datetime" element={<DateTimeSelectionPage />} />
      <Route path="/booking/queue/:appointmentId" element={<LiveQueuePage />} />
    </Routes>
  );
}

export default App;