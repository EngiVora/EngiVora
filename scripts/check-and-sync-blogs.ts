import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { AdminBlog } from '../src/models/AdminBlog';
import { Blog } from '../src/models/Blog';
import { connectToDatabase } from '../src/lib/db';

async function checkAndSyncBlogs() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Checking for published admin blogs...');
    const adminBlogs = await AdminBlog.find({ status: 'published' });
    console.log(`Found ${adminBlogs.length} published admin blogs`);
    
    for (const adminBlog of adminBlogs) {
      console.log(`- ${adminBlog.title} (${adminBlog.slug})`);
      
      // Check if blog exists in main collection
      const existingBlog = await Blog.findOne({ slug: adminBlog.slug });
      
      if (existingBlog) {
        console.log(`  -> Already exists in main collection, updating...`);
        existingBlog.title = adminBlog.title;
        existingBlog.summary = adminBlog.content.substring(0, 200) + '...';
        existingBlog.content = adminBlog.content;
        existingBlog.category = 'technology'; // Default category
        existingBlog.tags = adminBlog.tags || [];
        existingBlog.featured = false; // Default to not featured
        existingBlog.published = true;
        existingBlog.authorId = adminBlog.author_id;
        await existingBlog.save();
      } else {
        console.log(`  -> Creating new blog in main collection...`);
        const newBlog = new Blog({
          title: adminBlog.title,
          slug: adminBlog.slug,
          summary: adminBlog.content.substring(0, 200) + '...',
          content: adminBlog.content,
          category: 'technology', // Default category
          tags: adminBlog.tags || [],
          featured: false, // Default to not featured
          published: true,
          authorId: adminBlog.author_id,
          views: 0,
          likes: 0,
        });
        await newBlog.save();
      }
    }
    
    console.log('Checking main blog collection...');
    const mainBlogs = await Blog.find({});
    console.log(`Found ${mainBlogs.length} blogs in main collection`);
    for (const blog of mainBlogs) {
      console.log(`- ${blog.title} (${blog.slug})`);
    }
    
    console.log('Sync completed successfully!');
  } catch (error) {
    console.error('Error during sync:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Drop the existing Blog collection and recreate it with correct indexes
async function resetBlogCollection() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Dropping existing Blog collection...');
    await Blog.collection.drop();
    console.log('Blog collection dropped successfully');
    
    // Recreate the collection by creating a dummy document and then deleting it
    console.log('Recreating Blog collection with correct indexes...');
    const dummyBlog = new Blog({
      title: 'Dummy',
      slug: 'dummy',
      summary: 'Dummy summary',
      content: 'Dummy content',
      category: 'technology',
      tags: [],
      featured: false,
      published: true,
      authorId: new mongoose.Types.ObjectId(),
      views: 0,
      likes: 0,
    });
    await dummyBlog.save();
    await Blog.deleteOne({ slug: 'dummy' });
    
    console.log('Blog collection recreated with correct indexes');
  } catch (error) {
    console.error('Error resetting Blog collection:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Check if we're running with a reset flag
if (process.argv.includes('--reset')) {
  resetBlogCollection();
} else {
  checkAndSyncBlogs();
}