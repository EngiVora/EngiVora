# Admin Authentication System

This document describes the new authentication routing system implemented for the EngiVora admin panel.

## Overview

The admin authentication system provides secure, client-side and server-side routing with proper authentication checks. It ensures that:

- `/admin` redirects to `/admin/login` (login-first approach)
- Protected admin pages require authentication
- Unauthenticated users are redirected to login
- Authenticated users can't access the login page (redirected to dashboard)
- Proper logout functionality with token cleanup

## Key Components

### 1. Authentication Hook (`useAdminAuth`)
**Location:** `src/hooks/useAdminAuth.ts`

Centralized authentication state management with:
- Login/logout functionality
- User state management
- Token validation
- Authentication status checking

```typescript
const { user, isAuthenticated, isLoading, login, logout, checkAuth } = useAdminAuth();
```

### 2. Protected Route Component (`ProtectedRoute`)
**Location:** `src/components/admin/protected-route.tsx`

Wrapper component that handles authentication checks and redirects:
- Protects admin pages from unauthorized access
- Handles loading states during authentication checks
- Manages redirects based on authentication status

### 3. Updated Admin Layout
**Location:** `src/app/admin/layout.tsx`

Enhanced layout with:
- Conditional rendering based on authentication
- Different layouts for login vs. authenticated pages
- Integrated protected routing

### 4. Middleware
**Location:** `src/middleware.ts`

Server-side authentication checks:
- Validates admin tokens from cookies
- Handles redirects at the server level
- Prevents unauthorized access before page load

## Routing Flow

### Accessing `/admin`
1. User navigates to `/admin`
2. Page immediately redirects to `/admin/login`
3. No dashboard content is loaded

### Login Process
1. User enters credentials on `/admin/login`
2. Credentials validated via `/api/auth/login`
3. On success: token stored, user redirected to `/admin/dashboard`
4. On failure: error message displayed

### Protected Pages
1. User tries to access `/admin/dashboard` or other admin pages
2. `ProtectedRoute` checks authentication status
3. If authenticated: page loads normally
4. If not authenticated: redirect to `/admin/login`

### Logout Process
1. User clicks logout in header dropdown
2. `/api/auth/logout` called to clear server-side cookies
3. Client-side tokens removed from localStorage/sessionStorage
4. User redirected to `/admin/login`

## API Endpoints

### Login
- **Endpoint:** `POST /api/auth/login`
- **Body:** `{ email: string, password: string }`
- **Response:** `{ success: boolean, user: object, token: string }`
- **Sets:** HTTP-only cookie `adminToken`

### Logout
- **Endpoint:** `POST /api/auth/logout`
- **Response:** `{ success: boolean, message: string }`
- **Clears:** HTTP-only cookie `adminToken`

## Development Credentials

For development and testing:
- **Email:** `admin@engivora.com`
- **Password:** `admin123`

The login page includes a "Fill credentials" button for quick testing.

## Security Features

1. **HTTP-only Cookies:** Tokens stored in secure HTTP-only cookies
2. **Client-side Validation:** Additional localStorage token checking
3. **Server-side Middleware:** Route protection at server level
4. **Proper Token Cleanup:** Complete logout with token removal
5. **Redirect Protection:** Prevents unauthorized access attempts

## File Structure

```
src/
├── hooks/
│   └── useAdminAuth.ts          # Authentication hook
├── components/admin/
│   ├── protected-route.tsx      # Route protection wrapper
│   ├── auth-status.tsx          # Debug component (dev only)
│   └── admin-header.tsx         # Updated with logout
├── app/admin/
│   ├── layout.tsx               # Updated admin layout
│   ├── page.tsx                 # Redirects to login
│   ├── login/page.tsx           # Login page
│   └── dashboard/page.tsx       # Protected dashboard
├── app/api/auth/
│   ├── login/route.ts           # Login API
│   └── logout/route.ts          # Logout API
└── middleware.ts                # Server-side protection
```

## Debug Features

In development mode, an auth debug component shows:
- Current authentication status
- User information
- Token presence
- Current route
- Quick navigation buttons

## Testing the System

### Manual Testing Steps

1. **Test /admin redirect:**
   - Navigate to `localhost:3000/admin`
   - Should redirect to `/admin/login`

2. **Test login:**
   - Use development credentials
   - Should redirect to `/admin/dashboard`

3. **Test protected routes:**
   - Clear localStorage tokens
   - Try to access `/admin/dashboard`
   - Should redirect to `/admin/login`

4. **Test logout:**
   - Login successfully
   - Click logout in header dropdown
   - Should redirect to `/admin/login`

5. **Test authenticated login access:**
   - Login successfully
   - Try to navigate to `/admin/login`
   - Should redirect to `/admin/dashboard`

### Browser DevTools

Monitor localStorage for `adminToken` and check Network tab for:
- Login API calls
- Logout API calls
- Cookie setting/clearing

## Environment Variables

Ensure these are set in your `.env.local`:
- `JWT_SECRET`: Secret key for token signing
- `JWT_EXPIRES_IN`: Token expiration (optional, defaults to 7 days)

## Troubleshooting

### Common Issues

1. **Redirect loops:** Check middleware matcher configuration
2. **Token persistence:** Verify localStorage/cookie handling
3. **API errors:** Check network tab and server logs
4. **Hydration errors:** Ensure client-side checks after mounting

### Debug Tools

Use the `AuthDebugInfo` component (development only) to inspect:
- Authentication state
- Token presence
- Current route
- User information

## Next Steps

- Add remember-me functionality
- Implement token refresh
- Add role-based access control
- Enhanced error handling
- Session timeout warnings