// Debug script for authentication issues
import dotenv from 'dotenv';
dotenv.config();

async function debugAuth() {
  try {
    console.log('Starting authentication debug...');
    
    // Check environment variables
    console.log('\n1. Checking environment variables...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI is not set. Please check your .env file');
      return;
    }
    
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET is not set. Please check your .env file');
      return;
    }
    
    // Test database connection
    console.log('\n2. Testing database connection...');
    try {
      const { connectToDatabase } = await import('./src/lib/db.js');
      await connectToDatabase();
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.log('❌ Database connection failed:', dbError.message);
      console.log('Error details:', dbError);
      return;
    }
    
    // Test user model
    console.log('\n3. Testing user model...');
    try {
      const { User } = await import('./src/models/User.js');
      console.log('✅ User model imported successfully');
      
      // Test creating a user (without saving)
      const newUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'testhash',
        role: 'student'
      });
      console.log('✅ User model instantiation successful');
    } catch (modelError) {
      console.log('❌ User model test failed:', modelError.message);
      return;
    }
    
    console.log('\n✅ All tests passed! Authentication system should work correctly.');
    console.log('\nIf you\'re still getting internal server errors, try:');
    console.log('1. Restarting the development server');
    console.log('2. Checking MongoDB is running');
    console.log('3. Verifying MongoDB connection string is correct');
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

// Run the debug
debugAuth().catch(console.error);