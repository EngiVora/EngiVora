# EngiVora - Engineering Student Platform

A comprehensive platform for engineering students featuring job listings, exam notifications, blog articles, and discount codes.

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Blog System**: Create, read, update, and delete blog posts
- **Job Listings**: Browse engineering jobs and internships
- **Exam Notifications**: Stay updated with upcoming exams
- **Discount Codes**: Access exclusive student discounts
- **User Profiles**: Manage your profile and social links
- **Admin Panel**: Administrative controls for content management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd engivora
npm install
```

### 2. Environment Setup

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

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB service
mongod
```

### 4. Seed the Database

```bash
# Seed with sample data
npm run seed

# Or use the API endpoint
curl -X POST http://localhost:3000/api/seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password

### Blog Endpoints

- `GET /api/blogs` - Get all blogs (with pagination and filters)
- `POST /api/blogs` - Create a new blog (authenticated)
- `GET /api/blogs/[id]` - Get a specific blog
- `PUT /api/blogs/[id]` - Update a blog (author or admin)
- `DELETE /api/blogs/[id]` - Delete a blog (author or admin)

### Job Endpoints

- `GET /api/jobs` - Get all jobs (with filters)
- `POST /api/jobs` - Create a new job (admin only)
- `GET /api/jobs/[id]` - Get a specific job
- `PUT /api/jobs/[id]` - Update a job (admin only)
- `DELETE /api/jobs/[id]` - Delete a job (admin only)

### Other Endpoints

- `GET /api/exams` - Get exam notifications
- `GET /api/discounts` - Get discount codes
- `GET /api/profiles` - Get user profiles
- `POST /api/profiles` - Create/update profile
- `GET /api/profiles/me` - Get current user's profile
- `POST /api/seed` - Seed database with sample data

## 🗄️ Database Schema

### User Model
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

### Blog Model
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

### Job Model
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

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Registration**: Users can register with name, email, and password
2. **Login**: Users receive a JWT token upon successful login
3. **Protected Routes**: API endpoints require authentication via Bearer token
4. **Role-based Access**: Admin users have additional privileges

### Demo Credentials

After seeding the database, you can use these credentials:

- **Student**: john@example.com / password123
- **Student**: jane@example.com / password123  
- **Admin**: admin@example.com / admin123

## 🎨 Frontend Integration

### Using the API Client

```typescript
import { apiClient } from '@/lib/api'

// Login
const result = await apiClient.login({
  email: 'john@example.com',
  password: 'password123'
})

// Get blogs
const blogs = await apiClient.getBlogs({
  page: 1,
  limit: 10,
  published: true
})

// Create a blog (requires authentication)
const newBlog = await apiClient.createBlog({
  title: 'My Blog Post',
  slug: 'my-blog-post',
  content: 'Blog content...',
  tags: ['engineering'],
  published: true
})
```

### Authentication Context

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  // Use authentication state
}
```

## 🧪 Testing the API

### Using curl

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get blogs (public)
curl http://localhost:3000/api/blogs

# Create a blog (requires authentication)
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Blog","slug":"test-blog","content":"Test content","published":true}'
```

## 📁 Project Structure

```
engivora/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── blogs/      # Blog endpoints
│   │   │   ├── jobs/       # Job endpoints
│   │   │   ├── exams/      # Exam endpoints
│   │   │   ├── discounts/  # Discount endpoints
│   │   │   └── profiles/   # Profile endpoints
│   │   ├── blogs/          # Blog pages
│   │   ├── jobs/           # Job pages
│   │   ├── exams/          # Exam pages
│   │   └── ...
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility libraries
│   │   ├── db.ts          # Database connection
│   │   ├── auth.ts        # Authentication utilities
│   │   ├── api.ts         # API client
│   │   └── seed.ts        # Database seeding
│   └── models/             # Mongoose models
├── .env.local              # Environment variables
├── package.json
└── README.md
```

## 🚀 Deployment

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/engivora
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-nextauth-secret
NODE_ENV=production
```

### Deployment Steps

1. Set up a MongoDB Atlas cluster or production MongoDB instance
2. Configure environment variables
3. Build the application: `npm run build`
4. Deploy to your preferred platform (Vercel, Netlify, etc.)
5. Set up SSL/HTTPS
6. Configure CORS for your domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup instructions
2. Review the API documentation above
3. Check the server logs for error details
4. Ensure MongoDB is running and accessible
5. Verify environment variables are set correctly

## 🎯 Roadmap

- [ ] File upload for images
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] User activity analytics
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Social features (likes, comments)
- [ ] Integration with external job boards