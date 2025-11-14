/**
 * Script to sync blogs from main Blog collection to AdminBlog collection
 * Run this script to ensure all existing blogs are visible in the admin panel
 */

import { syncMainBlogsToAdmin } from '@/utils/blog-sync';
import { connectToDatabase } from '@/lib/db';

async function syncBlogs() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Syncing blogs from main collection to admin collection...');
    const result = await syncMainBlogsToAdmin();
    
    if (result.success) {
      console.log(`Successfully synced blogs: ${result.count} total (${result.created} created, ${result.updated} updated)`);
    } else {
      console.error('Failed to sync blogs:', result.error);
    }
  } catch (error) {
    console.error('Error during blog sync:', error);
  }
}

// Run the sync if this file is executed directly
if (require.main === module) {
  syncBlogs().catch(console.error);
}

export default syncBlogs;