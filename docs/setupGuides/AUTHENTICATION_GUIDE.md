# Next.js AuthKit Authentication Guide

A comprehensive guide for setting up authentication with WorkOS AuthKit in Next.js projects.

---

## Table of Contents

1. [Dependencies](#1-dependencies)
2. [Environment Variables](#2-environment-variables)
3. [Project Structure](#3-project-structure)
4. [Middleware Configuration](#4-middleware-configuration)
5. [Root Layout Setup](#5-root-layout-setup)
6. [Authentication Routes](#6-authentication-routes)
7. [Server-Side Authentication](#7-server-side-authentication)
8. [Client-Side Authentication](#8-client-side-authentication)
9. [Protected Pages](#9-protected-pages)
10. [Protected API Routes](#10-protected-api-routes)
11. [Server Actions](#11-server-actions)
12. [Role-Based Access Control](#12-role-based-access-control)
13. [Authentication Flow](#13-authentication-flow)
14. [Key Functions Reference](#14-key-functions-reference)

---

## 1. Dependencies

Install the required packages:

```bash
npm install @workos-inc/authkit-nextjs @workos-inc/node
# or
pnpm add @workos-inc/authkit-nextjs @workos-inc/node
```

**Package versions used:**
- `@workos-inc/authkit-nextjs`: ^2.12.0+
- `@workos-inc/node`: ^7.82.0+
- `next`: ^16.0.0+
- `react`: ^19.0.0+

---

## 2. Environment Variables

Create a `.env.local` file with these variables:

```env
# WorkOS Configuration
WORKOS_CLIENT_ID=client_01KEK4HVW4HFP2T5AMMS6WJ0R7
WORKOS_API_KEY=sk_test_<your-secret-key>
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
WORKOS_COOKIE_PASSWORD=<at-least-32-characters-random-string>

# Optional: Default organization for new users
WORKOS_DEFAULT_ORG_ID=org_01ABC123DEF456
```

| Variable | Description | Required |
|----------|-------------|----------|
| `WORKOS_CLIENT_ID` | Public identifier for OAuth | Yes |
| `WORKOS_API_KEY` | Secret key for server-side API calls | Yes |
| `NEXT_PUBLIC_WORKOS_REDIRECT_URI` | Callback URL after auth | Yes |
| `WORKOS_COOKIE_PASSWORD` | Encryption key for session cookies (min 32 chars) | Yes |
| `WORKOS_DEFAULT_ORG_ID` | Default org for new users | No |

---

## 3. Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── sign-in-button.tsx      # Client component with useAuth
│   ├── actions/
│   │   ├── signOut.ts              # Server action for logout
│   │   └── assignRole.ts           # Server action for role management
│   ├── api/
│   │   └── get-name/
│   │       └── route.ts            # Protected API endpoint
│   ├── account/
│   │   └── page.tsx                # Protected page (requires auth)
│   ├── login/
│   │   └── route.ts                # Login initiator
│   ├── callback/
│   │   └── route.ts                # OAuth callback handler
│   ├── layout.tsx                  # Root layout with AuthKitProvider
│   └── page.tsx                    # Home page (public)
└── middleware.ts                   # Route protection middleware
```

---

## 4. Middleware Configuration

Create `src/middleware.ts`:

```typescript
import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware();

export const config = {
  matcher: [
    "/",              // Home page
    "/account/:path*", // All account pages
    "/api/:path*",     // All API routes
  ],
};
```

The middleware:
- Validates authentication state on matched routes
- Manages session cookies automatically
- Enforces route protection

---

## 5. Root Layout Setup

Wrap your app with `AuthKitProvider` in `src/app/layout.tsx`:

```typescript
import {
  AuthKitProvider,
  Impersonation,
} from "@workos-inc/authkit-nextjs/components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthKitProvider>
          <Impersonation />
          {children}
        </AuthKitProvider>
      </body>
    </html>
  );
}
```

Components:
- `AuthKitProvider` - Provides authentication context to the app
- `Impersonation` - Enables admin impersonation features (optional)

---

## 6. Authentication Routes

### Login Route

Create `src/app/login/route.ts`:

```typescript
import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export const GET = async () => {
  const signInUrl = await getSignInUrl();
  return redirect(signInUrl);
};
```

### Callback Route (Basic)

Create `src/app/callback/route.ts`:

```typescript
import { handleAuth } from "@workos-inc/authkit-nextjs";

export const GET = handleAuth();
```

### Callback Route (With Organization Assignment)

For automatic organization assignment:

```typescript
import { handleAuth, refreshSession } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);
const DEFAULT_ORG_ID = process.env.WORKOS_DEFAULT_ORG_ID!;

export const GET = handleAuth({
  onSuccess: async ({ user, organizationId }) => {
    // Already has org context
    if (organizationId) {
      return;
    }

    // Check for existing memberships
    const { data: memberships } =
      await workos.userManagement.listOrganizationMemberships({
        userId: user.id,
      });

    if (memberships.length > 0) {
      await refreshSession({ organizationId: memberships[0].organizationId });
      return;
    }

    // Create new membership in default org
    await workos.userManagement.createOrganizationMembership({
      userId: user.id,
      organizationId: DEFAULT_ORG_ID,
      roleSlug: "member",
    });

    await refreshSession({ organizationId: DEFAULT_ORG_ID });
  },
});
```

---

## 7. Server-Side Authentication

Use `withAuth()` in Server Components:

```typescript
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function Page() {
  const { user, role, permissions, organizationId } = await withAuth();

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <p>Role: {role}</p>
      <p>Org: {organizationId}</p>
    </div>
  );
}
```

### Enforce Authentication

```typescript
const { user, role } = await withAuth({ ensureSignedIn: true });
// Automatically redirects to login if not authenticated
```

---

## 8. Client-Side Authentication

Use `useAuth()` hook in Client Components:

```typescript
"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function SignInButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return <button disabled>Loading...</button>;
  }

  if (user) {
    return (
      <form action="/actions/signOut" method="POST">
        <button type="submit">Sign Out</button>
      </form>
    );
  }

  return (
    <a href="/login">
      <button>Sign In</button>
    </a>
  );
}
```

---

## 9. Protected Pages

### Public Page with Auth Awareness

```typescript
// src/app/page.tsx
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function HomePage() {
  const { user, role } = await withAuth();

  return (
    <div>
      {user ? (
        <p>Hello, {user.firstName}! Your role is {role}</p>
      ) : (
        <p>Please sign in to continue</p>
      )}
    </div>
  );
}
```

### Protected Page (Requires Auth)

```typescript
// src/app/account/page.tsx
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function AccountPage() {
  const { user, role, permissions } = await withAuth({ ensureSignedIn: true });

  return (
    <div>
      <h1>Account</h1>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
      <p>Role: {role}</p>
      <p>Permissions: {permissions?.join(", ")}</p>
    </div>
  );
}
```

---

## 10. Protected API Routes

```typescript
// src/app/api/get-name/route.ts
import { authkit } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { session } = await authkit(request);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    name: session.user.firstName,
    email: session.user.email,
  });
};
```

---

## 11. Server Actions

### Sign Out Action

```typescript
// src/app/actions/signOut.ts
"use server";

import { signOut } from "@workos-inc/authkit-nextjs";

export const handleSignOutAction = async () => {
  await signOut();
};
```

### Using Sign Out in Components

```typescript
"use client";

import { handleSignOutAction } from "../actions/signOut";

export function SignOutButton() {
  return (
    <form action={handleSignOutAction}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
```

---

## 12. Role-Based Access Control

### Assign/Update Roles

```typescript
// src/app/actions/assignRole.ts
"use server";

import { refreshSession, withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function assignRole(roleSlug: string) {
  const { user, organizationId } = await withAuth();

  if (!user || !organizationId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Get user's organization membership
    const { data: memberships } =
      await workos.userManagement.listOrganizationMemberships({
        userId: user.id,
        organizationId: organizationId,
      });

    const membership = memberships[0];
    if (!membership) {
      return { success: false, error: "Membership not found" };
    }

    // Update role
    await workos.userManagement.updateOrganizationMembership(membership.id, {
      roleSlug: roleSlug,
    });

    // Refresh session to apply new role
    await refreshSession();

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
```

### Check Role in Components

```typescript
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function PremiumContent() {
  const { role } = await withAuth({ ensureSignedIn: true });

  if (role !== "premium") {
    return <p>Upgrade to access this content</p>;
  }

  return <div>Premium content here</div>;
}
```

---

## 13. Authentication Flow

```
1. User visits protected route
   ↓
2. Middleware checks authentication
   ↓
3. If not authenticated → Redirect to /login
   ↓
4. /login generates WorkOS sign-in URL
   ↓
5. User authenticates on WorkOS portal
   ↓
6. WorkOS redirects to /callback with auth code
   ↓
7. handleAuth() processes the callback:
   - Creates session
   - Sets encrypted cookies
   - Runs onSuccess callback (if provided)
   ↓
8. User redirected to home (authenticated)
   ↓
9. withAuth() / useAuth() retrieve user context
```

---

## 14. Key Functions Reference

| Function | Location | Purpose |
|----------|----------|---------|
| `authkitMiddleware()` | Middleware | Route protection |
| `withAuth()` | Server Components | Get auth context server-side |
| `withAuth({ ensureSignedIn: true })` | Server Components | Enforce authentication |
| `useAuth()` | Client Components | Get auth context client-side |
| `getSignInUrl()` | Route Handlers | Generate login URL |
| `handleAuth()` | Route Handlers | Process OAuth callback |
| `authkit(request)` | API Routes | Validate API requests |
| `signOut()` | Server Actions | Clear session |
| `refreshSession()` | Server Actions | Update session data |

### withAuth() Return Type

```typescript
{
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    // ... other user fields
  } | null;
  role: string | null;
  permissions: string[] | null;
  organizationId: string | null;
}
```

### useAuth() Return Type

```typescript
{
  user: User | null;
  loading: boolean;
}
```

---

## Quick Start Checklist

- [ ] Install dependencies: `@workos-inc/authkit-nextjs`, `@workos-inc/node`
- [ ] Create `.env.local` with WorkOS credentials
- [ ] Set up middleware for route protection
- [ ] Wrap app with `AuthKitProvider`
- [ ] Create `/login` route
- [ ] Create `/callback` route
- [ ] Add sign in/out functionality to UI
- [ ] Use `withAuth()` in server components
- [ ] Use `useAuth()` in client components
- [ ] Configure roles in WorkOS dashboard

---

## WorkOS Dashboard Setup

1. Create a WorkOS account at https://workos.com
2. Create a new project
3. Enable AuthKit in the project settings
4. Configure allowed redirect URIs (include your callback URL)
5. Copy Client ID and API Key to your `.env.local`
6. Create organizations and configure roles as needed
