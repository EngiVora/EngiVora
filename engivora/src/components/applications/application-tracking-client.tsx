"use client"

import { useState } from 'react'
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, XCircle, Eye, Download, ExternalLink, Share2 } from 'lucide-react'
import { OptimizedImage } from '@/components/optimized-image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Application {
  applicationId: string
  jobId: string
  jobTitle: string
  company: string
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'accepted' | 'withdrawn'
  submissionDate: string
  lastUpdated: string
  timeline: Array<{
    status: string
    date: string
    description: string
  }>
  documents: Array<{
    name: string
    type: string
    uploadedAt: string
    size: string
  }>
}

interface Job {
  _id: string
  title: string
  company: string
  description: string
  location: string
  type: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  image?: string
}

interface ApplicationTrackingClientProps {
  application: Application
  job?: Job | null
}

export function ApplicationTrackingClient({ application, job }: ApplicationTrackingClientProps) {
  const [showShareModal, setShowShareModal] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'under_review':
        return <Eye className="w-5 h-5 text-yellow-500" />
      case 'shortlisted':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5 text-purple-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'shortlisted':
        return 'bg-green-100 text-green-800'
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Application Status - ${application.jobTitle}`,
        text: `Check my application status for ${application.jobTitle} at ${application.company}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShowShareModal(true)
      setTimeout(() => setShowShareModal(false), 2000)
    }
  }

  const formatSalary = (salary: any) => {
    if (!salary) return 'Not specified'
    const { min, max, currency } = salary
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {job?.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <OptimizedImage
                      src={job.image}
                      alt={`${job.company} logo`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      fallbackSrc="/images/company-placeholder.svg"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{application.jobTitle}</h1>
                  <p className="text-lg text-gray-600">{application.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Applied on {formatDate(application.submissionDate)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Last updated {formatDistanceToNow(new Date(application.lastUpdated), { addSuffix: true })}</span>
                </div>
              </div>

              {job && (
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                  {job.salary && (
                    <>
                      <span>•</span>
                      <span>{formatSalary(job.salary)}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className={`px-4 py-2 rounded-lg text-center ${getStatusColor(application.status)}`}>
                <div className="flex items-center justify-center gap-2">
                  {getStatusIcon(application.status)}
                  <span className="font-semibold">{getStatusText(application.status)}</span>
                </div>
              </div>
              
              <button
                onClick={handleShare}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Status
              </button>
            </div>
          </div>
        </div>

        {/* Application Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Application Timeline</h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {application.timeline.map((item, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center z-10">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{getStatusText(item.status)}</h3>
                      <span className="text-sm text-gray-500">{formatDate(item.date)}</span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Application ID:</span>
                <span className="font-mono text-sm text-gray-900">{application.applicationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Submission Date:</span>
                <span className="text-gray-900">{formatDate(application.submissionDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-900">{formatDate(application.lastUpdated)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(application.status)}`}>
                  {getStatusText(application.status)}
                </span>
              </div>
            </div>

            {job && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900">{job.type}</span>
                  </div>
                  {job.salary && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span className="text-gray-900">{formatSalary(job.salary)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submitted Documents</h2>
            
            <div className="space-y-3">
              {application.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {doc.type.replace('_', ' ')} • {doc.size} • {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <button 
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
          
          <div className="flex flex-wrap gap-4">
            {job && (
              <Link
                href={`/jobs/${job._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Job Posting
              </Link>
            )}
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
              Download Application
            </button>
            
            {application.status === 'under_review' && (
              <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                <XCircle className="w-4 h-4" />
                Withdraw Application
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Link Copied!</h3>
            <p className="text-gray-600">Application tracking link has been copied to your clipboard.</p>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
