/**
 * Demonstrate the difference between regular signup and student signup
 */

async function demonstrateDifference() {
  console.log('🧪 Demonstrating the Difference\n');
  
  const uniqueId = Date.now();
  
  // Test 1: Regular auth signup (may use mock)
  console.log('Test 1: Regular Auth Signup (/api/auth/signup)');
  try {
    const response1 = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Regular User ${uniqueId}`,
        email: `regular-${uniqueId}@example.com`,
        password: 'securePassword123',
        department: 'Computer Science',
        year: '3rd Year',
        rollNumber: `CS${uniqueId}`
      })
    });
    
    const data1 = await response1.json();
    console.log(`   Status: ${response1.status}`);
    console.log(`   Success: ${data1.success}`);
    if (data1.user) {
      console.log(`   User ID: ${data1.user.id}`);
    }
    console.log('');
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }
  
  // Test 2: Student signup (always uses Atlas)
  console.log('Test 2: Student Signup (/api/students/signup)');
  try {
    const response2 = await fetch('http://localhost:3001/api/students/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: `Student User ${uniqueId}`,
        email: `student-${uniqueId}@example.com`,
        password: 'securePassword123',
        courses_enrolled: ['CS101', 'MATH202']
      })
    });
    
    const data2 = await response2.json();
    console.log(`   Status: ${response2.status}`);
    console.log(`   Success: ${data2.success}`);
    if (data2.student) {
      console.log(`   Student ID: ${data2.student.student_id}`);
    }
    console.log('');
  } catch (error) {
    console.log(`   Error: ${error.message}\n`);
  }
  
  // Check database
  console.log('Checking database...');
  try {
    const verifyResponse = await fetch('http://localhost:3001/api/students/list');
    const verifyData = await verifyResponse.json();
    
    console.log(`Total students in Atlas: ${verifyData.count}`);
    
    // Look for our test students
    const regularStudent = verifyData.students.find(s => s.email.includes('regular-'));
    const studentStudent = verifyData.students.find(s => s.email.includes('student-'));
    
    if (regularStudent) {
      console.log('❌ Found regular auth student in Atlas (this should not happen)');
    } else {
      console.log('✅ Regular auth student NOT found in Atlas (expected behavior)');
    }
    
    if (studentStudent) {
      console.log('✅ Student auth student found in Atlas (expected behavior)');
    } else {
      console.log('❌ Student auth student NOT found in Atlas (unexpected)');
    }
    
  } catch (error) {
    console.log(`Error checking database: ${error.message}`);
  }
  
  console.log('\n💡 Key Takeaway:');
  console.log('When you click on the regular signup page and fill details:');
  console.log('❌ Data may NOT be stored in MongoDB Atlas');
  console.log('✅ Only data from /api/students/signup is guaranteed to be in Atlas');
}

// Run the demonstration
demonstrateDifference();