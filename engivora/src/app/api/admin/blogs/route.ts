import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build filter object for AdminBlog
    const adminBlogFilter: any = {};
    if (status) adminBlogFilter.status = status;
    if (author_id) adminBlogFilter.author_id = author_id;

    // Get blogs from AdminBlog collection
    try {
      const adminBlogs = await AdminBlog.find(adminBlogFilter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      // Get all blogs from main Blog collection (for sync)
      const mainBlogs = await Blog.find({}).sort({ createdAt: -1 });

      // Combine blogs from both collections
      // Create a map to avoid duplicates
      const blogMap = new Map();
      
      // Add AdminBlog entries first
      for (const blog of adminBlogs) {
        blogMap.set(blog.blog_id, {
          blog_id: blog.blog_id,
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          author_id: blog.author_id,
          tags: blog.tags,
          published_date: blog.published_date,
          last_updated: blog.last_updated,
          status: blog.status,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          source: 'admin' // Indicates this blog is from AdminBlog collection
        });
      }
      
      // Add main Blog entries that don't exist in AdminBlog
      for (const blog of mainBlogs) {
        const blogId = blog._id.toString();
        if (!blogMap.has(blogId)) {
          blogMap.set(blogId, {
            blog_id: blogId,
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            author_id: blog.authorId?.toString() || 'unknown',
            tags: blog.tags || [],
            published_date: blog.createdAt,
            last_updated: blog.updatedAt,
            status: blog.published ? 'published' : 'draft',
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
            source: 'main' // Indicates this blog is from main Blog collection
          });
        }
      }

      // Convert map to array
      const combinedBlogs = Array.from(blogMap.values());
      
      // Apply pagination to combined blogs
      const paginatedBlogs = combinedBlogs.slice((page - 1) * limit, page * limit);
      const total = combinedBlogs.length;

      return NextResponse.json({
        success: true,
        data: paginatedBlogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
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
      
      // Sync to main blog collection if published
      if (savedBlog.status === 'published') {
        await syncSingleAdminBlog(savedBlog.blog_id);
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
      
      // Update the admin blog
      adminBlog.title = validatedData.title;
      adminBlog.content = validatedData.content;
      adminBlog.tags = validatedData.tags || [];
      adminBlog.status = validatedData.status || adminBlog.status;
      adminBlog.last_updated = new Date();
      
      // Update slug if title changed
      if (validatedData.title !== adminBlog.title) {
        const slug = validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        adminBlog.slug = slug;
      }
      
      // Set published date if status changed to published
      if (validatedData.status === 'published' && adminBlog.status !== 'published') {
        adminBlog.published_date = new Date();
      }
      
      const updatedAdminBlog = await adminBlog.save();
      
      // Also update the main blog if it exists
      if (!mainBlog) {
        mainBlog = await Blog.findById(id);
      }
      
      if (mainBlog) {
        mainBlog.title = updatedAdminBlog.title;
        mainBlog.slug = updatedAdminBlog.slug;
        mainBlog.content = updatedAdminBlog.content;
        mainBlog.tags = updatedAdminBlog.tags || [];
        mainBlog.published = updatedAdminBlog.status === 'published';
        mainBlog.authorId = updatedAdminBlog.author_id;
        await mainBlog.save();
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
      // Delete from AdminBlog collection (if exists)
      const adminBlogResult = await AdminBlog.deleteOne({ blog_id: id });
      
      // Delete from main Blog collection (if exists)
      const mainBlogResult = await Blog.deleteOne({ _id: id });
      
      // Check if either deletion was successful
      if (adminBlogResult.deletedCount === 0 && mainBlogResult.deletedCount === 0) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Blog deleted successfully'
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