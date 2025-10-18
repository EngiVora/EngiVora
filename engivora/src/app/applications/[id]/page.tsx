import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/db'
import { Job } from '@/models/Job'
import { ApplicationTrackingClient } from '@/components/applications/application-tracking-client'

interface ApplicationPageProps {
  params: Promise<{ id: string }>
}

async function getJobById(id: string) {
  try {
    await connectToDatabase()
    const job = await Job.findById(id)
    return job
  } catch (error) {
    console.error('Error fetching job:', error)
    return null
  }
}

// Mock application data - in a real app, this would come from a database
async function getApplicationDetails(applicationId: string) {
  // This is mock data - replace with actual database query
  const mockApplications = [
    {
      applicationId: applicationId,
      jobId: applicationId,
      jobTitle: 'Software Engineer',
      company: 'Tech Solutions Inc',
      status: 'under_review' as const,
      submissionDate: '2024-07-15T10:30:00Z',
      lastUpdated: '2024-07-18T14:20:00Z',
      timeline: [
        {
          status: 'submitted',
          date: '2024-07-15T10:30:00Z',
          description: 'Application submitted successfully'
        },
        {
          status: 'under_review',
          date: '2024-07-16T09:15:00Z',
          description: 'Application is being reviewed by HR team'
        }
      ],
      documents: [
        {
          name: 'Resume.pdf',
          type: 'resume',
          uploadedAt: '2024-07-15T10:30:00Z',
          size: '2.1 MB'
        },
        {
          name: 'Cover_Letter.pdf',
          type: 'cover_letter',
          uploadedAt: '2024-07-15T10:30:00Z',
          size: '1.2 MB'
        }
      ]
    }
  ]

  return mockApplications.find(app => app.applicationId === applicationId) || null
}

export async function generateMetadata({ params }: ApplicationPageProps): Promise<Metadata> {
  const { id } = await params
  const application = await getApplicationDetails(id)

  if (!application) {
    return {
      title: 'Application Not Found - EngiVora',
      description: 'The requested application could not be found.',
    }
  }

  const title = `Application Status - ${application.jobTitle} at ${application.company} - EngiVora`
  const description = `Track your application status for ${application.jobTitle} position at ${application.company}. Current status: ${application.status}`

  return {
    title,
    description,
    keywords: [
      'job application',
      'application tracking',
      application.jobTitle,
      application.company,
      'career'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'EngiVora',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/applications/${id}`,
    },
  }
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { id } = await params
  const application = await getApplicationDetails(id)
  const job = await getJobById(id)

  if (!application) {
    notFound()
  }

  return (
    <ApplicationTrackingClient 
      application={application}
      job={job}
    />
  )
}
