// Simple script to test Clerk configuration
console.log('Testing Clerk Configuration...');

// Check if environment variables are set
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;

console.log('Publishable Key:', publishableKey ? 'SET' : 'NOT SET');
console.log('Secret Key:', secretKey ? 'SET' : 'NOT SET');

if (publishableKey && secretKey) {
  console.log('✅ Clerk environment variables are configured');
  
  if (publishableKey.startsWith('pk_') && secretKey.startsWith('sk_')) {
    console.log('✅ Keys have correct format');
  } else {
    console.log('❌ Keys do not have correct format (should start with pk_ and sk_)');
  }
  
  if (publishableKey.includes('placeholder') || secretKey.includes('placeholder')) {
    console.log('⚠️  Warning: Keys still contain "placeholder" - replace with actual keys');
  }
  
  if (publishableKey.includes('NOT_CONFIGURED') || secretKey.includes('NOT_CONFIGURED')) {
    console.log('⚠️  Warning: Keys still contain "NOT_CONFIGURED" - remove this suffix');
  }
} else {
  console.log('❌ Clerk environment variables are not configured');
  console.log('Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in your .env.local file');
}

console.log('\nEnvironment variables check complete.');