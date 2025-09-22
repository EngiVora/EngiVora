import mongoose, { Schema, models, model } from 'mongoose'

export interface JobDocument extends mongoose.Document {
  title: string
  company: string
  location?: string
  type: 'full-time' | 'part-time' | 'internship' | 'contract'
  applyUrl: string
  deadline?: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<JobDocument>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  type: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract'], required: true },
  applyUrl: { type: String, required: true },
  deadline: { type: Date },
  description: { type: String },
}, { timestamps: true })

export const Job = models.Job || model<JobDocument>('Job', JobSchema)


