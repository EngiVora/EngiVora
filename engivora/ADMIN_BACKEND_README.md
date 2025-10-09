# Admin Panel Backend Documentation

This document provides an overview of the backend implementation for the Engivora admin panel.

## Overview

The admin panel backend is built using Next.js API routes with a focus on security and scalability. It provides RESTful endpoints for managing the platform's content and users.

## Authentication

The admin panel uses JWT-based authentication:

1. Admins log in via `/api/auth/login`
2. A JWT token is issued upon successful authentication
3. All subsequent requests include the token in the Authorization header
4. Tokens are verified using the `/api/auth/verify-token` endpoint

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/auth/verify-token` - Verify admin token

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### User Management
- `GET /api/admin/users` - Get all users (paginated)
- `POST /api/admin/users` - Create a new user

## Security Features

1. **Role-based Access Control**: Only users with the 'admin' role can access admin endpoints
2. **JWT Verification**: All admin requests are verified using JWT tokens
3. **Token Expiration**: Tokens have a configurable expiration time
4. **Database Fallback**: The system falls back to mock data when the database is unavailable

## Implementation Details

### Database
The backend supports both MongoDB (via Mongoose) and mock data for development:

- Production: MongoDB with Mongoose ODM
- Development: In-memory mock data

### Error Handling
All API endpoints include comprehensive error handling:
- Input validation using Zod
- Proper HTTP status codes
- Detailed error messages

### Environment Variables
The backend requires the following environment variables:
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - Token expiration time (default: 604800 seconds/7 days)
- `MONGODB_URI` - MongoDB connection string (optional for mock data fallback)

## Admin Panel Components

### Frontend Authentication
- `AdminAuthGuard` - Protects admin routes
- `AdminLogin` - Login form component
- `AdminHeader` - Header with logout functionality

### Dashboard
- `AdminDashboard` - Main dashboard with statistics and recent activity

### User Management
- `UserManagement` - User listing and management interface

### Settings
- `AdminSettings` - Admin profile and preferences management

## Extending the Backend

To add new admin functionality:

1. Create a new API route in `/src/app/api/admin/[feature]/route.ts`
2. Implement proper authentication checks
3. Add the new feature to the admin sidebar navigation
4. Create a corresponding frontend component

## Testing

The backend includes mock data for testing purposes. In production, it connects to a MongoDB database.

To test admin functionality:
1. Navigate to `/admin/login`
2. Use credentials: admin@engivora.com / admin123
3. Access various admin features through the sidebar

## Future Improvements

1. Implement comprehensive admin audit logging
2. Add role-based permissions within the admin panel
3. Implement file upload functionality for content management
4. Add real-time notifications using WebSockets
5. Implement rate limiting for API endpoints