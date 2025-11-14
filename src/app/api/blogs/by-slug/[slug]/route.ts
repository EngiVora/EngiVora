import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Blog } from '@/models/Blog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase();
    const { slug } = await params;
    
    console.log('Fetching blog with slug:', slug); // Debug log
    
    const blog = await Blog.findOne({ slug });
    
    console.log('Found blog:', blog); // Debug log

    if (!blog) {
      console.log('Blog not found for slug:', slug); // Debug log
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