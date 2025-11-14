# Authentication Troubleshooting Guide

## Common Issues and Solutions

### 1. Internal Server Error (500)

#### Possible Causes:
1. Missing environment variables
2. Database connection issues
3. MongoDB not running
4. Incorrect MongoDB connection string

#### Solutions:

**Check Environment Variables:**
1. Ensure you have a `.env.local` file in your project root
2. Verify it contains the required variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/originalEngivora
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

**Verify MongoDB is Running:**
1. Check if MongoDB service is active:
   ```bash
   # On Windows
   net start | findstr MongoDB
   
   # On macOS/Linux
   ps aux | grep mongod
   ```

**Test Database Connection:**
1. Run the debug script:
   ```bash
   node debug-auth.js
   ```

### 2. Database Connection Failed

#### Possible Causes:
1. MongoDB not installed
2. MongoDB not running
3. Incorrect connection string
4. Firewall blocking connection

#### Solutions:

**Install MongoDB:**
1. Download from [MongoDB website](https://www.mongodb.com/try/download/community)
2. Follow installation instructions for your OS

**Start MongoDB:**
```bash
# On Windows
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

**Check Connection String:**
1. Default local connection: `mongodb://localhost:27017/originalEngivora`
2. For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database`

### 3. User Already Exists Error

#### Cause:
Attempting to create a user with an email that already exists in the database.

#### Solution:
1. Use a different email address
2. Or clear the database:
   ```bash
   # Connect to MongoDB shell
   mongo
   
   # Switch to database
   use originalEngivora
   
   # Delete all users
   db.users.deleteMany({})
   ```

### 4. Password Validation Errors

#### Cause:
Password does not meet minimum requirements (at least 6 characters).

#### Solution:
Use a password with at least 6 characters when signing up.

## Debugging Steps

### 1. Check Server Logs
```bash
# In your terminal where Next.js is running
# Look for error messages when the internal server error occurs
```

### 2. Test API Endpoints Directly
```bash
# Test signup endpoint
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Run Debug Script
```bash
node debug-auth.js
```

## Environment Setup Checklist

- [ ] `.env.local` file created
- [ ] `MONGODB_URI` set correctly
- [ ] `JWT_SECRET` set (use a strong secret)
- [ ] MongoDB service running
- [ ] Network connectivity to database (if using remote database)
- [ ] Required Node.js packages installed (`npm install`)

## Development Tips

1. **Always restart the development server** after changing environment variables
2. **Check the terminal output** for detailed error messages
3. **Use the debug script** to verify your setup
4. **Clear browser cookies/localStorage** if authentication seems stuck

If you continue to experience issues, please share:
1. The exact error message from your terminal
2. Your `.env.local` configuration (without secrets)
3. The output of the debug script