// Script to generate a test JWT token for admin user
require('dotenv').config({ path: './.env.local' });
const jwt = require('jsonwebtoken');

function generateTestToken() {
  console.log('Generating test JWT token...');
  
  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not configured in .env.local');
    process.exit(1);
  }
  
  // Generate token for admin user (id: "2", role: "admin")
  const payload = {
    sub: "2", // Admin user ID from mockUsers
    role: "admin"
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  console.log('✅ Test JWT token generated successfully');
  console.log('Token:', token);
  console.log('\nYou can use this token in API requests with the header:');
  console.log('Authorization: Bearer ' + token);
  
  return token;
}

generateTestToken();