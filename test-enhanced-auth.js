/**
 * Test script for enhanced authentication system
 */

async function testEnhancedAuth() {
  console.log('🧪 Testing Enhanced Authentication System\n');
  
  const uniqueId = Date.now();
  const testEmail = `enhanced-${uniqueId}@example.com`;
  
  console.log(`Test Email: ${testEmail}\n`);
  
  // Test 1: Signup
  console.log('1. Testing Signup...');
  try {
    const signupResponse = await fetch('http://localhost:3001/api/auth/enhanced-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Enhanced User ${uniqueId}`,
        email: testEmail,
        password: 'securePassword123',
        department: 'Computer Science',
        year: '3rd Year',
        rollNumber: `CS${uniqueId}`
      })
    });
    
    const signupData = await signupResponse.json();
    console.log(`   Status: ${signupResponse.status}`);
    console.log(`   Success: ${signupData.success}`);
    
    if (!signupData.success) {
      console.log('   ❌ Signup failed');
      console.log(`   Error: ${signupData.error}`);
      return;
    }
    
    console.log('   ✅ Signup successful\n');
    
    // Test 2: Login
    console.log('2. Testing Login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/enhanced-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'securePassword123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Success: ${loginData.success}`);
    
    if (!loginData.success) {
      console.log('   ❌ Login failed');
      console.log(`   Error: ${loginData.error}`);
      return;
    }
    
    console.log('   ✅ Login successful\n');
    
    // Test 3: Verify in database
    console.log('3. Verifying in database...');
    const verifyResponse = await fetch('http://localhost:3001/api/auth/list-users');
    const verifyData = await verifyResponse.json();
    
    console.log(`   Status: ${verifyResponse.status}`);
    console.log(`   Total users: ${verifyData.count}`);
    
    const foundUser = verifyData.users.find(u => u.email === testEmail);
    
    if (foundUser) {
      console.log('   ✅ User found in database');
      console.log(`   Name: ${foundUser.name}`);
      console.log(`   Email: ${foundUser.email}`);
      console.log(`   Department: ${foundUser.department}`);
      console.log('   ✅ Data is stored in MongoDB Atlas\n');
    } else {
      console.log('   ❌ User not found in database');
      return;
    }
    
    console.log('🎉 All tests passed!');
    console.log('✅ Enhanced authentication system is working correctly');
    console.log('✅ All data is stored in MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error);
  }
}

// Run the test
testEnhancedAuth();