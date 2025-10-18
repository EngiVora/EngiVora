import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
import { connectToDatabase } from '@/lib/db'
import { User } from '@/models/User'
import { Blog } from '@/models/Blog'
import { Exam } from '@/models/Exam'
import { Job } from '@/models/Job'
import { Discount } from '@/models/Discount'
import bcrypt from 'bcryptjs'

export async function POST(_request: NextRequest) {
  try {
    const mongooseInstance = await connectToDatabase()

    // Ensure required collections exist without inserting dummy data
    const db = mongooseInstance.connection.db
    if (!db) {
      throw new Error('Database connection is not available')
    }
    const requiredCollections = [
      User.collection.name,
      Blog.collection.name,
      Exam.collection.name,
      Job.collection.name,
      Discount.collection.name,
    ]

    const existing = await db.listCollections().toArray()
    const existingNames = new Set(existing.map(c => c.name))
    for (const name of requiredCollections) {
      if (!existingNames.has(name)) {
        await db.createCollection(name)
      }
    }

    const existingAdmin = await User.findOne({ email: 'admin@engivora.com' })
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin already exists',
        user: {
          id: existingAdmin._id.toString(),
          email: existingAdmin.email,
          role: existingAdmin.role,
        },
      })
    }

    const passwordHash = await bcrypt.hash('admin123', 10)
    const created = await User.create({
      name: 'Admin User',
      email: 'admin@engivora.com',
      passwordHash,
      role: 'admin',
      department: 'Administration',
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created',
      user: {
        id: created._id.toString(),
        email: created.email,
        role: created.role,
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to create a default admin user (admin@engivora.com / admin123)'
  })
}


