import dotenv from 'dotenv';
import { syncAdminBlogsToMain } from '@/utils/blog-sync';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function syncBlogs() {
  console.log('Starting blog synchronization...');
  
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in environment variables');
    process.exit(1);
  }
  
  const result = await syncAdminBlogsToMain();
  
  if (result.success) {
    console.log(`Successfully synced ${result.count} blogs from admin to main collection`);
  } else {
    console.error('Failed to sync blogs:', result.error);
  }
  
  process.exit(0);
}

syncBlogs().catch(error => {
  console.error('Error during blog sync:', error);
  process.exit(1);
});