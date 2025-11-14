import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for interactions
const interactionSchema = z.object({
  action: z.enum(["like", "unlike", "bookmark", "unbookmark", "share"]),
  userId: z.string().optional(),
});

// Mock storage for interactions (in production, use database)
const mockInteractions = new Map<
  string,
  {
    likes: Set<string>;
    bookmarks: Set<string>;
    shares: number;
  }
>();

// Helper function to get or create blog interactions
function getBlogInteractions(blogId: string) {
  if (!mockInteractions.has(blogId)) {
    mockInteractions.set(blogId, {
      likes: new Set(),
      bookmarks: new Set(),
      shares: 0,
    });
  }
  return mockInteractions.get(blogId)!;
}

// Helper function to get user from token/session
function getUserFromRequest(request: NextRequest): string | null {
  // In production, extract user ID from JWT token or session
  // For now, return a mock user ID or extract from headers
  const userId = request.headers.get("x-user-id") || "anonymous-user";
  return userId;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: blogId } = await params;

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = interactionSchema.parse(body);
    const userId = getUserFromRequest(request);

    if (!userId && validatedData.action !== "share") {
      return NextResponse.json(
        { error: "User authentication required" },
        { status: 401 },
      );
    }

    const interactions = getBlogInteractions(blogId);
    let message = "";
    const data: any = {};

    switch (validatedData.action) {
      case "like":
        if (userId) {
          interactions.likes.add(userId);
          message = "Blog liked successfully";
          data.isLiked = true;
          data.likesCount = interactions.likes.size;
        }
        break;

      case "unlike":
        if (userId) {
          interactions.likes.delete(userId);
          message = "Blog unliked successfully";
          data.isLiked = false;
          data.likesCount = interactions.likes.size;
        }
        break;

      case "bookmark":
        if (userId) {
          interactions.bookmarks.add(userId);
          message = "Blog bookmarked successfully";
          data.isBookmarked = true;
          data.bookmarksCount = interactions.bookmarks.size;
        }
        break;

      case "unbookmark":
        if (userId) {
          interactions.bookmarks.delete(userId);
          message = "Blog removed from bookmarks";
          data.isBookmarked = false;
          data.bookmarksCount = interactions.bookmarks.size;
        }
        break;

      case "share":
        interactions.shares++;
        message = "Blog shared successfully";
        data.sharesCount = interactions.shares;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message,
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Blog interaction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: blogId } = await params;

    if (!blogId) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 },
      );
    }

    const userId = getUserFromRequest(request);
    const interactions = getBlogInteractions(blogId);

    const data = {
      likesCount: interactions.likes.size,
      bookmarksCount: interactions.bookmarks.size,
      sharesCount: interactions.shares,
      userInteractions: userId
        ? {
            isLiked: interactions.likes.has(userId),
            isBookmarked: interactions.bookmarks.has(userId),
          }
        : null,
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Blog interactions fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
