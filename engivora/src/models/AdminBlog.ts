import mongoose, { Schema, models, model } from 'mongoose'

export interface AdminBlogDocument extends mongoose.Document {
  blog_id: string
  title: string
  slug: string
  content: string
  author_id: string
  tags: string[]
  published_date: Date
  last_updated: Date
  status: 'draft' | 'published' | 'archived'
  createdAt: Date
  updatedAt: Date
}

const AdminBlogSchema = new Schema<AdminBlogDocument>({
  blog_id: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author_id: { type: String, required: true },
  tags: { type: [String], default: [] },
  published_date: { type: Date },
  last_updated: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' }
}, { 
  timestamps: true 
})

// Indexes for non-unique fields (blog_id and slug already have unique indexes via unique: true)
AdminBlogSchema.index({ author_id: 1 })
AdminBlogSchema.index({ status: 1 })

export const AdminBlog = models.AdminBlog || model<AdminBlogDocument>('AdminBlog', AdminBlogSchema)