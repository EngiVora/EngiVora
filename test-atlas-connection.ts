#!/usr/bin/env node
/**
 * Test script to verify MongoDB Atlas connection and list collections
 * 
 * Usage:
 *   npx ts-node test-atlas-connection.ts
 *   # or
 *   npm run dev (then visit http://localhost:3000/test-connection)
 */

import { connectToDatabase } from './src/lib/db';
import { Student } from './src/models/Student';
import { AdminBlog } from './src/models/AdminBlog';
import mongoose from 'mongoose';

async function testAtlasConnection() {
  console.log('🚀 Testing MongoDB Atlas Connection...\n');
  
  try {
    // Connect to database
    console.log('1. Connecting to MongoDB Atlas...');
    const connection = await connectToDatabase();
    console.log('✅ Successfully connected to MongoDB Atlas\n');
    
    // Get database name
    const db = connection.connection.db;
    if (!db) {
      throw new Error('Database connection is not established');
    }
    
    const dbName = db.databaseName;
    console.log(`📂 Database: ${dbName}`);
    
    // List all collections
    console.log('\n2. Retrieving collections list...');
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections found:');
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });
    
    if (collections.length === 0) {
      console.log('   (No collections found)');
    }
    
    // Test Student model
    console.log('\n3. Testing Student model operations...');
    const studentCount = await Student.countDocuments();
    console.log(`   📊 Student documents count: ${studentCount}`);
    
    // Test AdminBlog model
    console.log('\n4. Testing AdminBlog model operations...');
    const blogCount = await AdminBlog.countDocuments();
    console.log(`   📊 AdminBlog documents count: ${blogCount}`);
    
    // Show connection status
    console.log('\n5. Connection details:');
    console.log(`   🌐 Host: ${connection.connection.host}`);
    console.log(`   📡 Port: ${connection.connection.port}`);
    console.log(`   🔌 Ready state: ${connection.connection.readyState}`);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ Your Next.js application is ready to use MongoDB Atlas for student and blog data storage.');
    
    // Close connection
    await connection.connection.close();
    console.log('\n🔒 Connection closed.');
    
  } catch (error) {
    console.error('❌ Error during MongoDB Atlas test:');
    console.error(error);
    
    if (error instanceof Error) {
      if (error.message.includes('Authentication failed')) {
        console.error('\n🔧 Troubleshooting tip:');
        console.error('   Check your MONGODB_URI username and password in .env.local');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ENODATA')) {
        console.error('\n🔧 Troubleshooting tip:');
        console.error('   Check your MONGODB_URI hostname in .env.local');
      } else if (error.message.includes('database name')) {
        console.error('\n🔧 Troubleshooting tip:');
        console.error('   Check your MONGODB_DB value in .env.local');
      }
    }
    
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAtlasConnection().catch(console.error);
}

export default testAtlasConnection;