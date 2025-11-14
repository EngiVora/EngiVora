// Simple test for signup functionality
async function testSignup() {
  try {
    console.log('Testing signup API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        department: 'Computer Science'
      }),
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Signup test passed');
    } else {
      console.log('❌ Signup test failed');
    }
  } catch (error) {
    console.error('Error during signup test:', error);
  }
}

// Run the test
testSignup();