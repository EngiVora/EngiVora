// Simple test script for admin API endpoints
async function testAdminAPI() {
  const baseUrl = 'http://localhost:3001/api';
  
  console.log('Testing Admin API Endpoints...\n');
  
  // Test 1: Login endpoint
  console.log('1. Testing Login Endpoint');
  try {
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@engivora.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Success:', loginData.success);
    console.log('User Role:', loginData.user?.role);
    
    if (loginData.success && loginData.token) {
      const token = loginData.token;
      console.log('Token received:', token.substring(0, 20) + '...');
      
      // Test 2: Dashboard endpoint
      console.log('\n2. Testing Dashboard Endpoint');
      const dashboardResponse = await fetch(`${baseUrl}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const dashboardData = await dashboardResponse.json();
      console.log('Dashboard Status:', dashboardResponse.status);
      console.log('Dashboard Success:', dashboardData.success);
      
      // Test 3: Users endpoint
      console.log('\n3. Testing Users Endpoint');
      const usersResponse = await fetch(`${baseUrl}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const usersData = await usersResponse.json();
      console.log('Users Status:', usersResponse.status);
      console.log('Users Success:', usersData.success);
      console.log('Users Count:', usersData.data?.users?.length || 0);
      
      // Test 4: Token verification
      console.log('\n4. Testing Token Verification');
      const verifyResponse = await fetch(`${baseUrl}/auth/verify-token`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const verifyData = await verifyResponse.json();
      console.log('Verify Status:', verifyResponse.status);
      console.log('Verify Success:', verifyData.success);
      
    } else {
      console.log('Login failed, skipping other tests');
    }
  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
  
  console.log('\nTest completed.');
}

// Run the test
testAdminAPI();