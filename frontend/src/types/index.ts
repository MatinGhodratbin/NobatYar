export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  image_path: string | null;
  is_active: boolean;
}

export interface Employee {
  id: number;
  name: string;
  position: string | null;
  avatar_path: string | null;
  rating?: number;
  reviews_count?: number;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}

export interface Appointment {
  id: number;
  code: string;
  status: 'pending' | 'confirmed' | 'in_queue' | 'in_progress' | 'completed' | 'cancelled';
  appointment_date: string;
  start_time: string;
  end_time: string;
  price: number;
  service: { id: number; name: string; duration_minutes: number };
  employee: { id: number; name: string; position: string | null };
  business: { id: number; name: string };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'customer' | 'business_owner' | 'employee' | 'admin';
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}