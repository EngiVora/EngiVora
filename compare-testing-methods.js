/**
 * Script to compare different testing methods and identify issues
 */

async function compareTestingMethods() {
  console.log('🔬 Comparing Different Testing Methods...\n');
  
  // Generate unique email to avoid conflicts
  const uniqueId = Date.now();
  const testEmail = `compare-${uniqueId}@example.com`;
  
  console.log(`Test Email: ${testEmail}\n`);
  
  // Method 1: Using fetch API (what we know works)
  console.log('Method 1: Using fetch API (known to work)');
  try {
    const response = await fetch('http://localhost:3001/api/students/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: `Fetch API Student ${uniqueId}`,
        email: testEmail,
        password: 'securePassword123',
        courses_enrolled: ['FETCH101', 'API202']
      })
    });
    
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    if (data.success) {
      console.log('   ✅ Fetch API method works\n');
    } else {
      console.log('   ❌ Fetch API method failed\n');
    }
  } catch (error) {
    console.error('   ❌ Fetch API method error:', error.message, '\n');
  }
  
  // Method 2: Using curl command
  console.log('Method 2: Simulating curl command');
  console.log('   Try this command in your terminal:');
  console.log(`   curl -X POST http://localhost:3001/api/students/signup \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"full_name":"Curl Student ${uniqueId}","email":"curl-${uniqueId}@example.com","password":"securePassword123","courses_enrolled":["CURL101","CMD202"]}'\n`);
  
  // Method 3: Using a form (might be what you're doing)
  console.log('Method 3: Using HTML form (common issue)');
  console.log('   If you are using an HTML form, make sure:');
  console.log('   - Form method is POST');
  console.log('   - Form action is /api/students/signup');
  console.log('   - Content-Type header is application/json');
  console.log('   - Data is sent as JSON, not form data\n');
  
  // Method 4: Using the web interface
  console.log('Method 4: Using the web interface');
  console.log('   Visit: http://localhost:3001/signup');
  console.log('   ⚠️  WARNING: This might use mock data instead of Atlas!\n');
  
  // Verification
  console.log('Verification: Check if data is in Atlas');
  console.log('   1. Visit: http://localhost:3001/students-debug');
  console.log('   2. Or run: node check-students-in-atlas.js');
  console.log('   3. Or check MongoDB Atlas dashboard directly\n');
  
  console.log('🔍 Common Issues and Solutions:');
  console.log('1. Using /api/auth/signup instead of /api/students/signup');
  console.log('   - /api/auth/* routes have fallback to mock data');
  console.log('   - /api/students/* routes always use MongoDB Atlas\n');
  
  console.log('2. Not sending proper JSON');
  console.log('   - Make sure Content-Type is application/json');
  console.log('   - Make sure request body is valid JSON\n');
  
  console.log('3. Wrong endpoint');
  console.log('   - Correct: POST /api/students/signup');
  console.log('   - Incorrect: POST /api/auth/signup (may use mock)\n');
  
  console.log('4. Server not running');
  console.log('   - Make sure npm run dev is running');
  console.log('   - Check that server is on port 3001\n');
  
  console.log('5. Environment variables not loaded');
  console.log('   - Check .env.local file exists');
  console.log('   - Check MONGODB_URI is correct\n');
}

// Run the comparison
compareTestingMethods();