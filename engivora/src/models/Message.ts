import mongoose, { Schema, models, model } from 'mongoose'

export interface MessageDocument extends mongoose.Document {
  subject: string
  sender: string
  recipient: string
  content: string
  type: string
  status: string
  priority: string
  isStarred: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<MessageDocument>({
  subject: { type: String, required: true },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  isStarred: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true })

export const Message = models.Message || model<MessageDocument>('Message', MessageSchema)