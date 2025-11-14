# Student Accounts & Admin Blog API Documentation

This document provides documentation for the newly created Student Accounts Database and Admin Panel Blog Database APIs.

## Student Accounts Database

### Model Structure
```typescript
interface StudentDocument {
  student_id: string          // Primary key, unique ID
  full_name: string           // Student's full name
  email: string               // Unique email address
  password_hash: string       // Securely hashed password
  signup_date: Date           // Account creation date
  last_login: Date            // Last login timestamp
  courses_enrolled: string[]  // Array of enrolled courses
  createdAt: Date             // MongoDB timestamp
  updatedAt: Date             // MongoDB timestamp
}
```

### API Endpoints

#### Student Signup
- **Endpoint**: `POST /api/students/signup`
- **Description**: Creates a new student account
- **Request Body**:
  ```json
  {
    "full_name": "string",
    "email": "string",
    "password": "string",
    "courses_enrolled": ["string"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "student": {
      "student_id": "string",
      "full_name": "string",
      "email": "string",
      "signup_date": "date",
      "courses_enrolled": ["string"]
    },
    "token": "jwt_token"
  }
  ```

#### Student Login
- **Endpoint**: `POST /api/students/login`
- **Description**: Authenticates a student and returns a JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "student": {
      "student_id": "string",
      "full_name": "string",
      "email": "string",
      "signup_date": "date",
      "last_login": "date",
      "courses_enrolled": ["string"]
    },
    "token": "jwt_token"
  }
  ```

#### Password Reset
- **Endpoint**: `POST /api/students/reset-password`
- **Description**: Requests a password reset or resets password
- **Request Body (Request Reset)**:
  ```json
  {
    "email": "string"
  }
  ```
- **Request Body (Reset Password)**:
  ```json
  {
    "email": "string",
    "token": "string",
    "new_password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "If your email is registered, you will receive password reset instructions."
  }
  ```

## Admin Panel Blog Database

### Model Structure
```typescript
interface AdminBlogDocument {
  blog_id: string             // Primary key, unique ID
  title: string               // Blog post title
  slug: string                // URL-friendly slug
  content: string             // Blog post content
  author_id: string           // References admin user ID
  tags: string[]              // Array of tags
  published_date: Date        // Publication date
  last_updated: Date          // Last update timestamp
  status: 'draft' | 'published' | 'archived'
  createdAt: Date             // MongoDB timestamp
  updatedAt: Date             // MongoDB timestamp
}
```

### API Endpoints

#### Get All Blogs
- **Endpoint**: `GET /api/admin/blogs`
- **Description**: Retrieves all blog posts with optional filtering
- **Query Parameters**:
  - `status`: Filter by status (draft/published/archived)
  - `author_id`: Filter by author ID
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "blog_id": "string",
        "title": "string",
        "slug": "string",
        "content": "string",
        "author_id": "string",
        "tags": ["string"],
        "published_date": "date",
        "last_updated": "date",
        "status": "string",
        "createdAt": "date",
        "updatedAt": "date"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
  ```

#### Create Blog
- **Endpoint**: `POST /api/admin/blogs`
- **Description**: Creates a new blog post
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "status": "draft|published|archived"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Blog created successfully",
    "data": {
      "blog_id": "string",
      "title": "string",
      "slug": "string",
      "content": "string",
      "author_id": "string",
      "tags": ["string"],
      "published_date": "date",
      "last_updated": "date",
      "status": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

#### Get Specific Blog
- **Endpoint**: `GET /api/admin/blogs/[id]`
- **Description**: Retrieves a specific blog post by ID or slug
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "blog_id": "string",
      "title": "string",
      "slug": "string",
      "content": "string",
      "author_id": "string",
      "tags": ["string"],
      "published_date": "date",
      "last_updated": "date",
      "status": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

#### Update Blog
- **Endpoint**: `PUT /api/admin/blogs/[id]`
- **Description**: Updates a specific blog post
- **Request Body**:
  ```json
  {
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "status": "draft|published|archived"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Blog updated successfully",
    "data": {
      "blog_id": "string",
      "title": "string",
      "slug": "string",
      "content": "string",
      "author_id": "string",
      "tags": ["string"],
      "published_date": "date",
      "last_updated": "date",
      "status": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
  ```

#### Delete Blog
- **Endpoint**: `DELETE /api/admin/blogs/[id]`
- **Description**: Deletes a specific blog post
- **Response**:
  ```json
  {
    "success": true,
    "message": "Blog deleted successfully"
  }
  ```

## Authentication

All admin blog endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token can be obtained by logging in as an admin user through the existing admin login system.