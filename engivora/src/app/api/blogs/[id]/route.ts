import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

// Mock blog database (same as in route.ts - in production, use shared database)
const mockBlogs = [
  {
    id: '1',
    title: 'Getting Started with Machine Learning in Engineering',
    summary: 'A comprehensive guide to understanding ML concepts for engineering students',
    content: 'Machine Learning has become an integral part of modern engineering. From predictive maintenance in manufacturing to optimizing energy consumption in smart grids, ML applications are everywhere. This guide will help you understand the fundamental concepts and how to apply them in your engineering projects.',
    category: 'technology' as const,
    tags: ['machine-learning', 'engineering', 'ai'],
    author: {
      id: '1',
      name: 'John Doe',
      email: 'student@example.com',
    },
    featured: true,
    published: true,
    views: 1250,
    likes: 89,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    title: 'Top 10 Programming Languages for Engineers in 2024',
    summary: 'Discover the most in-demand programming languages for engineering careers',
    content: 'As we move into 2024, certain programming languages continue to dominate the engineering landscape. Python leads for data science and AI, JavaScript for web applications, and C++ for system programming. Understanding these languages can significantly boost your career prospects.',
    category: 'career' as const,
    tags: ['programming', 'career', 'languages'],
    author: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    featured: false,
    published: true,
    views: 980,
    likes: 67,
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z',
  },
];

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
    const { id } = await params;
    const blog = mockBlogs.find(b => b.id === id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count
    blog.views++;

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

    const { id } = await params;
    const blog = mockBlogs.find(b => b.id === id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or admin
    if (blog.author.id !== user.id) {
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
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog,
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

    const { id } = await params;
    const blogIndex = mockBlogs.findIndex(b => b.id === id);

    if (blogIndex === -1) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const blog = mockBlogs[blogIndex];

    // Check if user is the author or admin
    if (blog.author.id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own blog posts' },
        { status: 403 }
      );
    }

    // Remove blog post
    mockBlogs.splice(blogIndex, 1);

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