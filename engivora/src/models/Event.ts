import mongoose, { Schema, models, model } from 'mongoose'

export interface EventDocument extends mongoose.Document {
  title: string
  description: string
  type: string
  status: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  location: string
  isOnline: boolean
  maxAttendees: number
  registeredAttendees: number
  price: number
  organizer: string
  category: string
  tags: string[]
  featured: boolean
  imageUrl: string
  requirements: string
  agenda: string[]
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<EventDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
  maxAttendees: { type: Number, required: true },
  registeredAttendees: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  organizer: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  imageUrl: { type: String },
  requirements: { type: String },
  agenda: { type: [String], default: [] },
}, { timestamps: true })

export const Event = models.Event || model<EventDocument>('Event', EventSchema)