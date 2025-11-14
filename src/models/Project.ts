import mongoose, { Schema, models, model } from 'mongoose'

export interface ProjectDocument extends mongoose.Document {
  title: string
  description: string
  category: 'web' | 'mobile' | 'ai-ml' | 'robotics' | 'iot' | 'blockchain' | 'gaming' | 'other'
  techStack: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: {
    estimate: number
    unit: 'days' | 'weeks' | 'months'
  }
  teamSize: {
    min: number
    max: number
    current: number
  }
  requirements: string[]
  goals: string[]
  resources: Array<{
    title: string
    url: string
    type: 'documentation' | 'tutorial' | 'repository' | 'tool' | 'other'
  }>
  tags: string[]
  isPublic: boolean
  lookingForMembers: boolean
  featured: boolean
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  progress: number
  owner: {
    userId: mongoose.Types.ObjectId
    name: string
    email: string
  }
  members: Array<{
    userId: mongoose.Types.ObjectId
    name: string
    email: string
    role: 'owner' | 'lead' | 'member'
    joinedAt: Date
  }>
  applications: Array<{
    id: string
    userId: mongoose.Types.ObjectId
    userName: string
    userEmail: string
    message: string
    status: 'pending' | 'accepted' | 'rejected'
    appliedAt: Date
  }>
  likes: number
  views: number
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<ProjectDocument>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['web', 'mobile', 'ai-ml', 'robotics', 'iot', 'blockchain', 'gaming', 'other'],
    required: true,
    index: true
  },
  techStack: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
    index: true
  },
  duration: {
    estimate: { type: Number, required: true },
    unit: { type: String, enum: ['days', 'weeks', 'months'], required: true }
  },
  teamSize: {
    min: { type: Number, required: true, min: 1 },
    max: { type: Number, required: true, min: 1 },
    current: { type: Number, default: 1, min: 0 }
  },
  requirements: [{ type: String }],
  goals: [{ type: String }],
  resources: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['documentation', 'tutorial', 'repository', 'tool', 'other'],
      required: true
    }
  }],
  tags: [{ type: String, index: true }],
  isPublic: { type: Boolean, default: true, index: true },
  lookingForMembers: { type: Boolean, default: true, index: true },
  featured: { type: Boolean, default: false, index: true },
  status: { 
    type: String, 
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning',
    index: true
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  owner: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['owner', 'lead', 'member'],
      default: 'member'
    },
    joinedAt: { type: Date, default: Date.now }
  }],
  applications: [{
    id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    message: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    appliedAt: { type: Date, default: Date.now }
  }],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  imageUrl: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
})

// Indexes for efficient queries
ProjectSchema.index({ 'owner.userId': 1, status: 1 })
ProjectSchema.index({ 'members.userId': 1 })
ProjectSchema.index({ category: 1, status: 1, featured: 1 })
ProjectSchema.index({ tags: 1, isPublic: 1 })

export const Project = models.Project || model<ProjectDocument>('Project', ProjectSchema)

