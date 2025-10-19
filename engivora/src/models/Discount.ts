import mongoose, { Schema, models, model } from 'mongoose'

export interface DiscountDocument extends mongoose.Document {
  code: string
  title: string
  description?: string
  category: string
  discountType: 'percentage' | 'fixed' | 'bogo' | 'free'
  discountValue: number
  originalPrice?: number
  discountedPrice?: number
  provider: string
  websiteUrl: string
  imageUrl?: string
  validFrom: Date
  validUntil: Date
  termsAndConditions?: string[]
  eligibility?: string[]
  maxUsage?: number
  featured: boolean
  active: boolean
  percentage: number
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const DiscountSchema = new Schema<DiscountDocument>({
  code: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed', 'bogo', 'free'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discountedPrice: { type: Number, min: 0 },
  provider: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  imageUrl: { type: String },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  termsAndConditions: { type: [String] },
  eligibility: { type: [String] },
  maxUsage: { type: Number, min: 1 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  percentage: { type: Number, required: true, min: 0 },
  expiresAt: { type: Date },
}, { timestamps: true })

export const Discount = models.Discount || model<DiscountDocument>('Discount', DiscountSchema)