import { Blog } from '@/models/Blog';
import { AdminBlog } from '@/models/AdminBlog';
import { connectToDatabase } from '@/lib/db';

/**
 * Syncs blog data from AdminBlog to Blog model
 * This ensures that blogs created in the admin panel appear on the main website
 */
export async function syncAdminBlogsToMain() {
  try {
    await connectToDatabase();
    
    // Find all published admin blogs
    const adminBlogs = await AdminBlog.find({ status: 'published' });
    
    for (const adminBlog of adminBlogs) {
      // Check if blog already exists in main Blog collection
      let existingBlog = await Blog.findOne({ slug: adminBlog.slug });
      
      if (existingBlog) {
        // Update existing blog
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
        // Create new blog in main collection
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
    
    console.log(`Synced ${adminBlogs.length} blogs from admin to main collection`);
    return { success: true, count: adminBlogs.length };
  } catch (error) {
    console.error('Error syncing admin blogs to main:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync a single admin blog to the main Blog model
 */
export async function syncSingleAdminBlog(adminBlogId: string) {
  try {
    await connectToDatabase();
    
    // Find the admin blog
    const adminBlog = await AdminBlog.findOne({ blog_id: adminBlogId });
    
    if (!adminBlog) {
      throw new Error('Admin blog not found');
    }
    
    // Check if blog already exists in main Blog collection
    let existingBlog = await Blog.findOne({ slug: adminBlog.slug });
    
    if (existingBlog) {
      // Update existing blog
      existingBlog.title = adminBlog.title;
      existingBlog.summary = adminBlog.content.substring(0, 200) + '...';
      existingBlog.content = adminBlog.content;
      existingBlog.category = 'technology'; // Default category
      existingBlog.tags = adminBlog.tags || [];
      existingBlog.featured = false; // Default to not featured
      existingBlog.published = adminBlog.status === 'published';
      existingBlog.authorId = adminBlog.author_id;
      
      await existingBlog.save();
    } else {
      // Create new blog in main collection
      const newBlog = new Blog({
        title: adminBlog.title,
        slug: adminBlog.slug,
        summary: adminBlog.content.substring(0, 200) + '...',
        content: adminBlog.content,
        category: 'technology', // Default category
        tags: adminBlog.tags || [],
        featured: false, // Default to not featured
        published: adminBlog.status === 'published',
        authorId: adminBlog.author_id,
        views: 0,
        likes: 0,
      });
      
      await newBlog.save();
    }
    
    console.log(`Synced blog ${adminBlogId} from admin to main collection`);
    return { success: true };
  } catch (error) {
    console.error('Error syncing single admin blog:', error);
    return { success: false, error: error.message };
  }
}