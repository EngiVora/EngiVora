import mongoose, { Schema, models, model } from 'mongoose'

export interface JobApplicationDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  jobId: string
  applicationId: string
  applicantInfo: {
    fullName: string
    email: string
    phone?: string
    linkedinProfile?: string
    portfolioUrl?: string
  }
  applicationDetails: {
    resumeUrl?: string
    coverLetter?: string
    expectedSalary?: string
    availableStartDate?: string
    workAuthorization?: 'citizen' | 'permanent_resident' | 'visa_required' | 'other'
    relocateWilling?: boolean
    remoteWork?: boolean
    additionalInfo?: string
  }
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'hired'
  submissionDate: Date
  lastUpdated: Date
  createdAt: Date
  updatedAt: Date
}

const JobApplicationSchema = new Schema<JobApplicationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  jobId: { type: String, required: true, index: true },
  applicationId: { type: String, required: true, unique: true, index: true },
  applicantInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    linkedinProfile: { type: String },
    portfolioUrl: { type: String }
  },
  applicationDetails: {
    resumeUrl: { type: String },
    coverLetter: { type: String },
    expectedSalary: { type: String },
    availableStartDate: { type: String },
    workAuthorization: { 
      type: String, 
      enum: ['citizen', 'permanent_resident', 'visa_required', 'other'] 
    },
    relocateWilling: { type: Boolean },
    remoteWork: { type: Boolean },
    additionalInfo: { type: String }
  },
  status: { 
    type: String, 
    enum: ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'rejected', 'hired'],
    default: 'submitted',
    index: true
  },
  submissionDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
})

// Compound index for efficient queries
JobApplicationSchema.index({ userId: 1, jobId: 1 })
JobApplicationSchema.index({ userId: 1, status: 1 })

export const JobApplication = models.JobApplication || model<JobApplicationDocument>('JobApplication', JobApplicationSchema)

