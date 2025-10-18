/**
 * Analyze MongoDB databases and collections used by the application
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

async function analyzeDatabases() {
  console.log('🔍 Analyzing MongoDB Databases and Collections\n');
  
  try {
    // Connect to database
    const fixedUri = fixMongoURI(process.env.MONGODB_URI);
    const connection = await mongoose.connect(fixedUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    console.log('✅ Connected to MongoDB Atlas\n');
    
    // List all databases
    console.log('🗄️  All Databases in Cluster:');
    const admin = connection.connection.db.admin();
    const dbInfo = await admin.listDatabases();
    
    dbInfo.databases.forEach((db, index) => {
      console.log(`   ${index + 1}. ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    console.log('\n');
    
    // For each database, list collections
    for (const db of dbInfo.databases) {
      console.log(`📂 Database: ${db.name}`);
      
      // Switch to database
      const dbInstance = connection.connection.useDb(db.name);
      
      try {
        const collections = await dbInstance.listCollections().toArray();
        if (collections.length === 0) {
          console.log('   (No collections found)');
        } else {
          collections.forEach((collection, index) => {
            console.log(`   ${index + 1}. ${collection.name}`);
          });
        }
      } catch (err) {
        console.log('   ❌ Could not list collections');
      }
      
      console.log('');
    }
    
    // Identify databases used by the application
    console.log('🎯 Databases Used by This Application:');
    console.log('   Based on the code analysis, these databases are likely used:');
    
    const appDatabase = process.env.MONGODB_DB || 'originalEngivora';
    console.log(`   ✅ ${appDatabase} - Main application database`);
    
    // Close connection
    await connection.connection.close();
    
    console.log('\n');
    console.log('📋 Recommendations for Cleanup:');
    console.log('   1. Keep the main application database (likely "originalEngivora")');
    console.log('   2. Review other databases to determine if they are needed');
    console.log('   3. Back up any important data before deletion');
    console.log('   4. Delete unused databases through MongoDB Atlas UI');
    
    console.log('\n');
    console.log('🔐 How to Delete Databases in MongoDB Atlas:');
    console.log('   1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('   2. Select your cluster');
    console.log('   3. Click "Collections"');
    console.log('   4. For each database you want to delete:');
    console.log('      a. Click the three dots next to the database name');
    console.log('      b. Select "Drop Database"');
    console.log('      c. Confirm by typing the database name');
    console.log('   5. Only delete databases you are certain are not needed');
    
  } catch (error) {
    console.error('❌ Analysis failed with error:');
    console.error(error.message);
  }
}

// Run the analysis
analyzeDatabases();