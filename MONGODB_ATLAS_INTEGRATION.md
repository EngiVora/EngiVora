# MongoDB Atlas Integration Guide

This guide explains how to connect your Next.js application to MongoDB Atlas for storing student registration and admin blog data.

## Prerequisites

1. MongoDB Atlas account
2. MongoDB cluster created
3. Database user with read/write permissions
4. Network access configured (IP whitelist)

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/engivora?retryWrites=true&w=majority
MONGODB_DB=engivora

# JWT Configuration (required for authentication)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=604800

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See [.env.example](file:///c:/Users/NITISH%20SINGH/engivora/EngiVora/engivora/.env.example) for a template.

## Connection Helper (db.ts)

The database connection helper is located at `src/lib/db.ts` and provides:

1. **Connection Caching**: Reuses connections across API routes
2. **Error Handling**: Graceful error handling with detailed logs
3. **Configuration**: Uses environment variables for connection details

### Key Features

- Uses Mongoose for MongoDB object modeling
- Implements connection pooling for better performance
- Handles connection errors gracefully
- Supports MongoDB Atlas connection strings

## API Routes Integration

All API routes automatically use the connection helper:

### Student Authentication Routes
- `POST /api/students/signup` - Student registration
- `POST /api/students/login` - Student login
- `POST /api/students/reset-password` - Password reset

### Admin Blog Routes
- `GET /api/admin/blogs` - List all blogs
- `POST /api/admin/blogs` - Create new blog
- `GET /api/admin/blogs/[id]` - Get specific blog
- `PUT /api/admin/blogs/[id]` - Update blog
- `DELETE /api/admin/blogs/[id]` - Delete blog

## Testing the Connection

### 1. Command Line Test

Run the TypeScript test script:

```bash
npx ts-node test-atlas-connection.ts
```

### 2. API Test

Start your Next.js server and visit:
```
GET http://localhost:3000/api/test-connection
```

### 3. Manual Verification

Check your MongoDB Atlas dashboard to see:
- Active connections
- Database operations
- Collection creation

## Restarting the Server

After updating environment variables:

1. Stop the Next.js development server (Ctrl+C)
2. Restart with:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify username and password in MONGODB_URI
   - Check database user permissions in Atlas

2. **Network Connection**
   - Ensure IP whitelist includes your development machine
   - Check firewall settings

3. **Database Not Found**
   - Verify MONGODB_DB value matches your Atlas database name

### Error Messages

- **"Database is not configured"**: MONGODB_URI is missing from .env.local
- **"Authentication failed"**: Incorrect username/password in connection string
- **"ENOTFOUND"**: Incorrect hostname in connection string

## Data Flow

1. Student registers via `/api/students/signup`
2. Data is stored in MongoDB Atlas `students` collection
3. Student logs in via `/api/students/login`
4. Admin creates blogs via `/api/admin/blogs`
5. Blog data is stored in MongoDB Atlas `adminblogs` collection

## Security Considerations

- Never commit `.env.local` to version control
- Use strong, unique passwords for database users
- Regularly rotate JWT secrets
- Monitor Atlas connection logs

## Monitoring

MongoDB Atlas provides:
- Real-time performance metrics
- Connection monitoring
- Database operation logs
- Alerting for anomalies