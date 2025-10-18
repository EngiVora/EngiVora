import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { AdminBlog } from '@/models/AdminBlog';
import { verifyAdminToken } from '@/lib/jwt-utils';

export const runtime = 'nodejs'

// Validation schema for updating a blog
const blogUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
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

// GET /api/admin/blogs/[id] - Get a specific blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get blog from database
    try {
      const blog = await AdminBlog.findOne({ 
        $or: [{ blog_id: id }, { slug: id }] 
      });

      if (!blog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
      );
      }

      return NextResponse.json({
        success: true,
        data: {
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
        },
      });
    } catch (findError) {
      console.error('Error fetching blog:', findError);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get blog error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blogs/[id] - Update a specific blog by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    const body = await request.json();
    
    // Validate input
    const validatedData = blogUpdateSchema.parse(body);
    
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
    
    // Find the blog
    const blog = await AdminBlog.findOne({ blog_id: id });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author of the blog
    if (blog.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied: You can only edit your own blogs' },
        { status: 403 }
      );
    }
    
    // Update blog fields
    if (validatedData.title !== undefined) {
      blog.title = validatedData.title;
      
      // Update slug if title changed
      const newSlug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Check if new slug already exists (and it's not this blog)
      const existingBlog = await AdminBlog.findOne({ 
        slug: newSlug,
        blog_id: { $ne: id }
      });
      
      if (existingBlog) {
        return NextResponse.json(
          { error: 'A blog with this title already exists. Please use a different title.' },
          { status: 409 }
        );
      }
      
      blog.slug = newSlug;
    }
    
    if (validatedData.content !== undefined) {
      blog.content = validatedData.content;
    }
    
    if (validatedData.tags !== undefined) {
      blog.tags = validatedData.tags;
    }
    
    if (validatedData.status !== undefined) {
      blog.status = validatedData.status;
      // Update published date if status changed to published
      if (validatedData.status === 'published' && !blog.published_date) {
        blog.published_date = new Date();
      }
    }
    
    blog.last_updated = new Date();
    
    // Save updated blog
    try {
      const updatedBlog = await blog.save();
      
      return NextResponse.json({
        success: true,
        message: 'Blog updated successfully',
        data: {
          blog_id: updatedBlog.blog_id,
          title: updatedBlog.title,
          slug: updatedBlog.slug,
          content: updatedBlog.content,
          author_id: updatedBlog.author_id,
          tags: updatedBlog.tags,
          published_date: updatedBlog.published_date,
          last_updated: updatedBlog.last_updated,
          status: updatedBlog.status,
          createdAt: updatedBlog.createdAt,
          updatedAt: updatedBlog.updatedAt,
        },
      });
    } catch (saveError) {
      console.error('Error updating blog:', saveError);
      return NextResponse.json(
        { error: 'Blog update failed' },
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

// DELETE /api/admin/blogs/[id] - Delete a specific blog by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

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
    
    // Find the blog
    const blog = await AdminBlog.findOne({ blog_id: id });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the author of the blog
    if (blog.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied: You can only delete your own blogs' },
        { status: 403 }
      );
    }
    
    // Delete the blog
    try {
      await AdminBlog.deleteOne({ blog_id: id });
      
      return NextResponse.json({
        success: true,
        message: 'Blog deleted successfully',
      });
    } catch (deleteError) {
      console.error('Error deleting blog:', deleteError);
      return NextResponse.json(
        { error: 'Blog deletion failed' },
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