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
  if (cached.conn) return cached.conn

  const uri = process.env.MONGODB_URI as string | undefined
  if (!uri) {
    throw new Error('Database is not configured. Please set MONGODB_URI in your environment.')
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB || 'originalEngivora',
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}


