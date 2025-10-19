// Test script for database authentication
async function testDatabaseAuth() {
  try {
    console.log('Testing database authentication...');
    
    // Test signup
    console.log('\n1. Testing signup...');
    const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User DB',
        email: 'testdb@example.com',
        password: 'password123',
        department: 'Computer Science',
        year: '3rd Year',
        rollNumber: 'CS2021001'
      }),
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup response status:', signupResponse.status);
    console.log('Signup response data:', signupData);
    
    if (signupResponse.ok) {
      console.log('✅ Signup test passed');
    } else {
      console.log('❌ Signup test failed');
      return;
    }
    
    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testdb@example.com',
        password: 'password123'
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', loginData);
    
    if (loginResponse.ok) {
      console.log('✅ Login test passed');
      console.log('User data:', loginData.user);
    } else {
      console.log('❌ Login test failed');
    }
    
  } catch (error) {
    console.error('Error during database auth test:', error);
  }
}

// Run the test
testDatabaseAuth();