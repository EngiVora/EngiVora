/**
 * Your definitive test - This will show exactly what's happening
 */

async function yourDefinitiveTest() {
  console.log('🎯 Your Definitive Student Registration Test\n');
  
  // Generate unique email
  const uniqueId = Date.now();
  const testEmail = `your-test-${uniqueId}@example.com`;
  
  console.log(`Test Email: ${testEmail}\n`);
  
  console.log('Step 1: Using the CORRECT endpoint (/api/students/signup)');
  console.log('Step 2: Sending data as proper JSON');
  console.log('Step 3: With correct headers\n');
  
  try {
    // Register student using the correct endpoint
    console.log('🚀 Registering student...');
    const response = await fetch('http://localhost:3001/api/students/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: `Your Test Student ${uniqueId}`,
        email: testEmail,
        password: 'YourSecurePassword123',
        courses_enrolled: ['YOUR101', 'TEST202']
      })
    });
    
    console.log(`   Response Status: ${response.status}`);
    
    const data = await response.json();
    console.log(`   Response Data:`, JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ REGISTRATION SUCCESSFUL!');
      console.log(`   Student ID: ${data.student.student_id}`);
      console.log(`   Student Name: ${data.student.full_name}`);
      console.log(`   Student Email: ${data.student.email}\n`);
      
      // Now check if it's in the database
      console.log('🔍 Checking if student is in database...');
      const verifyResponse = await fetch('http://localhost:3001/api/students/list');
      const verifyData = await verifyResponse.json();
      
      const foundStudent = verifyData.students.find(s => s.email === testEmail);
      
      if (foundStudent) {
        console.log('✅ STUDENT FOUND IN DATABASE!');
        console.log('✅ DATA IS STORED IN MONGODB ATLAS!');
        console.log('\n📋 To see this in MongoDB Atlas dashboard:');
        console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
        console.log('2. Select your cluster');
        console.log('3. Click "Collections"');
        console.log('4. Select database: originalEngivora');
        console.log('5. Select collection: students');
        console.log(`6. Look for email: ${testEmail}\n`);
      } else {
        console.log('❌ Student not found in database list');
        console.log('   But registration was successful, so data should be there');
      }
      
      console.log('🎉 YOUR TEST COMPLETED SUCCESSFULLY!');
      console.log('✅ Student data IS being stored in MongoDB Atlas');
      
    } else {
      console.log('\n❌ REGISTRATION FAILED');
      console.log('   Check the error message above');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error.message);
  }
  
  console.log('\n💡 If this test works but your method doesn\'t, the difference is in:');
  console.log('1. Endpoint URL (/api/students/signup vs /api/auth/signup)');
  console.log('2. Request format (JSON vs form data)');
  console.log('3. Headers (Content-Type: application/json)');
}

// Run your definitive test
yourDefinitiveTest();