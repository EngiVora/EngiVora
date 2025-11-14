// Test script to verify environment variables
require('dotenv').config({ path: './.env.local' });

function testEnvironment() {
  console.log('Testing environment configuration...');
  
  // Test JWT_SECRET
  if (process.env.JWT_SECRET) {
    console.log('✅ JWT_SECRET is configured');
    console.log('   Length:', process.env.JWT_SECRET.length, 'characters');
  } else {
    console.log('❌ JWT_SECRET is not configured');
    process.exit(1);
  }
  
  // Test MongoDB URI
  if (process.env.MONGODB_URI) {
    console.log('✅ MONGODB_URI is configured');
    console.log('   URI:', process.env.MONGODB_URI.substring(0, 30) + '...');
  } else {
    console.log('❌ MONGODB_URI is not configured');
    process.exit(1);
  }
  
  // Test Database Name
  if (process.env.MONGODB_DB) {
    console.log('✅ MONGODB_DB is configured');
    console.log('   Database:', process.env.MONGODB_DB);
  } else {
    console.log('⚠️  MONGODB_DB is not configured (using default)');
  }
  
  console.log('✅ Environment configuration test passed');
}

testEnvironment();