# Instructions for Verifying Data in MongoDB Atlas

Based on our troubleshooting, your application is correctly configured to use MongoDB Atlas, but you might not be seeing data because of how different authentication routes work.

## Why You're Not Seeing Data in Atlas

1. **Student authentication routes** (`/api/students/*`) correctly use MongoDB Atlas
2. **Regular user authentication routes** (`/api/auth/*`) fall back to mock data if there's any database issue

## How to Verify Data is Stored in Atlas

### Method 1: Use Student Authentication Routes

1. **Register a new student:**
   ```bash
   curl -X POST http://localhost:3001/api/students/signup \
     -H "Content-Type: application/json" \
     -d '{
       "full_name": "Test Atlas Student",
       "email": "atlas-test@example.com",
       "password": "password123",
       "courses_enrolled": ["CS101", "MATH202"]
     }'
   ```

2. **Login as the student:**
   ```bash
   curl -X POST http://localhost:3001/api/students/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "atlas-test@example.com",
       "password": "password123"
     }'
   ```

3. **Check Atlas dashboard:**
   - Go to your MongoDB Atlas cluster
   - Select the "originalEngivora" database
   - Check the "students" collection
   - You should see your new student record

### Method 2: Use Admin Blog Routes

1. **Login as admin** through the web interface:
   - Visit `http://localhost:3001/admin/login`
   - Use credentials: `admin@engivora.com` / `admin123`

2. **Create a blog post** through the admin panel

3. **Check Atlas dashboard:**
   - Go to your MongoDB Atlas cluster
   - Select the "originalEngivora" database
   - Check the "adminblogs" collection
   - You should see your new blog post

## How to Fix Regular Authentication Routes (Optional)

If you want the regular authentication routes to also use MongoDB Atlas without fallback:

1. Modify `/src/app/api/auth/login/route.ts` to remove the mock fallback
2. Modify `/src/app/api/auth/signup/route.ts` to ensure it always uses the database

## Troubleshooting Checklist

- [ ] You're looking at the correct database (`originalEngivora`) in Atlas
- [ ] You're using the student authentication routes or admin panel
- [ ] Your IP address is whitelisted in MongoDB Atlas
- [ ] Your database user has read/write permissions
- [ ] Your MONGODB_URI in `.env.local` is correct

## Verification Commands

Run these commands to verify your setup:

```bash
# Check environment variables
node verify-atlas.js

# Test database connection
node debug-atlas-connection.js

# Test data storage
node test-data-to-atlas.js
```

## Next Steps

1. Register a student using the `/api/students/signup` endpoint
2. Check your Atlas dashboard for the new record
3. Confirm the data is persisting between server restarts