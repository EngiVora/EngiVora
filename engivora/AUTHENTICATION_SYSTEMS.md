# Authentication Systems

This document explains the two separate authentication systems used in the Engivora application.

## 1. Client-Side Authentication (Custom JWT)

### Overview
The main application uses a custom JWT-based authentication system. This provides:
- Email/password authentication
- Session management with JWT tokens
- User profile management

### Implementation
- **Library**: `jsonwebtoken` (already included in dependencies)
- **Routes**: `/login`, `/profile`
- **Protection**: Middleware protects all non-public routes
- **Storage**: Tokens stored in localStorage/sessionStorage

### Testing
- Visit `/login` to access the login page
- Demo credentials: `student@example.com` / `password123`
- After login, you can access your profile at `/profile`

## 2. Admin Portal Authentication (Hardcoded)

### Overview
The admin portal uses a separate, hardcoded authentication system. This provides:
- Simple email/password authentication
- Admin role verification
- JWT-based session management
- Hardcoded demo credentials

### Implementation
- **Routes**: `/admin/**`
- **Credentials**: 
  - Email: `admin@engivora.com`
  - Password: `admin123`
- **Protection**: Custom admin auth guard
- **Endpoints**: 
  - `POST /api/auth/login` - Admin login
  - `POST /api/auth/logout` - Admin logout
  - `POST /api/auth/verify-token` - Token verification

### Testing
- Visit `/admin/login` to access the admin login
- Use the demo credentials above
- After login, you'll be redirected to the admin dashboard

## Security Considerations

### Client-Side (Custom JWT)
- **Development/Testing Only**: This system is intended for development and testing purposes
- **Limited Security**: No password reset, email verification, or advanced security features
- **Token-based**: Uses JWT for session management

### Admin Portal (Hardcoded)
- **Development/Testing Only**: This system is intended for development and testing purposes
- **Not for Production**: Do not use hardcoded credentials in production
- **Limited Security**: No password reset, email verification, or advanced security features
- **Role-Based Access**: Only users with the 'admin' role can access admin routes

## Environment Variables

### Authentication Configuration
```env
# JWT Configuration (required for both client and admin auth)
JWT_SECRET=change-me-to-a-strong-secret-in-production
JWT_EXPIRES_IN=604800
```

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

## Troubleshooting

### Login Not Working
1. Ensure `JWT_SECRET` is set in your environment variables
2. Check that the email and password match the demo credentials
3. Verify that the user has the correct role

### Authentication Issues
1. Ensure the middleware correctly distinguishes between public, client-protected, and admin routes
2. Check that the admin auth guard only protects admin routes
3. Verify that tokens are properly stored and retrieved