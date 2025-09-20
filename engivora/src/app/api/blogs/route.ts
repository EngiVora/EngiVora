import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for blog posts
const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  summary: z.string().min(20, 'Summary must be at least 20 characters'),
  category: z.enum(['technology', 'career', 'academic', 'lifestyle', 'news']),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
});

const blogUpdateSchema = blogSchema.partial();

// Mock blog database
type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'technology' | 'career' | 'academic' | 'lifestyle' | 'news';
  tags: string[];
  author: {
    id: string;
    name: string;
    email: string;
  };
  featured: boolean;
  published: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
};

const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Machine Learning in Engineering',
    summary: 'A comprehensive guide to understanding ML concepts for engineering students',
    content: 'Machine Learning has become an integral part of modern engineering...',
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
    content: 'As we move into 2024, certain programming languages continue to dominate...',
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
  {
    id: '3',
    title: 'How to Ace Your Engineering Interviews',
    summary: 'Tips and strategies for succeeding in technical interviews',
    content: 'Landing your dream engineering job requires more than just technical skills...',
    category: 'career' as const,
    tags: ['interviews', 'career', 'tips'],
    author: {
      id: '1',
      name: 'John Doe',
      email: 'student@example.com',
    },
    featured: true,
    published: true,
    views: 1560,
    likes: 124,
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-08T14:20:00Z',
  },
];

// Helper function to get user from token
function getUserFromToken(token: string) {
  // Mock user extraction from token
  return {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');

    let filteredBlogs = [...mockBlogs];

    // Filter by category
    if (category) {
      filteredBlogs = filteredBlogs.filter(blog => blog.category === category);
    }

    // Filter by featured
    if (featured) {
      filteredBlogs = filteredBlogs.filter(blog => blog.featured);
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchLower) ||
        blog.summary.toLowerCase().includes(searchLower) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by creation date (newest first)
    filteredBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredBlogs.length / limit);

    return NextResponse.json({
      success: true,
      data: paginatedBlogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: filteredBlogs.length,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate input
    const validatedData = blogSchema.parse(body);

    // Create new blog post
    const newBlog: BlogPost = {
      id: (mockBlogs.length + 1).toString(),
      ...validatedData,
      tags: validatedData.tags || [],
      author: user,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockBlogs.push(newBlog);

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: newBlog,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Blog creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}