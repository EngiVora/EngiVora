/**
 * Script to check all students in MongoDB Atlas
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

// Define student schema to match our model
const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  signup_date: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now },
  courses_enrolled: { type: [String], default: [] }
}, { timestamps: true });

async function checkStudentsInAtlas() {
  console.log('🔍 Checking Students in MongoDB Atlas...\n');
  
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
    
    // Create model
    const Student = mongoose.model('Student', studentSchema);
    
    // 2. Get all students
    console.log('2. Retrieving all students from Atlas...');
    const students = await Student.find({}, { password_hash: 0 }).sort({ createdAt: -1 }).limit(10);
    
    console.log(`   Found ${students.length} student(s):\n`);
    
    students.forEach((student, index) => {
      console.log(`   Student ${index + 1}:`);
      console.log(`     ID: ${student.student_id}`);
      console.log(`     Name: ${student.full_name}`);
      console.log(`     Email: ${student.email}`);
      console.log(`     Signup Date: ${student.signup_date}`);
      console.log(`     Last Login: ${student.last_login}`);
      console.log(`     Courses: ${student.courses_enrolled.join(', ')}`);
      console.log(`     Created: ${student.createdAt}`);
      console.log('   ---');
    });
    
    if (students.length === 0) {
      console.log('   No students found in the database');
    }
    
    // 3. Close connection
    console.log('\n3. Closing connection...');
    await connection.connection.close();
    console.log('   ✅ Connection closed\n');
    
    console.log('🎉 Check completed successfully!');
    console.log('\n📋 To verify in MongoDB Atlas dashboard:');
    console.log('1. Log in to MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('2. Select your cluster');
    console.log('3. Click "Connect" -> "Connect to MongoDB Compass" or "Connect using MongoDB Shell"');
    console.log('4. Or click "Collections" in the cluster view');
    console.log('5. Select database: originalEngivora');
    console.log('6. Select collection: students');
    console.log('7. You should see the student records listed above');
    
  } catch (error) {
    console.error('❌ Check failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run the check
checkStudentsInAtlas().catch(console.error);