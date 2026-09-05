import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'customer' | 'business_owner' | 'employee' | 'admin'>;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe(() => {
      setIsHydrated(true);
    });

    // Check if already hydrated
    if (token || user) {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, [token, user]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/search" replace />;
  }

  return <Outlet />;
}
