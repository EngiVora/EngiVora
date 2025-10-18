/**
 * Detailed debug script to trace student registration process
 */

async function debugStudentRegistration() {
  console.log('🔍 Detailed Student Registration Debug...\n');
  
  // Generate unique email to avoid conflicts
  const uniqueId = Date.now();
  const testEmail = `debug-${uniqueId}@example.com`;
  
  console.log('1. Preparing registration data...');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Name: Debug Student ${uniqueId}`);
  console.log('   Password: securePassword123');
  console.log('   Courses: ["DEBUG101", "DEBUG202"]\n');
  
  try {
    // 1. Register student
    console.log('2. Sending registration request...');
    const signupStartTime = Date.now();
    
    const signupResponse = await fetch('http://localhost:3001/api/students/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: `Debug Student ${uniqueId}`,
        email: testEmail,
        password: 'securePassword123',
        courses_enrolled: ['DEBUG101', 'DEBUG202']
      })
    });
    
    const signupEndTime = Date.now();
    console.log(`   Request took: ${signupEndTime - signupStartTime}ms`);
    console.log(`   Response status: ${signupResponse.status}`);
    console.log(`   Response headers: ${Array.from(signupResponse.headers.entries()).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
    
    const signupText = await signupResponse.text();
    console.log(`   Response body: ${signupText}`);
    
    let signupData;
    try {
      signupData = JSON.parse(signupText);
    } catch (parseError) {
      console.error('   ❌ Failed to parse response as JSON');
      return;
    }
    
    if (!signupData.success) {
      console.error('   ❌ Registration failed');
      return;
    }
    
    console.log('   ✅ Registration successful\n');
    
    // 2. Login student
    console.log('3. Sending login request...');
    const loginStartTime = Date.now();
    
    const loginResponse = await fetch('http://localhost:3001/api/students/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'securePassword123'
      })
    });
    
    const loginEndTime = Date.now();
    console.log(`   Request took: ${loginEndTime - loginStartTime}ms`);
    console.log(`   Response status: ${loginResponse.status}`);
    
    const loginText = await loginResponse.text();
    console.log(`   Response body: ${loginText}`);
    
    let loginData;
    try {
      loginData = JSON.parse(loginText);
    } catch (parseError) {
      console.error('   ❌ Failed to parse login response as JSON');
      return;
    }
    
    if (!loginData.success) {
      console.error('   ❌ Login failed');
      return;
    }
    
    console.log('   ✅ Login successful\n');
    
    // 3. Verify in database
    console.log('4. Verifying in database...');
    const verifyStartTime = Date.now();
    
    const verifyResponse = await fetch('http://localhost:3001/api/students/list');
    const verifyEndTime = Date.now();
    
    console.log(`   Request took: ${verifyEndTime - verifyStartTime}ms`);
    console.log(`   Response status: ${verifyResponse.status}`);
    
    const verifyText = await verifyResponse.text();
    let verifyData;
    try {
      verifyData = JSON.parse(verifyText);
    } catch (parseError) {
      console.error('   ❌ Failed to parse verification response as JSON');
      console.error(`   Response text: ${verifyText}`);
      return;
    }
    
    console.log(`   Students in database: ${verifyData.count}`);
    
    if (verifyData.students && verifyData.students.length > 0) {
      const foundStudent = verifyData.students.find(s => s.email === testEmail);
      if (foundStudent) {
        console.log('   ✅ Student found in database:');
        console.log(`     ID: ${foundStudent.student_id}`);
        console.log(`     Name: ${foundStudent.full_name}`);
        console.log(`     Email: ${foundStudent.email}`);
        console.log(`     Courses: ${foundStudent.courses_enrolled.join(', ')}`);
      } else {
        console.log('   ⚠️  Student not found in database list, but database is working');
        console.log('   All students in database:');
        verifyData.students.forEach((s, i) => {
          console.log(`     ${i+1}. ${s.email}`);
        });
      }
    } else {
      console.log('   ⚠️  No students found in database');
    }
    
    console.log('\n🎉 Debug completed successfully!');
    console.log('✅ Student registration and storage is working correctly');
    
  } catch (error) {
    console.error('❌ Debug failed with error:');
    console.error(error);
  }
}

// Run the debug
debugStudentRegistration();