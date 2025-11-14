/**
 * Verify that the web authentication interface stores data in MongoDB Atlas
 */

async function verifyWebAuth() {
  console.log('🔍 Verifying Web Authentication Stores Data in MongoDB Atlas\n');
  
  const uniqueId = Date.now();
  const testEmail = `web-${uniqueId}@example.com`;
  
  console.log(`Test Email: ${testEmail}\n`);
  
  // Test 1: Signup through web interface (enhanced)
  console.log('1. Testing Web Signup...');
  try {
    const signupResponse = await fetch('http://localhost:3001/api/auth/enhanced-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Web User ${uniqueId}`,
        email: testEmail,
        password: 'securePassword123',
        department: 'Web Department',
        year: '4th Year',
        rollNumber: `WEB${uniqueId}`
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
    
    // Test 2: Login through web interface (enhanced)
    console.log('2. Testing Web Login...');
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
    console.log('3. Verifying in MongoDB Atlas...');
    const verifyResponse = await fetch('http://localhost:3001/api/auth/list-users');
    const verifyData = await verifyResponse.json();
    
    console.log(`   Status: ${verifyResponse.status}`);
    console.log(`   Total users: ${verifyData.count}`);
    
    const foundUser = verifyData.users.find(u => u.email === testEmail);
    
    if (foundUser) {
      console.log('   ✅ User found in MongoDB Atlas');
      console.log(`   Name: ${foundUser.name}`);
      console.log(`   Email: ${foundUser.email}`);
      console.log(`   Department: ${foundUser.department}`);
      console.log(`   Last Login: ${foundUser.lastLogin ? new Date(foundUser.lastLogin).toLocaleString() : 'Never'}`);
      console.log('   ✅ Data is stored in MongoDB Atlas\n');
    } else {
      console.log('   ❌ User not found in MongoDB Atlas');
      return;
    }
    
    console.log('🎉 All tests passed!');
    console.log('✅ Web authentication system is working correctly');
    console.log('✅ All data is stored in MongoDB Atlas');
    console.log('\n📋 To verify in MongoDB Atlas dashboard:');
    console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
    console.log('2. Select your cluster');
    console.log('3. Click "Collections"');
    console.log('4. Select database: originalEngivora');
    console.log('5. Select collection: users');
    console.log(`6. Look for email: ${testEmail}`);
    
  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error);
  }
}

// Run the verification
verifyWebAuth();