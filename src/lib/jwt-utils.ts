import jwt, { Secret } from "jsonwebtoken";
import { User } from "@/models/User";
import { findUserById } from "@/lib/auth-db";
import { connectToDatabase } from "@/lib/db";

const JWT_SECRET = (process.env.JWT_SECRET || "") as Secret;

export interface JwtPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function verifyAdminToken(token: string): Promise<{
  success: boolean;
  payload?: JwtPayload;
  user?: any;
  error?: string;
}> {
  try {
    if (!JWT_SECRET || JWT_SECRET === "") {
      return {
        success: false,
        error: "Server configuration error: JWT_SECRET not configured",
      };
    }

    // Verify the token
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Check if user has admin role
    if (payload.role !== "admin") {
      return {
        success: false,
        error: "Access denied: Admin privileges required",
      };
    }

    // Try to find user in database first
    try {
      await connectToDatabase();
      const userDoc = await User.findById(payload.sub);

      if (userDoc) {
        return {
          success: true,
          payload,
          user: {
            id: userDoc._id.toString(),
            name: userDoc.name,
            email: userDoc.email,
            role: userDoc.role,
            department: userDoc.department,
          },
        };
      }
    } catch (error) {
      console.warn("Database not available, using mock users:", error);
    }

    // Fallback to mock users
    const mockUser = findUserById(payload.sub);
    if (mockUser) {
      return {
        success: true,
        payload,
        user: mockUser,
      };
    }

    return {
      success: false,
      error: "User not found",
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        error: "Token expired",
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    console.error("Token verification error:", error);
    return {
      success: false,
      error: "Token verification failed",
    };
  }
}
