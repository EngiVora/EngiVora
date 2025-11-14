#!/usr/bin/env node
/**
 * Debug script to check MongoDB Atlas connection and data flow
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

async function debugAtlasConnection() {
  console.log('\n🔍 Debugging MongoDB Atlas Connection...\n');
  
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
    
    // 2. Fix and connect to database
    console.log('2. Attempting to connect to MongoDB Atlas...');
    const fixedUri = fixMongoURI(process.env.MONGODB_URI);
    console.log(`   Database: ${process.env.MONGODB_DB || 'originalEngivora'}`);
    
    const connection = await mongoose.connect(fixedUri, {
      dbName: process.env.MONGODB_DB || 'originalEngivora',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
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
    
    // 5. Close connection
    console.log('\n5. Closing connection...');
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
    
    if (error.message && error.message.includes('Authentication failed')) {
      console.error('\n🔧 Troubleshooting tip:');
      console.error('   Check your MONGODB_URI username and password');
    } else if (error.message && (error.message.includes('ENOTFOUND') || error.message.includes('ENODATA'))) {
      console.error('\n🔧 Troubleshooting tip:');
      console.error('   Check your MONGODB_URI hostname');
    } else if (error.message && error.message.includes('database name')) {
      console.error('\n🔧 Troubleshooting tip:');
      console.error('   Check your MONGODB_DB value');
    }
    
    process.exit(1);
  }
}

// Run the debug
debugAtlasConnection().catch(console.error);