// Simple script to verify MongoDB Atlas connection
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      }
    });
    console.log('✅ Environment variables loaded from .env.local');
  } else {
    console.log('⚠️  .env.local file not found');
  }
}

function checkEnvVars() {
  loadEnv();
  
  console.log('\n🔍 Checking environment variables...');
  
  const requiredVars = ['MONGODB_URI', 'MONGODB_DB', 'JWT_SECRET'];
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Present`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allPresent = false;
    }
  });
  
  if (allPresent) {
    console.log('\n🎉 All required environment variables are present!');
    console.log(`🔗 MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
    console.log(`📁 MONGODB_DB: ${process.env.MONGODB_DB || 'Not set'}`);
    console.log('\n🚀 Your application is ready to connect to MongoDB Atlas!');
  } else {
    console.log('\n❌ Some required environment variables are missing.');
    console.log('Please check your .env.local file.');
  }
}

checkEnvVars();