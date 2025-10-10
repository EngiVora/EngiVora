# Authentication Systems Summary

## Overview

This application implements two separate authentication systems:

1. **Client-Side Authentication** using a custom JWT-based system (for regular users)
2. **Admin Portal Authentication** using a custom JWT-based system (for administrators)

## 1. Client-Side Authentication (Custom JWT)

### Purpose
- Authenticate regular users of the application
- Provide email/password authentication
- Handle user management and profile updates

### Implementation
- Custom JWT-based authentication system
- Email/password authentication with mock users for testing
- Token-based session management
- User profile management

### Routes
- `/login` - User login page
- `/profile` - User profile management
- All other application routes (protected by custom auth)

### Demo Credentials
```
Email: student@example.com
Password: password123
```

### API Endpoints
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-token` - Verify user token

## 2. Admin Portal Authentication (Custom JWT)

### Purpose
- Authenticate administrators for the admin portal
- Provide role-based access control
- Simple email/password authentication with hardcoded credentials for testing

### Implementation
- Custom JWT-based authentication system
- Hardcoded admin credentials for development/testing
- Role verification (admin role only)
- Token-based session management

### Routes
- `/admin/login` - Admin login page
- `/admin/*` - All admin portal routes (protected by custom auth)

### Demo Credentials
```
Email: admin@engivora.com
Password: admin123
```

### API Endpoints
- `POST /api/auth/login` - Authenticate admin user
- `POST /api/auth/logout` - Logout admin user
- `POST /api/auth/verify-token` - Verify admin token

## Security Considerations

### Client-Side (Custom)
- **Development/Testing Only**: This system is intended for development and testing purposes
- **Limited Security**: No password reset, email verification, or advanced security features
- **Token-based**: Uses JWT for session management

### Admin Portal (Custom)
- **Development/Testing Only**: This system is intended for development and testing purposes
- **Not for Production**: Do not use hardcoded credentials in production
- **Limited Security**: No password reset, email verification, or advanced security features
- **Role-Based Access**: Only users with the 'admin' role can access admin routes

## Environment Variables

Both authentication systems require specific environment variables:

```env
# Required for Authentication
JWT_SECRET=change-me-to-a-strong-secret-in-production
JWT_EXPIRES_IN=604800
```

## Testing

### Client-Side Authentication
1. Visit `/login` to test user authentication
2. Use the demo credentials above
3. After login, you'll be redirected to the home page
4. Visit `/profile` to manage your profile

### Admin Portal Authentication
1. Visit `/admin/login` to test admin authentication
2. Use the demo credentials above
3. After login, you'll be redirected to the admin dashboard
4. Use the "Test Authentication" button on the dashboard to verify the system

## Migration to Production

### Client-Side Authentication
1. **Replace mock users** with a proper user management system
2. **Implement proper password hashing** (bcrypt is already used)
3. **Add database storage** for users
4. **Implement proper session management**
5. **Add email verification and password reset functionality**

### Admin Portal Authentication
1. **Replace hardcoded credentials** with a proper user management system
2. **Implement proper password hashing** (bcrypt is already used)
3. **Add database storage** for admin users
4. **Implement proper session management**
5. **Add multi-factor authentication** for enhanced security

## Files Modified/Added

### New Files
- `src/app/login/page.tsx` - Custom login page
- `src/app/profile/page.tsx` - Custom profile page
- `src/app/admin/docs/page.tsx` - Documentation for admin authentication
- `src/app/api/admin/test/route.ts` - Test endpoint for admin authentication
- `AUTHENTICATION_SYSTEMS.md` - Detailed documentation
- `AUTHENTICATION_SUMMARY.md` - This file

### Modified Files
- `middleware.ts` - Updated to handle custom authentication
- `src/components/layout/header.tsx` - Updated to use custom authentication
- `src/components/admin/admin-login.tsx` - Added clarification about authentication system
- `src/components/admin/admin-dashboard.tsx` - Added authentication test functionality
- `src/components/admin/admin-sidebar.tsx` - Added link to auth documentation

## Important Notes

1. **Separation of Concerns**: The two authentication systems are completely independent
2. **Middleware Configuration**: The middleware correctly distinguishes between public, client-protected, and admin routes
3. **Development vs Production**: Both authentication systems are for development/testing only
4. **No External Dependencies**: Removed external authentication providers for a fully self-contained solution