import jwt, { Secret } from "jsonwebtoken";
import { User, UserDocument } from "@/models/User";
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
      console.error("JWT_SECRET not configured");
      return {
        success: false,
        error: "Server configuration error: JWT_SECRET not configured",
      };
    }

    // Verify the token
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        console.error("Token expired");
        return {
          success: false,
          error: "Token expired",
        };
      }
      if (jwtError instanceof jwt.JsonWebTokenError) {
        console.error("JWT verification error:", jwtError.message);
        return {
          success: false,
          error: `Invalid token: ${jwtError.message}`,
        };
      }
      throw jwtError;
    }

    console.log("Token payload decoded:", { sub: payload.sub, role: payload.role });

    // Check if user has admin role
    if (payload.role !== "admin") {
      console.error("User does not have admin role:", payload.role);
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
        console.log("User found in database:", userDoc.email);
        return {
          success: true,
          payload,
          user: {
            id: (userDoc._id as any).toString(),
            name: userDoc.name,
            email: userDoc.email,
            role: userDoc.role,
            department: userDoc.department,
          },
        };
      } else {
        console.warn("User not found in database, trying mock users");
      }
    } catch (error) {
      console.warn("Database not available, using mock users:", error instanceof Error ? error.message : error);
    }

    // Fallback to mock users
    const mockUser = findUserById(payload.sub);
    if (mockUser) {
      console.log("User found in mock users:", mockUser.email);
      return {
        success: true,
        payload,
        user: mockUser,
      };
    }

    console.error("User not found in database or mock users:", payload.sub);
    return {
      success: false,
      error: "User not found",
    };
  } catch (error) {
    console.error("Unexpected token verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Token verification failed",
    };
  }
}