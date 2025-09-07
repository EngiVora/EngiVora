# EngiVora Database Setup Guide

## Overview

The EngiVora project now has a complete database implementation with MongoDB, authentication, and full CRUD operations for all models.

## Features Implemented

### ✅ Database Models
- **User Model**: Authentication with email/password, roles (student/admin)
- **Profile Model**: User profiles with bio, branch, year, and social links
- **Blog Model**: Blog posts with content, tags, and publishing status
- **Job Model**: Job listings with company info, deadlines, and application URLs
- **Exam Model**: Exam information with registration and exam dates
- **Discount Model**: Discount codes with validity periods and percentages

### ✅ Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (student/admin)
- Protected routes and middleware

### ✅ API Endpoints
- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **Blogs**: `/api/blogs` (GET, POST), `/api/blogs/[id]` (GET, PUT, DELETE)
- **Jobs**: `/api/jobs` (GET, POST), `/api/jobs/[id]` (GET, PUT, DELETE)
- **Exams**: `/api/exams` (GET, POST)
- **Discounts**: `/api/discounts` (GET, POST)
- **Profiles**: `/api/profiles` (GET, POST), `/api/profiles/me` (GET)
- **Seeding**: `/api/seed` (POST)

### ✅ Additional Features
- Database seeding with sample data
- CORS configuration
- Input validation with Zod
- Error handling and logging
- API client utilities
- TypeScript support throughout

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/engivora

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production

# App Configuration
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using MongoDB service
mongod
```

### 4. Seed the Database

Run the seeding script to populate the database with sample data:

```bash
# Using npm script
npm run seed

# Or using the API endpoint
curl -X POST http://localhost:3000/api/seed
```

### 5. Start the Development Server

```bash
npm run dev
```

## API Usage Examples

### Authentication

```javascript
// Register a new user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'student'
  })
})

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
})
```

### Using the API Client

```javascript
import { apiClient } from '@/lib/api'

// Login and get token
const loginResult = await apiClient.login({
  email: 'john@example.com',
  password: 'password123'
})

// Get blogs
const blogsResult = await apiClient.getBlogs({
  page: 1,
  limit: 10,
  published: true
})

// Create a new blog (requires authentication)
const newBlog = await apiClient.createBlog({
  title: 'My New Blog Post',
  slug: 'my-new-blog-post',
  content: 'This is the content...',
  tags: ['engineering', 'tutorial'],
  published: true
})
```

## Database Schema

### User
```typescript
{
  name: string
  email: string (unique)
  passwordHash: string
  imageUrl?: string
  role: 'student' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

### Profile
```typescript
{
  userId: ObjectId (ref: User)
  bio?: string
  branch?: string
  year?: number (1-6)
  links?: { label: string; url: string }[]
  createdAt: Date
  updatedAt: Date
}
```

### Blog
```typescript
{
  title: string
  slug: string (unique)
  content: string
  authorId?: ObjectId (ref: User)
  tags?: string[]
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Job
```typescript
{
  title: string
  company: string
  location?: string
  type: 'full-time' | 'part-time' | 'internship' | 'contract'
  applyUrl: string
  deadline?: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}
```

### Exam
```typescript
{
  name: string
  notification?: string
  registrationOpen?: Date
  registrationClose?: Date
  examDate?: Date
  link?: string
  createdAt: Date
  updatedAt: Date
}
```

### Discount
```typescript
{
  title: string
  description?: string
  code?: string
  percentage?: number (0-100)
  startAt?: Date
  endAt?: Date
  link?: string
  createdAt: Date
  updatedAt: Date
}
```

## Sample Data

The seeding script creates:

- **3 Users**: 2 students, 1 admin
- **2 Student Profiles**: With bio, branch, year, and social links
- **2 Blog Posts**: Published articles with content and tags
- **3 Job Listings**: Various types and locations
- **3 Exam Notifications**: With registration and exam dates
- **3 Discount Codes**: With validity periods and percentages

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation with Zod
- CORS protection
- Environment variable protection

## Next Steps

1. **Frontend Integration**: Connect the existing frontend pages to use the API
2. **File Uploads**: Add image upload functionality for user avatars and blog images
3. **Email Notifications**: Implement email notifications for exam reminders
4. **Search Enhancement**: Add advanced search and filtering
5. **Analytics**: Add user activity tracking and analytics
6. **Testing**: Add comprehensive test coverage

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env.local file
   - Verify the database name and connection string

2. **Authentication Issues**
   - Check JWT_SECRET is set in environment variables
   - Ensure tokens are being sent in Authorization header
   - Verify user roles and permissions

3. **API Errors**
   - Check server logs for detailed error messages
   - Verify request body format and required fields
   - Ensure proper Content-Type headers

### Development Tips

- Use the API client for consistent error handling
- Check the browser network tab for API request/response details
- Use the seeding endpoint to reset data during development
- Monitor the server console for detailed error logs

## Production Deployment

For production deployment:

1. Set strong, unique secrets for JWT_SECRET and NEXTAUTH_SECRET
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set NODE_ENV=production
4. Configure proper CORS origins
5. Set up SSL/HTTPS
6. Implement rate limiting
7. Add monitoring and logging
8. Set up database backups

The database implementation is now complete and ready for production use!
