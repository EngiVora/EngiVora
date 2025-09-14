import { NextRequest, NextResponse } from 'next/server';

// GET all blogs
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch blogs from your database
    // For now, we'll return mock data
    const blogs = [
      { id: '1', title: 'Engineering Trends 2023', author: 'John Doe', category: 'Technology', publishDate: '2023-05-15', status: 'published' },
      { id: '2', title: 'How to Prepare for GATE Exam', author: 'Jane Smith', category: 'Education', publishDate: '2023-06-22', status: 'published' },
      { id: '3', title: 'Future of AI in Engineering', author: 'Mike Johnson', category: 'Technology', publishDate: '2023-07-10', status: 'published' },
      { id: '4', title: 'Top Engineering Colleges in India', author: 'Sarah Williams', category: 'Education', publishDate: '2023-08-05', status: 'draft' },
      { id: '5', title: 'Sustainable Engineering Practices', author: 'Robert Brown', category: 'Environment', publishDate: '2023-09-18', status: 'published' },
    ];

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new blog
export async function POST(request: NextRequest) {
  try {
    const blogData = await request.json();

    // Validate required fields
    if (!blogData.title || !blogData.content || !blogData.author || !blogData.category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would save the blog to your database
    // For now, we'll just return the blog with a mock ID
    const newBlog = {
      id: Date.now().toString(),
      ...blogData,
      publishDate: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}