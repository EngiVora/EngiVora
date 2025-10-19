#!/usr/bin/env node

// Test script for authentication APIs
// Run with: node test-auth.js

const API_BASE = 'http://localhost:3000/api/auth';

async function testSignup() {
  console.log('🧪 Testing Signup...');
  
  const signupData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    department: 'Computer Science Engineering',
    year: '2nd Year',
    rollNumber: 'CS2023001'
  };

  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();
    console.log('Signup Response:', response.status, data);
    
    if (response.ok) {
      console.log('✅ Signup successful');
      return data.user.email;
    } else {
      console.log('❌ Signup failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    return null;
  }
}

async function testLogin(email = 'xyz@gmail.com', password = 'Xyz@123') {
  console.log('🧪 Testing Login...');
  
  const loginData = {
    email,
    password,
  };

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    console.log('Login Response:', response.status, data);
    
    if (response.ok) {
      console.log('✅ Login successful');
      return data.token;
    } else {
      console.log('❌ Login failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

async function testExistingCredentials() {
  console.log('\n🔍 Testing existing credentials...\n');
  
  const credentials = [
    { email: 'student@example.com', password: 'password123' },
    { email: 'admin@engivora.com', password: 'admin123' },
    { email: 'xyz@gmail.com', password: 'Xyz@123' }
  ];

  for (const cred of credentials) {
    console.log(`Testing ${cred.email}...`);
    await testLogin(cred.email, cred.password);
    console.log('');
  }
}

async function main() {
  console.log('🚀 Starting Authentication Tests\n');
  
  // Test existing credentials
  await testExistingCredentials();
  
  // Test signup
  console.log('='.repeat(50));
  const newUserEmail = await testSignup();
  console.log('');
  
  // Test login with new user (should fail due to unverified email)
  if (newUserEmail) {
    console.log('='.repeat(50));
    await testLogin(newUserEmail, 'TestPass123');
  }
  
  console.log('\n✨ Tests completed!');
  console.log('\n📝 Notes:');
  console.log('- New users require email verification before login');
  console.log('- Check console for verification links');
  console.log('- Existing demo users are already verified');
}

main().catch(console.error);