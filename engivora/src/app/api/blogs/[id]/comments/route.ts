import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for comments
const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment too long'),
  parentId: z.string().optional(), // For nested replies
});

const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required').max(1000, 'Comment too long'),
});

// Mock storage for comments (in production, use database)
const mockComments = new Map<string, Comment[]>();

interface Comment {
  id: string;
  blogId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies?: Comment[];
}

// Helper function to get user from request
function getUserFromRequest(request: NextRequest): { id: string; name: string; avatar: string } | null {
  // In production, extract user info from JWT token or session
  // For now, return mock user data or extract from headers
  const userId = request.headers.get('x-user-id');
  const userName = request.headers.get('x-user-name');
  const userAvatar = request.headers.get('x-user-avatar');

  if (!userId) return null;

  return {
    id: userId,
    name: userName || 'Anonymous User',
    avatar: userAvatar || 'https://via.placeholder.com/40'
  };
}

// Helper function to generate comment ID
function generateCommentId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Helper function to organize comments into threaded structure
function organizeComments(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: organize into tree structure
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies!.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  // Sort by creation date (newest first for root, oldest first for replies)
  rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  rootComments.forEach(comment => {
    if (comment.replies) {
      comment.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  });

  return rootComments;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: blogId } = await params;

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get comments for this blog
    const comments = mockComments.get(blogId) || [];

    // Organize into threaded structure
    const organizedComments = organizeComments(comments);

    // Simulate pagination (for root comments only)
    const skip = (page - 1) * limit;
    const paginatedComments = organizedComments.slice(skip, skip + limit);

    const totalComments = comments.length;
    const totalPages = Math.ceil(organizedComments.length / limit);

    return NextResponse.json({
      success: true,
      data: {
        comments: paginatedComments,
        pagination: {
          currentPage: page,
          totalPages,
          totalComments,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        }
      }
    });

  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: blogId } = await params;

    if (!blogId) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = commentSchema.parse(body);

    // Validate parent comment exists if parentId provided
    if (validatedData.parentId) {
      const existingComments = mockComments.get(blogId) || [];
      const parentExists = existingComments.some(c => c.id === validatedData.parentId);
      if (!parentExists) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 400 }
        );
      }
    }

    const newComment: Comment = {
      id: generateCommentId(),
      blogId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: validatedData.content,
      parentId: validatedData.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    };

    // Add comment to storage
    const existingComments = mockComments.get(blogId) || [];
    existingComments.push(newComment);
    mockComments.set(blogId, existingComments);

    return NextResponse.json({
      success: true,
      message: 'Comment added successfully',
      data: newComment,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Comment creation error:', error);
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
    const { id: blogId } = await params;
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!blogId || !commentId) {
      return NextResponse.json(
        { error: 'Blog ID and Comment ID are required' },
        { status: 400 }
      );
    }

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateCommentSchema.parse(body);

    const comments = mockComments.get(blogId) || [];
    const commentIndex = comments.findIndex(c => c.id === commentId);

    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const comment = comments[commentIndex];

    // Check if user owns the comment
    if (comment.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      );
    }

    // Update comment
    comments[commentIndex] = {
      ...comment,
      content: validatedData.content,
      updatedAt: new Date().toISOString(),
    };

    mockComments.set(blogId, comments);

    return NextResponse.json({
      success: true,
      message: 'Comment updated successfully',
      data: comments[commentIndex],
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Comment update error:', error);
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
    const { id: blogId } = await params;
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!blogId || !commentId) {
      return NextResponse.json(
        { error: 'Blog ID and Comment ID are required' },
        { status: 400 }
      );
    }

    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const comments = mockComments.get(blogId) || [];
    const commentIndex = comments.findIndex(c => c.id === commentId);

    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const comment = comments[commentIndex];

    // Check if user owns the comment or is admin
    if (comment.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      );
    }

    // Remove comment and its replies
    const filteredComments = comments.filter(c =>
      c.id !== commentId && c.parentId !== commentId
    );

    mockComments.set(blogId, filteredComments);

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });

  } catch (error) {
    console.error('Comment deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
