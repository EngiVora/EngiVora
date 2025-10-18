import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Blog } from '@/models/Blog';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { summary: { $regex: s, $options: 'i' } },
        { tags: { $elemMatch: { $regex: s, $options: 'i' } } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
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
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'JWT_SECRET is not properly configured'
      }, { status: 500 });
    }
    
    let userId = '';
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
      userId = payload.sub;
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = blogSchema.parse(body);
    await connectToDatabase();

    // Generate unique slug
    const baseSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 80);

    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const created = await Blog.create({
      title: validatedData.title,
      slug,
      summary: validatedData.summary,
      content: validatedData.content,
      category: validatedData.category,
      tags: validatedData.tags || [],
      featured: validatedData.featured ?? false,
      published: validatedData.published ?? true,
      authorId: userId,
      views: 0,
      likes: 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: created,
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