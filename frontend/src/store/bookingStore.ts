import { create } from 'zustand';
import type { Service, Employee, TimeSlot } from '@/types';

interface BookingState {
  service: Service | null;
  employee: Employee | null;
  date: string | null;
  slot: TimeSlot | null;
  setService: (service: Service) => void;
  setEmployee: (employee: Employee) => void;
  setDateSlot: (date: string, slot: TimeSlot) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  service: null,
  employee: null,
  date: null,
  slot: null,
  setService: (service) => set({ service }),
  setEmployee: (employee) => set({ employee }),
  setDateSlot: (date, slot) => set({ date, slot }),
  reset: () => set({ service: null, employee: null, date: null, slot: null }),
}));