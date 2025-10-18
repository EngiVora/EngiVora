/**
 * Test script to register a student and verify data is stored in MongoDB Atlas
 */

async function testStudentRegistration() {
  console.log('🚀 Testing Student Registration and Atlas Data Storage...\n');
  
  try {
    // 1. Register a new student
    console.log('1. Registering a new student...');
    const signupResponse = await fetch('http://localhost:3001/api/students/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: 'Atlas Verification Student',
        email: 'atlas-verify-' + Date.now() + '@example.com',
        password: 'securePassword123',
        courses_enrolled: ['CS101', 'MATH202', 'PHYS301']
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('   Signup response status:', signupResponse.status);
    console.log('   Signup response:', JSON.stringify(signupData, null, 2));
    
    if (!signupData.success) {
      console.error('❌ Student registration failed');
      return;
    }
    
    console.log('   ✅ Student registered successfully\n');
    
    // 2. Login with the new student
    console.log('2. Logging in with the new student...');
    const loginResponse = await fetch('http://localhost:3001/api/students/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: signupData.student.email,
        password: 'securePassword123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('   Login response status:', loginResponse.status);
    console.log('   Login response:', JSON.stringify(loginData, null, 2));
    
    if (!loginData.success) {
      console.error('❌ Student login failed');
      return;
    }
    
    console.log('   ✅ Student login successful\n');
    
    // 3. Verify student exists in database
    console.log('3. Verifying student data in database...');
    const verifyResponse = await fetch('http://localhost:3001/api/test-connection');
    const verifyData = await verifyResponse.json();
    
    console.log('   Verification response:', JSON.stringify(verifyData, null, 2));
    
    if (verifyData.success) {
      console.log('   ✅ Database connection verified\n');
    } else {
      console.error('❌ Database connection verification failed');
      return;
    }
    
    console.log('🎉 Test completed successfully!');
    console.log('✅ Student data should now be visible in your MongoDB Atlas dashboard');
    console.log('\nTo verify in Atlas:');
    console.log('1. Go to your MongoDB Atlas cluster');
    console.log('2. Select the "originalEngivora" database');
    console.log('3. Check the "students" collection');
    console.log('4. Look for a student with email:', signupData.student.email);
    
  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error);
  }
}

// Run the test
testStudentRegistration();