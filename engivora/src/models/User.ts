import mongoose, { Schema, models, model } from 'mongoose'

export type UserRole = 'student' | 'admin'

export interface UserDocument extends mongoose.Document {
  name: string
  email: string
  passwordHash: string
  imageUrl?: string
  profilePicture?: string
  role: UserRole
  department?: string
  year?: string
  rollNumber?: string
  dateOfBirth?: Date
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// Only define the schema and model if we're not in build phase
let User: mongoose.Model<UserDocument>;

if (process.env.NEXT_PHASE !== 'phase-production-build') {
  const UserSchema = new Schema<UserDocument>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    imageUrl: { type: String },
    profilePicture: { type: String },
    role: { type: String, enum: ['student', 'admin'], default: 'student', index: true },
    department: { type: String },
    year: { type: String },
    rollNumber: { type: String },
    dateOfBirth: { type: Date },
    lastLogin: { type: Date }
  }, { timestamps: true })

  User = models.User || model<UserDocument>('User', UserSchema)
} else {
  // Provide a mock during build time
  User = {} as mongoose.Model<UserDocument>;
}

export { User }