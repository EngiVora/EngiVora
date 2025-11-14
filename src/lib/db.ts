import mongoose from 'mongoose'

interface MongooseGlobal {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

declare const global: typeof globalThis & MongooseGlobal

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return early if we're in a build environment (no database needed)
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Skipping database connection during build phase')
    // Return a mock connection object for build process
    return mongoose
  }

  if (cached.conn) return cached.conn

  const uri = process.env.MONGODB_URI as string | undefined
  if (!uri) {
    throw new Error('Database is not configured. Please set MONGODB_URI in your environment.')
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB || 'originalEngivora',
      // Add connection options for better reliability
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}