import mongoose, { Schema, models, model } from 'mongoose'

export interface StudentDocument extends mongoose.Document {
  student_id: string
  full_name: string
  email: string
  password_hash: string
  signup_date: Date
  last_login: Date
  courses_enrolled: string[]
  createdAt: Date
  updatedAt: Date
}

const StudentSchema = new Schema<StudentDocument>({
  student_id: { type: String, required: true, unique: true, index: true },
  full_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  signup_date: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now },
  courses_enrolled: { type: [String], default: [] }
}, { 
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete (ret as { password_hash?: string }).password_hash
      return ret
    }
  }
})

// Ensure student_id is unique
StudentSchema.index({ student_id: 1 }, { unique: true })
StudentSchema.index({ email: 1 }, { unique: true })

export const Student = models.Student || model<StudentDocument>('Student', StudentSchema)