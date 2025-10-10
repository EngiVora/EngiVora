// Test MongoDB Atlas connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function testAtlasConnection() {
  console.log('Testing MongoDB Atlas connection...');
  
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI is not set in environment variables');
    return;
  }
  
  console.log('MONGODB_URI found');
  
  try {
    // Try to connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'originalEngivora',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
    
  } catch (error) {
    console.log('❌ MongoDB Atlas connection failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Error name:', error.name);
    
    // Provide specific troubleshooting advice based on error
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Check if your internet connection is working');
      console.log('2. Verify the MongoDB Atlas connection string is correct');
      console.log('3. Ensure the IP address is whitelisted in MongoDB Atlas');
      console.log('4. Check if the username and password are correct');
      console.log('5. Make sure the MongoDB Atlas cluster is running');
    }
  }
}

testAtlasConnection().catch(console.error);