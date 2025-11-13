import { Blog } from '@/models/Blog';
import { AdminBlog } from '@/models/AdminBlog';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

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
      const existingBlog = await Blog.findOne({ slug: adminBlog.slug });
      
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
  } catch (error: any) {
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
    // First try to find by _id (which should match blog_id)
    let existingBlog = null;
    
    if (mongoose.Types.ObjectId.isValid(adminBlogId)) {
      existingBlog = await Blog.findById(adminBlogId);
    }
    
    // If not found by ID, try to find by slug
    if (!existingBlog) {
      existingBlog = await Blog.findOne({ slug: adminBlog.slug });
    }
    
    if (existingBlog) {
      // Update existing blog
      existingBlog.title = adminBlog.title;
      existingBlog.slug = adminBlog.slug; // Update slug in case it changed
      existingBlog.summary = adminBlog.content.substring(0, 200) + '...';
      existingBlog.content = adminBlog.content;
      existingBlog.category = 'technology'; // Default category
      existingBlog.tags = adminBlog.tags || [];
      existingBlog.featured = false; // Default to not featured
      existingBlog.published = adminBlog.status === 'published';
      // Handle author_id - convert to ObjectId if it's a valid ObjectId string
      if (adminBlog.author_id && adminBlog.author_id !== 'unknown') {
        try {
          if (mongoose.Types.ObjectId.isValid(adminBlog.author_id)) {
            existingBlog.authorId = new mongoose.Types.ObjectId(adminBlog.author_id);
          } else {
            existingBlog.authorId = undefined;
          }
        } catch (e) {
          existingBlog.authorId = undefined;
        }
      } else {
        existingBlog.authorId = undefined;
      }
      
      await existingBlog.save();
      console.log(`Updated blog ${adminBlogId} in main collection (slug: ${adminBlog.slug}, _id: ${existingBlog._id})`);
    } else {
      // Create new blog in main collection
      let authorIdObj = undefined;
      if (adminBlog.author_id && adminBlog.author_id !== 'unknown') {
        try {
          if (mongoose.Types.ObjectId.isValid(adminBlog.author_id)) {
            authorIdObj = new mongoose.Types.ObjectId(adminBlog.author_id);
          }
        } catch (e) {
          // Keep as undefined
        }
      }
      
      const newBlog = new Blog({
        title: adminBlog.title,
        slug: adminBlog.slug,
        summary: adminBlog.content.substring(0, 200) + '...',
        content: adminBlog.content,
        category: 'technology', // Default category
        tags: adminBlog.tags || [],
        featured: false, // Default to not featured
        published: adminBlog.status === 'published',
        authorId: authorIdObj,
        views: 0,
        likes: 0,
      });
      
      await newBlog.save();
      console.log(`Created blog ${adminBlogId} in main collection (slug: ${adminBlog.slug}, _id: ${newBlog._id})`);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error syncing single admin blog:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync blogs from main Blog collection to AdminBlog collection
 * This ensures that blogs created directly in the main collection appear in the admin panel
 */
export async function syncMainBlogsToAdmin() {
  try {
    await connectToDatabase();
    
    // Find all blogs in the main Blog collection
    const mainBlogs = await Blog.find({});
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const mainBlog of mainBlogs) {
      // Check if blog already exists in AdminBlog collection
      const existingAdminBlog = await AdminBlog.findOne({ blog_id: mainBlog._id.toString() });
      
      if (existingAdminBlog) {
        // Update existing admin blog
        existingAdminBlog.title = mainBlog.title;
        existingAdminBlog.slug = mainBlog.slug;
        existingAdminBlog.content = mainBlog.content;
        existingAdminBlog.author_id = mainBlog.authorId?.toString() || 'unknown';
        existingAdminBlog.tags = mainBlog.tags || [];
        existingAdminBlog.published_date = mainBlog.createdAt;
        existingAdminBlog.last_updated = mainBlog.updatedAt;
        existingAdminBlog.status = mainBlog.published ? 'published' : 'draft';
        
        await existingAdminBlog.save();
        updatedCount++;
      } else {
        // Create new admin blog
        const newAdminBlog = new AdminBlog({
          blog_id: mainBlog._id.toString(),
          title: mainBlog.title,
          slug: mainBlog.slug,
          content: mainBlog.content,
          author_id: mainBlog.authorId?.toString() || 'unknown',
          tags: mainBlog.tags || [],
          published_date: mainBlog.createdAt,
          last_updated: mainBlog.updatedAt,
          status: mainBlog.published ? 'published' : 'draft',
        });
        
        await newAdminBlog.save();
        createdCount++;
      }
    }
    
    console.log(`Synced ${mainBlogs.length} blogs from main to admin collection (${createdCount} created, ${updatedCount} updated)`);
    return { success: true, count: mainBlogs.length, created: createdCount, updated: updatedCount };
  } catch (error: any) {
    console.error('Error syncing main blogs to admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync a single blog to the AdminBlog model
 */
export async function syncSingleBlogToAdmin(blogId: string) {
  try {
    await connectToDatabase();
    
    // Find the blog in main collection
    const mainBlog = await Blog.findById(blogId);
    
    if (!mainBlog) {
      throw new Error('Main blog not found');
    }
    
    // Check if blog already exists in AdminBlog collection
    const existingAdminBlog = await AdminBlog.findOne({ blog_id: mainBlog._id.toString() });
    
    if (existingAdminBlog) {
      // Update existing admin blog
      existingAdminBlog.title = mainBlog.title;
      existingAdminBlog.slug = mainBlog.slug;
      existingAdminBlog.content = mainBlog.content;
      existingAdminBlog.author_id = mainBlog.authorId?.toString() || 'unknown';
      existingAdminBlog.tags = mainBlog.tags || [];
      existingAdminBlog.published_date = mainBlog.createdAt;
      existingAdminBlog.last_updated = mainBlog.updatedAt;
      existingAdminBlog.status = mainBlog.published ? 'published' : 'draft';
      
      await existingAdminBlog.save();
    } else {
      // Create new admin blog
      const newAdminBlog = new AdminBlog({
        blog_id: mainBlog._id.toString(),
        title: mainBlog.title,
        slug: mainBlog.slug,
        content: mainBlog.content,
        author_id: mainBlog.authorId?.toString() || 'unknown',
        tags: mainBlog.tags || [],
        published_date: mainBlog.createdAt,
        last_updated: mainBlog.updatedAt,
        status: mainBlog.published ? 'published' : 'draft',
      });
      
      await newAdminBlog.save();
    }
    
    console.log(`Synced blog ${blogId} from main to admin collection`);
    return { success: true };
  } catch (error: any) {
    console.error('Error syncing single blog to admin:', error);
    return { success: false, error: error.message };
  }
}