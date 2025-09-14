import { NextRequest, NextResponse } from 'next/server';

// Mock database for demonstration
const mockBlogs = [
  { id: '1', title: 'Engineering Trends 2023', author: 'John Doe', category: 'Technology', content: 'Content for Engineering Trends 2023...', publishDate: '2023-05-15', status: 'published' },
  { id: '2', title: 'How to Prepare for GATE Exam', author: 'Jane Smith', category: 'Education', content: 'Content for How to Prepare for GATE Exam...', publishDate: '2023-06-22', status: 'published' },
  { id: '3', title: 'Future of AI in Engineering', author: 'Mike Johnson', category: 'Technology', content: 'Content for Future of AI in Engineering...', publishDate: '2023-07-10', status: 'published' },
  { id: '4', title: 'Top Engineering Colleges in India', author: 'Sarah Williams', category: 'Education', content: 'Content for Top Engineering Colleges in India...', publishDate: '2023-08-05', status: 'draft' },
  { id: '5', title: 'Sustainable Engineering Practices', author: 'Robert Brown', category: 'Environment', content: 'Content for Sustainable Engineering Practices...', publishDate: '2023-09-18', status: 'published' },
];

// GET a specific blog by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // In a real application, you would fetch the blog from your database
    // For now, we'll use our mock data
    const blog = mockBlogs.find(blog => blog.id === id);
    
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT (update) a specific blog by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const blogData = await request.json();
    
    // Validate required fields
    if (!blogData.title || !blogData.content || !blogData.author || !blogData.category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real application, you would update the blog in your database
    // For now, we'll just return the updated blog
    const updatedBlog = {
      id,
      ...blogData,
      // Preserve the original publish date if not provided
      publishDate: blogData.publishDate || new Date().toISOString().split('T')[0],
    };
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a specific blog by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // In a real application, you would delete the blog from your database
    // For now, we'll just return a success message
    
    return NextResponse.json(
      { message: `Blog with ID ${id} deleted successfully` }
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}