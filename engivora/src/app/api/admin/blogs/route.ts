import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { AdminBlog } from '@/models/AdminBlog';
import { verifyAdminToken } from '@/lib/jwt-utils';

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

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (author_id) filter.author_id = author_id;

    // Get blogs from database
    try {
      const blogs = await AdminBlog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await AdminBlog.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: blogs.map(blog => ({
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
        })),
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
        },
      });
    } catch (saveError) {
      console.error('Error saving blog:', saveError);
      return NextResponse.json(
        { error: 'Blog creation failed' },
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