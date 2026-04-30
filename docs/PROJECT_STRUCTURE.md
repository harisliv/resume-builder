# Project Structure

## Architecture Overview

- **Frontend**: Next.js 16 with App Router
- **Backend**: Convex for database and serverless functions
- **Authentication**: WorkOS AuthKit via middleware
- **Data Fetching**: TanStack Query with Convex HTTP client

## Data Flow and Management

React Hook Form manages form state, Zod validates data, Convex mutations persist to database, and TanStack Query handles caching/refetching. Convex provides real-time database and serverless functions.

## Feature Folder Shape

- Large frontend features should prefer colocated folders like:
  `Feature/Feature.tsx` for orchestration
  `Feature/ui/` for presentational feature-specific subcomponents
  `Feature/styles/` for styled wrappers with non-trivial Tailwind
  `Feature/*.utils.ts` for pure helpers
  `Feature/*.test.tsx` for focused tests

## Authentication & Authorization

WorkOS AuthKit handles authentication via middleware (`proxy.ts`).

- **Admin-only routes**: and `/compare` redirect non-admin users to `/`.
- **Public auth routes**: `/callback` remains unauthenticated so AuthKit can finalize session.
