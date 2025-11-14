import mongoose, { Schema, models, model } from 'mongoose'

export interface NotificationDocument extends mongoose.Document {
  title: string
  message: string
  type: string
  priority: string
  status: string
  recipient: string
  isArchived: boolean
  category: string
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<NotificationDocument>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true },
  recipient: { type: String, required: true },
  isArchived: { type: Boolean, default: false },
  category: { type: String, required: true },
}, { timestamps: true })

export const Notification = models.Notification || model<NotificationDocument>('Notification', NotificationSchema)