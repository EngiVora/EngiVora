import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Blog } from '@/models/Blog';
import { AdminBlog } from '@/models/AdminBlog';
import { verifyAdminToken } from '@/lib/jwt-utils';

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

// GET /api/admin/sync-blogs - Sync blogs from main Blog collection to AdminBlog collection
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
    await connectToDatabase();

    // Find all blogs in the main Blog collection
    const mainBlogs = await Blog.find({});

    let syncedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;

    // Process each blog
    for (const mainBlog of mainBlogs) {
      // Check if this blog already exists in AdminBlog collection
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
      
      syncedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} blogs (${createdCount} created, ${updatedCount} updated)`,
      data: {
        totalSynced: syncedCount,
        created: createdCount,
        updated: updatedCount
      }
    });

  } catch (error: any) {
    console.error('Blog sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/sync-blogs - Sync a specific blog by ID
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

    const body = await request.json();
    const { blogId } = body;

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find the blog in the main Blog collection
    const mainBlog = await Blog.findById(blogId);
    
    if (!mainBlog) {
      return NextResponse.json(
        { error: 'Blog not found in main collection' },
        { status: 404 }
      );
    }

    // Check if this blog already exists in AdminBlog collection
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
      
      return NextResponse.json({
        success: true,
        message: 'Blog updated in admin collection',
        data: existingAdminBlog
      });
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
      
      const savedBlog = await newAdminBlog.save();
      
      return NextResponse.json({
        success: true,
        message: 'Blog created in admin collection',
        data: savedBlog
      });
    }

  } catch (error: any) {
    console.error('Blog sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}