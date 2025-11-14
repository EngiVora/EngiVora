import mongoose, { Schema, models, model } from 'mongoose'

export interface ActivityLogDocument extends mongoose.Document {
  timestamp: Date
  user: string
  email: string
  action: string
  resource: string
  ipAddress: string
  userAgent: string
  device: string
  location: string
  status: string
  details: string
  createdAt: Date
  updatedAt: Date
}

const ActivityLogSchema = new Schema<ActivityLogDocument>({
  timestamp: { type: Date, required: true },
  user: { type: String, required: true },
  email: { type: String, required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  device: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
  details: { type: String, required: true },
}, { timestamps: true })

export const ActivityLog = models.ActivityLog || model<ActivityLogDocument>('ActivityLog', ActivityLogSchema)