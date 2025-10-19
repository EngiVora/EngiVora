#!/usr/bin/env node

// This script helps deploy the EngiVora application to Vercel
const { execSync } = require('child_process');
const path = require('path');

console.log('EngiVora Deployment Script');
console.log('========================');

try {
  // Check if we're in the right directory
  const currentDir = process.cwd();
  console.log(`Current directory: ${currentDir}`);
  
  // Build the application
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
  
  // Instructions for manual deployment
  console.log('\nDeployment Instructions:');
  console.log('1. Go to https://vercel.com/dashboard');
  console.log('2. Click "New Project"');
  console.log('3. Import your Git repository or select "Other" for manual deployment');
  console.log('4. Set the framework to "Next.js"');
  console.log('5. Set the root directory to the folder containing your Next.js app');
  console.log('6. The build command should be "next build"');
  console.log('7. Deploy!');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}