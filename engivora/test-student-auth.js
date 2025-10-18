// Test script for student authentication APIs
const BASE_URL = 'http://localhost:3000';

async function testStudentAuth() {
  console.log('Testing Student Authentication APIs...\n');
  
  // Test student signup
  console.log('1. Testing Student Signup...');
  try {
    const signupResponse = await fetch(`${BASE_URL}/api/students/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: 'Test Student',
        email: 'teststudent@example.com',
        password: 'password123',
        courses_enrolled: ['CS101', 'MATH202']
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup Response:', signupData);
    
    if (signupData.success) {
      console.log('✅ Student signup successful\n');
      
      // Test student login
      console.log('2. Testing Student Login...');
      const loginResponse = await fetch(`${BASE_URL}/api/students/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'teststudent@example.com',
          password: 'password123'
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login Response:', loginData);
      
      if (loginData.success) {
        console.log('✅ Student login successful\n');
        console.log('Student Auth Token:', loginData.token);
      } else {
        console.log('❌ Student login failed\n');
      }
    } else {
      console.log('❌ Student signup failed\n');
    }
  } catch (error) {
    console.error('Error during student auth test:', error);
  }
}

// Run the test
testStudentAuth();