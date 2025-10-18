import mongoose, { Schema, models, model } from 'mongoose'

export interface ExamDocument extends mongoose.Document {
  title: string
  organization: string
  date: Date
  category?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const ExamSchema = new Schema<ExamDocument>({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String },
  description: { type: String },
}, { timestamps: true })

export const Exam = models.Exam || model<ExamDocument>('Exam', ExamSchema)