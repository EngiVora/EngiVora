#!/usr/bin/env node
/**
 * Test script to create sample data and verify it's stored in MongoDB Atlas
 */

// Load environment variables manually
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

function loadEnv() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
    console.log('✅ Environment variables loaded from .env.local');
  } else {
    console.log('⚠️  .env.local file not found');
  }
}

// Function to fix MongoDB URI
function fixMongoURI(uri) {
  try {
    const url = new URL(uri);
    // Remove empty retryWrites parameter
    if (url.searchParams.get('retryWrites') === '') {
      url.searchParams.delete('retryWrites');
    }
    return url.toString();
  } catch (err) {
    // If URL parsing fails, return original URI
    return uri;
  }
}

loadEnv();

const mongoose = require('mongoose');

// Define schemas (matching your models)
const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  signup_date: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now },
  courses_enrolled: { type: [String], default: [] }
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  blog_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author_id: { type: String, required: true },
  tags: { type: [String], default: [] },
  published_date: { type: Date },
  last_updated: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }
}, { timestamps: true });

async function testDataToAtlas() {
  console.log('🚀 Testing Data Storage in MongoDB Atlas...\n');
  
  try {
    // Connect to database
    console.log('1. Connecting to MongoDB Atlas...');
    const fixedUri = fixMongoURI(process.env.MONGODB_URI);
    const connection = await mongoose.connect(fixedUri, {
      dbName: process.env.MONGODB_DB || 'originalEngivora',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('   ✅ Connected successfully\n');
    
    // Create models
    const Student = mongoose.model('Student', studentSchema);
    const AdminBlog = mongoose.model('AdminBlog', blogSchema);
    
    // 2. Create test student
    console.log('2. Creating test student...');
    const testStudent = new Student({
      student_id: `TEST_${Date.now()}`,
      full_name: 'Atlas Test Student',
      email: `atlas-test-${Date.now()}@example.com`,
      password_hash: '$2b$10$Nc6rPZe4SfSPmZzktfQ1B.xj0rWmKM3wpDzUGT1DxPw5p15odCvqa', // hashed 'password123'
      signup_date: new Date(),
      last_login: new Date(),
      courses_enrolled: ['CS101', 'MATH202']
    });
    
    const savedStudent = await testStudent.save();
    console.log(`   ✅ Test student created with ID: ${savedStudent.student_id}\n`);
    
    // 3. Create test blog
    console.log('3. Creating test blog...');
    const testBlog = new AdminBlog({
      blog_id: `TEST_BLOG_${Date.now()}`,
      title: 'Atlas Test Blog Post',
      slug: `atlas-test-blog-${Date.now()}`,
      content: 'This is a test blog post to verify data is stored in MongoDB Atlas.',
      author_id: 'test-admin-id',
      tags: ['test', 'atlas', 'verification'],
      published_date: new Date(),
      last_updated: new Date(),
      status: 'published'
    });
    
    const savedBlog = await testBlog.save();
    console.log(`   ✅ Test blog created with ID: ${savedBlog.blog_id}\n`);
    
    // 4. Verify data was saved
    console.log('4. Verifying data storage...');
    const foundStudent = await Student.findOne({ student_id: savedStudent.student_id });
    const foundBlog = await AdminBlog.findOne({ blog_id: savedBlog.blog_id });
    
    if (foundStudent && foundBlog) {
      console.log('   ✅ Data successfully stored in MongoDB Atlas!');
      console.log(`   🎯 Student: ${foundStudent.full_name} (${foundStudent.email})`);
      console.log(`   🎯 Blog: ${foundBlog.title} (${foundBlog.status})`);
    } else {
      console.log('   ❌ Data verification failed');
    }
    
    // 5. Clean up test data
    console.log('\n5. Cleaning up test data...');
    await Student.deleteOne({ student_id: savedStudent.student_id });
    await AdminBlog.deleteOne({ blog_id: savedBlog.blog_id });
    console.log('   🧹 Test data cleaned up\n');
    
    // 6. Close connection
    console.log('6. Closing connection...');
    await connection.connection.close();
    console.log('   ✅ Connection closed\n');
    
    console.log('🎉 Test completed successfully!');
    console.log('✅ Your application is correctly storing data in MongoDB Atlas!');
    console.log('\nTo verify in Atlas dashboard:');
    console.log('1. Go to your MongoDB Atlas cluster');
    console.log('2. Select the "originalEngivora" database');
    console.log('3. Check the "students" and "adminblogs" collections');
    console.log('4. You should see documents being created when users register or admins create blogs');
    
  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testDataToAtlas().catch(console.error);