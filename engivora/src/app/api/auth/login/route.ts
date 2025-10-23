import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { User, UserDocument } from "@/models/User";
import { findUserByEmail } from "@/lib/auth-db";

export const runtime = "nodejs";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Use environment JWT_SECRET or fallback to development secret
const JWT_SECRET = (process.env.JWT_SECRET ||
  "dev-fallback-secret-key-change-in-production") as Secret;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Check JWT_SECRET (only fail if explicitly empty, allow fallback)
    if (!JWT_SECRET) {
      console.error("JWT_SECRET not configured and no fallback available");
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "JWT_SECRET is not properly configured",
        },
        { status: 500 },
      );
    }

    // Log warning in development if using fallback secret
    if (
      JWT_SECRET === "dev-fallback-secret-key-change-in-production" &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "Using fallback JWT_SECRET for development. Set JWT_SECRET environment variable for production.",
      );
    }

    // Try database-first authentication, fallback to mock users
    try {
      await connectToDatabase();
      const userDoc = await User.findOne({ email: validatedData.email });

      if (userDoc) {
        const passwordMatch = await bcrypt.compare(
          validatedData.password,
          userDoc.passwordHash,
        );
        if (!passwordMatch) {
          return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 },
          );
        }

        const expiresInEnv = process.env.JWT_EXPIRES_IN;
        const signOptions: SignOptions = {
          expiresIn:
            expiresInEnv && expiresInEnv.trim() !== ""
              ? isNaN(Number(expiresInEnv))
                ? expiresInEnv
                : Number(expiresInEnv)
              : 604800,
        } as SignOptions;

        const token = jwt.sign(
          {
            sub: (userDoc._id as any).toString(),
            name: userDoc.name,
            email: userDoc.email,
            role: userDoc.role,
          },
          JWT_SECRET,
          signOptions,
        );

        const response = NextResponse.json({
          success: true,
          message: "Login successful",
          user: {
            id: (userDoc._id as any).toString(),
            name: userDoc.name,
            email: userDoc.email,
            role: userDoc.role,
            department: userDoc.department,
          },
          token,
        });

        response.cookies.set("adminToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        });

        return response;
      }

      // If DB is available but user not found, fall through to mock users
    } catch (dbError) {
      console.log("Database not available, using mock authentication");
    }

    // Fallback to mock users for development/testing
    const mockUser = findUserByEmail(validatedData.email);
    if (!mockUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(
      validatedData.password,
      mockUser.password,
    );
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const expiresInEnv = process.env.JWT_EXPIRES_IN;
    const signOptions: SignOptions = {
      expiresIn:
        expiresInEnv && expiresInEnv.trim() !== ""
          ? isNaN(Number(expiresInEnv))
            ? expiresInEnv
            : Number(expiresInEnv)
          : 604800,
    } as SignOptions;

    const token = jwt.sign(
      {
        sub: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      },
      JWT_SECRET,
      signOptions,
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        department: mockUser.department,
      },
      token,
    });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Login endpoint - POST method required",
      endpoints: {
        POST: "/api/auth/login - Login user",
      },
    },
    { status: 405 },
  );
}
