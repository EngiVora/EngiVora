import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Blog } from '@/models/Blog';
import { AdminBlog } from '@/models/AdminBlog'; // Add this import
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

    const query: Record<string, unknown> = { published: true };
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
      imageUrl: body.imageUrl || "/images/blog-placeholder.svg"
    });

    // Sync to AdminBlog collection
    try {
      // Check if blog already exists in AdminBlog collection
      const existingAdminBlog = await AdminBlog.findOne({ blog_id: created._id.toString() });
      
      if (existingAdminBlog) {
        // Update existing admin blog
        existingAdminBlog.title = created.title;
        existingAdminBlog.slug = created.slug;
        existingAdminBlog.content = created.content;
        existingAdminBlog.author_id = created.authorId?.toString() || 'unknown';
        existingAdminBlog.tags = created.tags || [];
        existingAdminBlog.published_date = created.createdAt;
        existingAdminBlog.last_updated = created.updatedAt;
        existingAdminBlog.status = created.published ? 'published' : 'draft';
        
        await existingAdminBlog.save();
      } else {
        // Create new admin blog
        const newAdminBlog = new AdminBlog({
          blog_id: created._id.toString(),
          title: created.title,
          slug: created.slug,
          content: created.content,
          author_id: created.authorId?.toString() || 'unknown',
          tags: created.tags || [],
          published_date: created.createdAt,
          last_updated: created.updatedAt,
          status: created.published ? 'published' : 'draft',
        });
        
        await newAdminBlog.save();
      }
    } catch (syncError) {
      console.error('Error syncing blog to AdminBlog collection:', syncError);
      // Don't fail the main operation if sync fails
    }

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

// Add PUT endpoint for updating blogs
export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = blogSchema.parse(updateData);
    await connectToDatabase();

    // Find and update the blog
    const updated = await Blog.findByIdAndUpdate(
      id,
      {
        title: validatedData.title,
        summary: validatedData.summary,
        content: validatedData.content,
        category: validatedData.category,
        tags: validatedData.tags || [],
        featured: validatedData.featured ?? false,
        published: validatedData.published ?? true,
        authorId: userId,
        imageUrl: updateData.imageUrl || "/images/blog-placeholder.svg"
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Sync to AdminBlog collection
    try {
      // Check if blog already exists in AdminBlog collection
      const existingAdminBlog = await AdminBlog.findOne({ blog_id: updated._id.toString() });
      
      if (existingAdminBlog) {
        // Update existing admin blog
        existingAdminBlog.title = updated.title;
        existingAdminBlog.slug = updated.slug;
        existingAdminBlog.content = updated.content;
        existingAdminBlog.author_id = updated.authorId?.toString() || 'unknown';
        existingAdminBlog.tags = updated.tags || [];
        existingAdminBlog.published_date = updated.createdAt;
        existingAdminBlog.last_updated = updated.updatedAt;
        existingAdminBlog.status = updated.published ? 'published' : 'draft';
        
        await existingAdminBlog.save();
      } else {
        // Create new admin blog
        const newAdminBlog = new AdminBlog({
          blog_id: updated._id.toString(),
          title: updated.title,
          slug: updated.slug,
          content: updated.content,
          author_id: updated.authorId?.toString() || 'unknown',
          tags: updated.tags || [],
          published_date: updated.createdAt,
          last_updated: updated.updatedAt,
          status: updated.published ? 'published' : 'draft',
        });
        
        await newAdminBlog.save();
      }
    } catch (syncError) {
      console.error('Error syncing blog to AdminBlog collection:', syncError);
      // Don't fail the main operation if sync fails
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updated,
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

// Add DELETE endpoint for deleting blogs
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Delete the blog
    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Also delete from AdminBlog collection if it exists
    try {
      await AdminBlog.deleteOne({ blog_id: id });
    } catch (syncError) {
      console.error('Error deleting blog from AdminBlog collection:', syncError);
      // Don't fail the main operation if sync fails
    }

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