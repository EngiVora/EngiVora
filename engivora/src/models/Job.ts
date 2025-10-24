import mongoose, { Schema, models, model } from 'mongoose'

export interface JobDocument extends mongoose.Document {
  title: string
  company: string
  location?: string
  type: 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance'
  category?: 'software' | 'hardware' | 'mechanical' | 'civil' | 'electrical' | 'other'
  description?: string
  remote?: boolean
  salary?: {
    min: number
    max: number
    currency: string
  }
  requirements?: string[]
  skills?: string[]
  experience?: {
    min: number
    max: number
  }
  applicationDeadline?: Date
  applicationLink?: string
  contactEmail?: string
  isActive: boolean
  featured?: boolean
  // Add image field
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<JobDocument>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  type: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'], required: true },
  category: { type: String, enum: ['software', 'hardware', 'mechanical', 'civil', 'electrical', 'other'] },
  description: { type: String, required: true },
  remote: { type: Boolean, default: false },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  requirements: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  applicationDeadline: { type: Date },
  applicationLink: { type: String },
  contactEmail: { type: String },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  // Add image field to schema
  imageUrl: { type: String },
}, { timestamps: true })

export const Job = models.Job || model<JobDocument>('Job', JobSchema)