# Project Structure

## Architecture Overview

- **Frontend**: Next.js 16 with App Router
- **Backend**: Convex for database and serverless functions
- **Authentication**: WorkOS AuthKit via middleware
- **Data Fetching**: TanStack Query with Convex HTTP client

## Data Flow and Management

React Hook Form manages form state, Zod validates data, Convex mutations persist to database, and TanStack Query handles caching/refetching. Convex provides real-time database and serverless functions.

## Authentication

WorkOS AuthKit handles authentication via middleware. Protected routes are configured in `proxy.ts`.

## Key Directories

- **`app/`**: Next.js App Router pages and routes
  - `actions/`: Server actions
  - `callback/`: Auth callback route
  - `compare/`: Resume comparison page
  - `icons-showcase/`: Icon showcase page
  - `login/`: Login page
- **`components/`**: React components
  - `ui/`: ShadCN UI components
    - `app-sidebar/`: Sidebar components (ResumeSelector, FontSelector, etc.)
  - `ControlledFields/`: Form field wrappers (ControlledInput, ControlledSelect, ControlledTextarea, etc.)
  - `Home/`: Home page component
  - `PdfViewer/`: PDF viewer components
  - `AiSuggestionsDialog/`: AI resume suggestions dialog (job description → suggested changes)
  - `ResumeForm/`: Form sections and fields
    - `components/`: Form section components (PersonalInfo, Experience, Education)
      - `UI/`: Accordion components for sections
      - `EducationFields/`: Education field groups
      - `ExperienceFields/`: Experience field groups
      - `PersonalInfoFields/`: Personal info field groups
  - `ResumePreview/`: Preview components
- **`providers/`**: Context providers
- **`hooks/`**: Custom React hooks
- **`types/`**: TypeScript types and Zod schemas
- **`convex/`**: Backend functions, schema, validators
  - `suggestResumeChanges.ts`: Action using AI (Gemini) to suggest resume changes from job description
- **`lib/ResumePDF/`**: PDF generation logic
  - `components/`: PDF component building blocks
  - `documents/`: PDF document templates
  - `icons/`: PDF icons
- **`linter/`**: ESLint rule configurations
- **`tests/`**: Testing setup and utilities
- **`public/`**: Static assets
  - `Inter/`: Inter font files
  - `Roboto_Condensed/`: Roboto Condensed font files
- **`docs/`**: Documentation
  - `setupGuides/`: Setup guides
