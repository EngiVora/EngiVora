import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isValidObjectId } from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { AdminBlog } from '@/models/AdminBlog';
import { Blog } from '@/models/Blog'; // Add this import
import { verifyAdminToken } from '@/lib/jwt-utils';
import { syncSingleAdminBlog } from '@/utils/blog-sync';

export const runtime = 'nodejs'

// Validation schema for creating/updating a blog
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

// Helper function to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization header missing or invalid', status: 401 };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  const verificationResult = await verifyAdminToken(token);
  
  if (!verificationResult.success) {
    return { error: verificationResult.error, status: 401 };
  }

  return { user: verificationResult.user };
}

// GET /api/admin/blogs - Get all blogs with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbConnectionError) {
      console.error('Database connection error:', dbConnectionError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const author_id = searchParams.get('author_id');
    const search = searchParams.get('search')?.trim().toLowerCase();
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter object for AdminBlog only (no main Blog collection)
    const adminBlogFilter: any = {};
    if (status) adminBlogFilter.status = status;
    if (author_id) adminBlogFilter.author_id = author_id;

    // Add search filter to MongoDB query for better performance
    if (search) {
      adminBlogFilter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Get blogs from AdminBlog collection and sync missing ones from Blog collection
    try {
      // First, sync any blogs from Blog collection that don't exist in AdminBlog
      // This ensures all blogs are manageable from admin panel
      // Only sync on first page to avoid performance issues
      if (page === 1) {
        const mainBlogs = await Blog.find({});
        const adminBlogSlugs = new Set(
          (await AdminBlog.find({}, { slug: 1 })).map(b => b.slug)
        );

        // Only process blogs that don't exist in AdminBlog
        const blogsToSync = mainBlogs.filter(blog => !adminBlogSlugs.has(blog.slug));
        
        if (blogsToSync.length > 0) {
          const syncPromises = blogsToSync.map(mainBlog => {
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
            return newAdminBlog.save();
          });
          
          await Promise.all(syncPromises);
          console.log(`Auto-synced ${blogsToSync.length} blog(s) from Blog to AdminBlog collection`);
        }
      }
      
      const skip = (page - 1) * limit;
      
      const [adminBlogs, total] = await Promise.all([
        AdminBlog.find(adminBlogFilter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        AdminBlog.countDocuments(adminBlogFilter),
      ]);
      
      // Transform AdminBlog entries to match expected format
      const paginatedBlogs = adminBlogs.map((blog) => ({
          blog_id: blog.blog_id,
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          author_id: blog.author_id,
        tags: blog.tags || [],
          published_date: blog.published_date,
          last_updated: blog.last_updated,
          status: blog.status,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        source: 'admin', // All blogs are from AdminBlog collection
      }));

      return NextResponse.json({
        success: true,
        data: paginatedBlogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    } catch (findError) {
      console.error('Error fetching blogs:', findError);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const user = authResult.user;

    const body = await request.json();
    
    // Validate input
    const validatedData = blogSchema.parse(body);
    
    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbConnectionError) {
      console.error('Database connection error:', dbConnectionError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Generate unique blog ID and slug
    const blog_id = `BLOG${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check if slug already exists
    const existingBlog = await AdminBlog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog with this title already exists. Please use a different title.' },
        { status: 409 }
      );
    }
    
    // Create new blog in database
    try {
      const newBlog = new AdminBlog({
        blog_id,
        title: validatedData.title,
        slug,
        content: validatedData.content,
        author_id: user.id,
        tags: validatedData.tags || [],
        published_date: validatedData.status === 'published' ? new Date() : undefined,
        last_updated: new Date(),
        status: validatedData.status || 'draft',
      });
      
      const savedBlog = await newBlog.save();
      
      // Always sync to main blog collection (for both published and draft)
      // This ensures consistency and allows drafts to be visible when published
      try {
        await syncSingleAdminBlog(savedBlog.blog_id);
      } catch (syncError) {
        console.error('Error syncing blog to main collection:', syncError);
        // Don't fail the request if sync fails, but log it
      }
      
      return NextResponse.json({
        success: true,
        message: 'Blog created successfully',
        data: {
          blog_id: savedBlog.blog_id,
          title: savedBlog.title,
          slug: savedBlog.slug,
          content: savedBlog.content,
          author_id: savedBlog.author_id,
          tags: savedBlog.tags,
          published_date: savedBlog.published_date,
          last_updated: savedBlog.last_updated,
          status: savedBlog.status,
          createdAt: savedBlog.createdAt,
          updatedAt: savedBlog.updatedAt,
        }
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    } catch (saveError) {
      console.error('Error saving blog:', saveError);
      return NextResponse.json(
        { error: 'Failed to save blog' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Create blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blogs/[id] - Update a blog
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = blogSchema.parse(body);
    
    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbConnectionError) {
      console.error('Database connection error:', dbConnectionError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    try {
      // First, try to find in AdminBlog collection
      let adminBlog = await AdminBlog.findOne({ blog_id: id });
      let mainBlog = null;
      
      // If not found in AdminBlog, check main Blog collection
      if (!adminBlog) {
        mainBlog = await Blog.findById(id);
        if (mainBlog) {
          // Create it in AdminBlog collection
          const newAdminBlog = new AdminBlog({
            blog_id: mainBlog._id.toString(),
            title: mainBlog.title,
            slug: mainBlog.slug,
            content: mainBlog.content,
            author_id: mainBlog.authorId?.toString() || 'unknown',
            tags: mainBlog.tags || [],
            published_date: mainBlog.createdAt,
            last_updated: new Date(),
            status: mainBlog.published ? 'published' : 'draft',
          });
          adminBlog = await newAdminBlog.save();
        }
      }
      
      // If still not found, return error
      if (!adminBlog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }
      
      // Save old values before updating to detect changes
      const oldTitle = adminBlog.title;
      const oldStatus = adminBlog.status;
      
      // Update the admin blog
      adminBlog.title = validatedData.title;
      adminBlog.content = validatedData.content;
      adminBlog.tags = validatedData.tags || [];
      adminBlog.status = validatedData.status || adminBlog.status;
      adminBlog.last_updated = new Date();
      
      // Update slug if title changed (check BEFORE assignment)
      if (validatedData.title && validatedData.title !== oldTitle) {
        const slug = validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        adminBlog.slug = slug;
      }
      
      // Set published date if status changed to published (check old status BEFORE assignment)
      if (validatedData.status === 'published' && oldStatus !== 'published') {
        adminBlog.published_date = new Date();
      }
      
      const updatedAdminBlog = await adminBlog.save();
      
      // Always sync to main blog collection to ensure consistency
      try {
        await syncSingleAdminBlog(updatedAdminBlog.blog_id);
      } catch (syncError) {
        console.error('Error syncing blog to main collection:', syncError);
        // Don't fail the request if sync fails, but log it
      }
      
      return NextResponse.json({
        success: true,
        message: 'Blog updated successfully',
        data: {
          blog_id: updatedAdminBlog.blog_id,
          title: updatedAdminBlog.title,
          slug: updatedAdminBlog.slug,
          content: updatedAdminBlog.content,
          author_id: updatedAdminBlog.author_id,
          tags: updatedAdminBlog.tags,
          published_date: updatedAdminBlog.published_date,
          last_updated: updatedAdminBlog.last_updated,
          status: updatedAdminBlog.status,
          createdAt: updatedAdminBlog.createdAt,
          updatedAt: updatedAdminBlog.updatedAt,
        }
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    } catch (updateError) {
      console.error('Error updating blog:', updateError);
      return NextResponse.json(
        { error: 'Failed to update blog' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Update blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blogs/[id] - Delete a blog
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id?: string }> }) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbConnectionError) {
      console.error('Database connection error:', dbConnectionError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    try {
      // First, try to find the blog in either collection to confirm it exists
      const adminBlog = await AdminBlog.findOne({ blog_id: id });
      let mainBlog = null;

      if (adminBlog) {
        mainBlog = await Blog.findOne({ slug: adminBlog.slug });
      } else if (isValidObjectId(id)) {
        mainBlog = await Blog.findById(id);
      }
      
      // If blog doesn't exist in either collection, return error
      if (!adminBlog && !mainBlog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }
      
      // Delete from AdminBlog collection (if exists)
      if (adminBlog) {
        await AdminBlog.deleteOne({ blog_id: id });
      }
      
      // Delete from main Blog collection (if exists)
      // Try to find by slug first (in case blog_id doesn't match _id)
      if (adminBlog) {
        const blogBySlug = await Blog.findOne({ slug: adminBlog.slug });
        if (blogBySlug) {
          await Blog.deleteOne({ _id: blogBySlug._id });
        }
      } else if (mainBlog) {
        await Blog.deleteOne({ _id: mainBlog._id });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Blog deleted successfully'
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    } catch (deleteError) {
      console.error('Error deleting blog:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete blog' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}