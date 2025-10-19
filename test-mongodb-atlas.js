// Simple test script to verify MongoDB Atlas connection
// This script loads environment variables manually

const fs = require('fs');
const mongoose = require('mongoose');
const { URL } = require('url');

// Function to load environment variables from .env.local
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
  } catch (err) {
    console.log('Warning: Could not load .env.local file');
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

async function testMongoDBAtlas() {
  console.log('Testing MongoDB Atlas connection...\n');
  
  // Load environment variables
  loadEnv();
  
  try {
    // Get MongoDB URI from environment variables
    let uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'originalEngivora';
    
    if (!uri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    // Fix URI if needed
    uri = fixMongoURI(uri);
    
    console.log('1. Connecting to MongoDB Atlas...');
    console.log(`   Database: ${dbName}`);
    
    // Connect to MongoDB Atlas
    await mongoose.connect(uri, {
      dbName: dbName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully\n');
    
    // Define simple schemas for testing
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
    
    // Create models
    const Student = mongoose.model('Student', studentSchema);
    const AdminBlog = mongoose.model('AdminBlog', blogSchema);
    
    // Test Student model
    console.log('2. Testing Student model...');
    
    // Create a test student
    const testStudent = new Student({
      student_id: `STU${Date.now()}`,
      full_name: 'Atlas Test Student',
      email: 'atlas.test@example.com',
      password_hash: '$2b$10$Nc6rPZe4SfSPmZzktfQ1B.xj0rWmKM3wpDzUGT1DxPw5p15odCvqa', // hashed 'password123'
      signup_date: new Date(),
      last_login: new Date(),
      courses_enrolled: ['CS101', 'MATH202']
    });
    
    const savedStudent = await testStudent.save();
    console.log('✅ Student model working - Created test student:', savedStudent.student_id);
    
    // Retrieve the student
    const foundStudent = await Student.findOne({ email: 'atlas.test@example.com' });
    console.log('✅ Student retrieval working - Found student:', foundStudent.full_name);
    
    // Test AdminBlog model
    console.log('\n3. Testing AdminBlog model...');
    
    // Create a test blog
    const testBlog = new AdminBlog({
      blog_id: `BLOG${Date.now()}`,
      title: 'Atlas Test Blog',
      slug: 'atlas-test-blog',
      content: 'This is a test blog post to verify MongoDB Atlas connection.',
      author_id: 'admin-test-id',
      tags: ['test', 'atlas'],
      published_date: new Date(),
      last_updated: new Date(),
      status: 'published'
    });
    
    const savedBlog = await testBlog.save();
    console.log('✅ AdminBlog model working - Created test blog:', savedBlog.blog_id);
    
    // Retrieve the blog
    const foundBlog = await AdminBlog.findOne({ slug: 'atlas-test-blog' });
    console.log('✅ Blog retrieval working - Found blog:', foundBlog.title);
    
    // Clean up test data
    console.log('\n4. Cleaning up test data...');
    await Student.deleteOne({ email: 'atlas.test@example.com' });
    await AdminBlog.deleteOne({ slug: 'atlas-test-blog' });
    console.log('✅ Test data cleaned up successfully');
    
    // Close the connection
    await mongoose.connection.close();
    
    console.log('\n🎉 All tests passed! MongoDB Atlas is properly configured and working.');
    
  } catch (error) {
    console.error('❌ Error during MongoDB Atlas test:', error);
    process.exit(1);
  }
}

// Run the test
testMongoDBAtlas();