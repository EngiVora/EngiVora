/**
 * Script to show current data in MongoDB Atlas
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

// Define schemas
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

async function showCurrentAtlasData() {
  console.log('📊 Current Data in MongoDB Atlas\n');
  
  try {
    // Connect to database
    const fixedUri = fixMongoURI(process.env.MONGODB_URI);
    const connection = await mongoose.connect(fixedUri, {
      dbName: process.env.MONGODB_DB || 'originalEngivora',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    // Create models
    const Student = mongoose.model('Student', studentSchema);
    const AdminBlog = mongoose.model('AdminBlog', blogSchema);
    
    // Get all students
    console.log('🎓 Students:');
    const students = await Student.find({}, { password_hash: 0 }).sort({ createdAt: -1 });
    
    if (students.length === 0) {
      console.log('   (No students found)');
    } else {
      students.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.full_name}`);
        console.log(`      Email: ${student.email}`);
        console.log(`      ID: ${student.student_id}`);
        console.log(`      Courses: ${student.courses_enrolled.join(', ')}`);
        console.log(`      Signed up: ${student.signup_date}`);
        console.log('      ---');
      });
    }
    
    console.log(`\nTotal students: ${students.length}\n`);
    
    // Get all blogs
    console.log('📝 Blog Posts:');
    const blogs = await AdminBlog.find({}).sort({ createdAt: -1 });
    
    if (blogs.length === 0) {
      console.log('   (No blog posts found)');
    } else {
      blogs.forEach((blog, index) => {
        console.log(`   ${index + 1}. ${blog.title}`);
        console.log(`      Slug: ${blog.slug}`);
        console.log(`      ID: ${blog.blog_id}`);
        console.log(`      Status: ${blog.status}`);
        console.log(`      Tags: ${blog.tags.join(', ')}`);
        console.log('      ---');
      });
    }
    
    console.log(`\nTotal blog posts: ${blogs.length}\n`);
    
    // Close connection
    await connection.connection.close();
    
    console.log('✅ Data retrieval completed successfully!');
    console.log('\n📋 To see this data in MongoDB Atlas dashboard:');
    console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('2. Select your cluster');
    console.log('3. Click "Collections"');
    console.log('4. Select database: originalEngivora');
    console.log('5. Check collections: students, adminblogs');
    
  } catch (error) {
    console.error('❌ Failed to retrieve data:');
    console.error(error.message);
  }
}

// Run the function
showCurrentAtlasData();