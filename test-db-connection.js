// Test MongoDB connection
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from './src/models/User';

async function testDBConnection() {
  console.log('Testing MongoDB connection...');
  
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.log('❌ MONGODB_URI is not set in environment variables');
      return;
    }
    
    console.log('MONGODB_URI found:', process.env.MONGODB_URI.substring(0, 50) + '...');
    
    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET is not set in environment variables');
      return;
    }
    
    console.log('JWT_SECRET is set');
    
    // Try to connect to MongoDB
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || 'originalEngivora',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Try a simple operation
    try {
      const userCount = await User.countDocuments();
      console.log(`✅ User collection accessible. Current user count: ${userCount}`);
    } catch (modelError) {
      console.log('⚠️  User model test failed:', modelError.message);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('Error details:', error);
  }
}

testDBConnection().catch(console.error);