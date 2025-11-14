/**
 * Interactive script to debug your specific testing method
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function interactiveDebug() {
  console.log('🕵️‍♂️ Interactive Debug - Let\'s figure out what\'s different\n');
  
  console.log('I\'ll ask you some questions to understand what might be different:\n');
  
  rl.question('1. How are you registering students? (curl/web form/manual API call/other): ', async (method) => {
    console.log(`\nYou are using: ${method}\n`);
    
    if (method.toLowerCase().includes('curl')) {
      console.log('🔍 Let\'s test your curl command...');
      rl.question('2. Please enter your exact curl command: ', async (curlCommand) => {
        console.log(`\nYour command: ${curlCommand}\n`);
        
        // Test the command
        console.log('Testing your command...');
        try {
          // Extract URL and data from curl command
          const urlMatch = curlCommand.match(/http:\/\/localhost:3001(\/[^\s]*)/);
          const dataMatch = curlCommand.match(/-d\s*'([^']*)'/) || curlCommand.match(/-d\s*"([^"]*)"/);
          
          if (urlMatch && dataMatch) {
            const url = urlMatch[1];
            const data = dataMatch[1];
            
            console.log(`URL: ${url}`);
            console.log(`Data: ${data}`);
            
            const response = await fetch(`http://localhost:3001${url}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: data
            });
            
            const result = await response.json();
            console.log(`Response Status: ${response.status}`);
            console.log(`Response Data:`, JSON.stringify(result, null, 2));
            
            if (result.success) {
              console.log('\n✅ Your curl command should work!');
              console.log('If data is not showing in Atlas, check:');
              console.log('1. Are you looking at the correct endpoint? (/api/students/signup)');
              console.log('2. Are you looking at the correct database in Atlas? (originalEngivora)');
              console.log('3. Are you looking at the correct collection? (students)');
            } else {
              console.log('\n❌ Your curl command has an issue');
              console.log('Check the error message above');
            }
          } else {
            console.log('Could not parse URL or data from your curl command');
          }
        } catch (error) {
          console.error('Error testing your curl command:', error.message);
        }
        
        rl.close();
      });
    } else if (method.toLowerCase().includes('form') || method.toLowerCase().includes('web')) {
      console.log('🔍 Web form registration...');
      console.log('Most likely issue: You\'re using the regular signup page which may use mock data');
      console.log('\nSolution:');
      console.log('1. Use the student API directly:');
      console.log('   POST http://localhost:3001/api/students/signup');
      console.log('2. Or use the curl command from the previous test');
      
      rl.close();
    } else if (method.toLowerCase().includes('api')) {
      console.log('🔍 Manual API call...');
      rl.question('3. What endpoint are you calling? ', async (endpoint) => {
        console.log(`\nEndpoint: ${endpoint}\n`);
        
        if (endpoint.includes('/api/auth/')) {
          console.log('⚠️  WARNING: You\'re using /api/auth/ endpoint!');
          console.log('This endpoint has fallback to mock data and may not store in Atlas');
          console.log('\nSolution: Use /api/students/signup instead');
        } else if (endpoint.includes('/api/students/')) {
          console.log('✅ Good! You\'re using the correct endpoint');
          console.log('Let\'s test it...');
          
          const uniqueId = Date.now();
          const testEmail = `test-${uniqueId}@example.com`;
          
          try {
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                full_name: `Test Student ${uniqueId}`,
                email: testEmail,
                password: 'securePassword123',
                courses_enrolled: ['TEST101', 'TEST202']
              })
            });
            
            const result = await response.json();
            console.log(`Response Status: ${response.status}`);
            console.log(`Response Data:`, JSON.stringify(result, null, 2));
            
            if (result.success) {
              console.log('\n✅ Your API call works!');
              console.log('Data should be in Atlas. Check:');
              console.log('1. http://localhost:3001/students-debug');
              console.log('2. MongoDB Atlas dashboard (database: originalEngivora, collection: students)');
            }
          } catch (error) {
            console.error('Error testing your API call:', error.message);
          }
        }
        
        rl.close();
      });
    } else {
      console.log('Let\'s do a general check...');
      console.log('\nMost common issues:');
      console.log('1. Using wrong endpoint (/api/auth/ instead of /api/students/)');
      console.log('2. Not sending proper JSON data');
      console.log('3. Missing Content-Type header');
      console.log('4. Looking in wrong place in Atlas dashboard');
      
      rl.close();
    }
  });
}

// Run interactive debug
interactiveDebug();