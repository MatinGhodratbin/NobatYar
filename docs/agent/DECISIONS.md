# Architecture Decisions

## 1. Authentication Strategy
**Decision:** Keep Sanctum Personal Access Tokens (Bearer tokens)
**Rationale:** Simpler implementation, suitable for API-first architecture. SPA cookie-based auth adds complexity without significant benefit for this use case.

## 2. Timezone Strategy
**Decision:** Store UTC in database, convert using business timezone
**Rationale:** UTC is the standard for storage. Business timezone is used for:
- Displaying times to users
- Validating "is this time in the past?"
- Calculating available slots
- Scheduling reminders

## 3. Employee/User Relationship
**Decision:** Enforce one-to-one (unique constraint on user_id)
**Rationale:** Current scope only needs one employee profile per user. Adding unique constraint prevents data inconsistencies.

## 4. Catalog Routes
**Decision:** Keep authenticated
**Rationale:** Consistent with current implementation. Public catalog can be added later if needed.

## 5. Code Generation
**Decision:** Use date prefix + random string (APT-YYMMDD-XXXXXX)
**Rationale:** Concurrency-safe, readable, includes date information for debugging.

## 6. Authorization
**Decision:** Use Policies for domain-level authorization
**Rationale:** Policies provide clean, testable authorization logic that can be reused across controllers.

## 7. Frontend State
**Decision:** TanStack Query for server state, Zustand for client state
**Rationale:** Clear separation of concerns. TanStack Query handles caching, refetching, and mutations. Zustand handles UI state and auth persistence.

## 8. Error Handling
**Decision:** Global Error Boundary + component-level error handling
**Rationale:** Prevents full app crashes while allowing graceful degradation.
