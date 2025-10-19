import mongoose, { Schema, models, model } from 'mongoose'

export interface ExamDocument extends mongoose.Document {
  title: string
  organization: string
  date: Date
  category?: string
  description?: string
  type: 'entrance' | 'competitive' | 'certification' | 'placement'
  applicationFee: number
  eligibility: string[]
  syllabus?: string[]
  examCenters?: string[]
  officialWebsite?: string
  isActive: boolean
  registrationStartDate: Date
  registrationEndDate: Date
  createdAt: Date
  updatedAt: Date
}

const ExamSchema = new Schema<ExamDocument>({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, enum: ['engineering', 'medical', 'management', 'law', 'general'] },
  description: { type: String },
  type: { type: String, enum: ['entrance', 'competitive', 'certification', 'placement'], required: true },
  applicationFee: { type: Number, required: true, min: 0 },
  eligibility: { type: [String], default: [] },
  syllabus: { type: [String] },
  examCenters: { type: [String] },
  officialWebsite: { type: String },
  isActive: { type: Boolean, default: true },
  registrationStartDate: { type: Date, required: true },
  registrationEndDate: { type: Date, required: true },
}, { timestamps: true })

export const Exam = models.Exam || model<ExamDocument>('Exam', ExamSchema)