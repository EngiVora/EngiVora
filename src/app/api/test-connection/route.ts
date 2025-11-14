import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Student } from '@/models/Student';
import { AdminBlog } from '@/models/AdminBlog';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Connect to database
    const connection = await connectToDatabase();
    
    // Get database info
    const db = connection.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection is not established' },
        { status: 500 }
      );
    }
    
    const dbName = db.databaseName;
    
    // Get collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get document counts
    const studentCount = await Student.countDocuments();
    const blogCount = await AdminBlog.countDocuments();
    
    // Connection details
    const connectionDetails = {
      host: connection.connection.host,
      port: connection.connection.port,
      readyState: connection.connection.readyState,
    };
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB Atlas',
      database: dbName,
      collections: collectionNames,
      documentCounts: {
        students: studentCount,
        blogs: blogCount,
      },
      connection: connectionDetails,
    });
  } catch (error) {
    console.error('MongoDB Atlas connection test failed:', error);
    
    let errorMessage = 'Failed to connect to MongoDB Atlas';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        message: 'MongoDB Atlas connection test failed'
      },
      { status: 500 }
    );
  }
}