import mongoose, { Schema, models, model } from 'mongoose'

export interface DiscountDocument extends mongoose.Document {
  code: string
  description?: string
  percentage: number
  expiresAt?: Date
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const DiscountSchema = new Schema<DiscountDocument>({
  code: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  expiresAt: { type: Date },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export const Discount = models.Discount || model<DiscountDocument>('Discount', DiscountSchema)


