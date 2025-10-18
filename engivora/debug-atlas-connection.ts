#!/usr/bin/env node
/**
 * Debug script to check MongoDB Atlas connection and data flow
 */

import { connectToDatabase } from './src/lib/db.js';
import { Student } from './src/models/Student.js';
import { AdminBlog } from './src/models/AdminBlog.js';
import mongoose from 'mongoose';

async function debugAtlasConnection() {
  console.log('🔍 Debugging MongoDB Atlas Connection...\n');
  
  try {
    // 1. Check environment variables
    console.log('1. Checking environment variables...');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✓ Set' : '✗ Not set'}`);
    console.log(`   MONGODB_DB: ${process.env.MONGODB_DB ? process.env.MONGODB_DB : '✗ Not set'}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Set' : '✗ Not set'}\n`);
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set. Please check your .env.local file.');
      process.exit(1);
    }
    
    // 2. Connect to database
    console.log('2. Attempting to connect to MongoDB Atlas...');
    const connection = await connectToDatabase();
    console.log('   ✅ Connection successful\n');
    
    // 3. Check connection details
    console.log('3. Connection details:');
    console.log(`   Host: ${connection.connection.host}`);
    console.log(`   Port: ${connection.connection.port}`);
    console.log(`   Database: ${connection.connection.name}`);
    console.log(`   Ready State: ${connection.connection.readyState}\n`);
    
    // 4. List collections
    console.log('4. Checking database collections...');
    const db = connection.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      console.log('   Collections found:');
      collections.forEach((collection, index) => {
        console.log(`     ${index + 1}. ${collection.name}`);
      });
      
      if (collections.length === 0) {
        console.log('     (No collections found)');
      }
    } else {
      console.log('   ❌ Database connection not established');
    }
    
    // 5. Check Student model
    console.log('\n5. Testing Student model...');
    try {
      const studentCount = await Student.countDocuments();
      console.log(`   Student documents: ${studentCount}`);
      
      // Try to create a test student
      console.log('   Creating test student...');
      const testStudent = new Student({
        student_id: `DEBUG_${Date.now()}`,
        full_name: 'Debug Test Student',
        email: `debug-${Date.now()}@example.com`,
        password_hash: '$2b$10$Nc6rPZe4SfSPmZzktfQ1B.xj0rWmKM3wpDzUGT1DxPw5p15odCvqa',
        signup_date: new Date(),
        last_login: new Date(),
        courses_enrolled: ['DEBUG101']
      });
      
      const savedStudent = await testStudent.save();
      console.log(`   ✅ Test student created with ID: ${savedStudent.student_id}`);
      
      // Retrieve the student
      const foundStudent = await Student.findOne({ email: `debug-${Date.now()}@example.com` });
      console.log(`   🔍 Retrieved student: ${foundStudent ? 'Found' : 'Not found'}`);
      
      // Clean up
      await Student.deleteOne({ student_id: `DEBUG_${Date.now()}` });
      console.log('   🧹 Test student cleaned up\n');
    } catch (studentError) {
      console.error('   ❌ Student model test failed:', studentError);
    }
    
    // 6. Check AdminBlog model
    console.log('6. Testing AdminBlog model...');
    try {
      const blogCount = await AdminBlog.countDocuments();
      console.log(`   Blog documents: ${blogCount}`);
      
      // Try to create a test blog
      console.log('   Creating test blog...');
      const testBlog = new AdminBlog({
        blog_id: `DEBUG_BLOG_${Date.now()}`,
        title: 'Debug Test Blog',
        slug: `debug-test-blog-${Date.now()}`,
        content: 'This is a debug test blog post.',
        author_id: 'debug-admin-id',
        tags: ['debug', 'test'],
        published_date: new Date(),
        last_updated: new Date(),
        status: 'published'
      });
      
      const savedBlog = await testBlog.save();
      console.log(`   ✅ Test blog created with ID: ${savedBlog.blog_id}`);
      
      // Retrieve the blog
      const foundBlog = await AdminBlog.findOne({ slug: `debug-test-blog-${Date.now()}` });
      console.log(`   🔍 Retrieved blog: ${foundBlog ? 'Found' : 'Not found'}`);
      
      // Clean up
      await AdminBlog.deleteOne({ blog_id: `DEBUG_BLOG_${Date.now()}` });
      console.log('   🧹 Test blog cleaned up\n');
    } catch (blogError) {
      console.error('   ❌ AdminBlog model test failed:', blogError);
    }
    
    // 7. Close connection
    console.log('7. Closing connection...');
    await connection.connection.close();
    console.log('   ✅ Connection closed\n');
    
    console.log('🎉 Debug completed successfully!');
    console.log('If data is not showing in Atlas, check:');
    console.log('1. Your MONGODB_URI points to the correct Atlas cluster');
    console.log('2. Your database user has read/write permissions');
    console.log('3. Your IP address is whitelisted in Atlas');
    console.log('4. You are looking at the correct database in Atlas');
    
  } catch (error) {
    console.error('❌ Debug failed with error:');
    console.error(error);
    
    if (error instanceof Error) {
      if (error.message.includes('Authentication failed')) {
        console.error('\n🔧 Troubleshooting tip:');
        console.error('   Check your MONGODB_URI username and password');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ENODATA')) {
        console.error('\n🔧 Troubleshooting tip:');
        console.error('   Check your MONGODB_URI hostname');
      } else if (error.message.includes('database name')) {
        console.error('\n🔧 Troubleshooting tip:');
        console.error('   Check your MONGODB_DB value');
      }
    }
    
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config();

// Run the debug
debugAtlasConnection().catch(console.error);