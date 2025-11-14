import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { Blog } from '@/models/Blog';

// Blog update schema
const blogUpdateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  content: z.string().min(50, 'Content must be at least 50 characters').optional(),
  summary: z.string().min(20, 'Summary must be at least 20 characters').optional(),
  category: z.enum(['technology', 'career', 'academic', 'lifestyle', 'news']).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

// Helper function to get user from token
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUserFromToken(_token: string) {
  return {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    // Check if id is a valid MongoDB ObjectId, otherwise treat it as a slug
    let blog;
    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id);
    } else {
      blog = await Blog.findOne({ slug: id, published: true });
    }

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    blog.views++;
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
    });

  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { id } = await params;
    
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or admin
    if (blog.authorId !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own blog posts' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = blogUpdateSchema.parse(body);

    // Update blog post
    Object.assign(blog, {
      ...validatedData,
      updatedAt: new Date(),
    });
    
    const updatedBlog = await blog.save();

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedBlog,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Blog update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { id } = await params;
    
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or admin
    if (blog.authorId !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own blog posts' },
        { status: 403 }
      );
    }

    // Remove blog post
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });

  } catch (error) {
    console.error('Blog deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}