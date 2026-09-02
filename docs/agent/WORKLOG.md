# Work Log

## 2026-09-02 — Phase A: Critical Fixes & Phase B: Backend Stabilization

### Changes Made

#### Backend Fixes
1. **AuthService.php** — Added missing `use Illuminate\Validation\ValidationException;` import
2. **Appointment.php** — Added `reminded_at` to `$fillable` array
3. **BookingService.php** — Replaced `max('id')+1001` code generation with `date('ymd') + Str::random(6)` for concurrency safety
4. **BookingService.php** — Added `$appointment->refresh()` after update in `cancel()` method
5. **BookingService.php** — Added domain validation (employee-service-business relationships)
6. **BookingService.php** — Added cancellation state validation
7. **AvailabilityService.php** — Added timezone parameter for business-aware time calculations
8. **AvailabilityController.php** — Passes business timezone to service
9. **StoreAppointmentRequest.php** — Added timezone-aware date validation
10. **SendDueReminders.php** — Uses business timezone for reminder scheduling

#### Backend Features
11. **Policies/** — Created AppointmentPolicy, BusinessPolicy, ServicePolicy, EmployeePolicy
12. **User.php** — Added isCustomer(), isBusinessOwner(), isEmployee(), isAdmin() helper methods
13. **Migration** — Added unique constraint on employees.user_id

#### Frontend Fixes
14. **ProtectedRoute.tsx** — Changed redirect from `/booking` to `/search`
15. **DateTimeSelectionPage.tsx** — Moved navigate() to useEffect
16. **AppointmentsManagementPage.tsx** — Removed StatusBadge from option elements
17. **echo.ts** — Fixed token stale issue by checking token change
18. **AdminLayout.tsx** — Added disconnectEcho() on logout

#### Frontend Features
19. **NotFoundPage.tsx** — New 404 page component
20. **ErrorBoundary.tsx** — New global error boundary
21. **App.tsx** — Added 404 route
22. **main.tsx** — Wrapped app with ErrorBoundary
23. **useDebounce.ts** — New debounce hook
24. **useBusinessCatalog.ts** — Added 300ms debounce to search
25. **useBookingData.ts** — Added 300ms debounce to service search
26. **useAdminBusiness.ts** — Added 300ms debounce to appointment search
27. **ProtectedRoute.tsx** — Added hydration loading state
28. **index.html** — Added Vazirmatn font, fixed lang/dir attributes
29. **App.css** — Cleaned up dead CSS
30. **useCurrentUser.ts** — New hook for current user validation
31. **ConfirmationDialog.tsx** — New reusable confirmation dialog
32. **useCancelAppointment.ts** — New hook for appointment cancellation
33. **DateTimeSelectionPage.tsx** — Added confirmation dialog before booking
34. **LiveQueuePage.tsx** — Added cancel button and cancelled state

### Files Changed
- Backend: 13 files modified, 5 new files
- Frontend: 14 files modified, 6 new files

### Tests
- Existing race condition test still passes
- No new tests added (TODO)

### Decisions
- Keep Token-based auth (Sanctum Personal Access Tokens)
- Store times in UTC, convert using business timezone
- Enforce one-to-one User/Employee relationship
- Keep catalog routes authenticated
