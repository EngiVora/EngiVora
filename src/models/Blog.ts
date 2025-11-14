import mongoose, { Schema, models, model } from 'mongoose'

export interface BlogDocument extends mongoose.Document {
  title: string
  slug: string
  summary: string
  content: string
  category: 'technology' | 'career' | 'academic' | 'lifestyle' | 'news'
  tags: string[]
  authorId?: mongoose.Types.ObjectId
  featured: boolean
  published: boolean
  views: number
  likes: number
  // Add image field
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<BlogDocument>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['technology', 'career', 'academic', 'lifestyle', 'news'], required: true },
  tags: { type: [String], default: [] },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  // Add image field to schema
  imageUrl: { type: String },
}, { timestamps: true })

// Fix the text index - don't include tags in text index since it's an array
BlogSchema.index({ title: 'text', summary: 'text', content: 'text' })
// Create a separate index for tags
BlogSchema.index({ tags: 1 })

export const Blog = models.Blog || model<BlogDocument>('Blog', BlogSchema)