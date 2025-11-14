import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdminManagementClient } from '@/components/admin/admin-management-client'

interface AdminManagePageProps {
  params: Promise<{ type: string }>
}

const validTypes = ['users', 'jobs', 'blogs', 'events', 'exams', 'applications', 'analytics']

export async function generateMetadata({ params }: AdminManagePageProps): Promise<Metadata> {
  const { type } = await params

  if (!validTypes.includes(type)) {
    return {
      title: 'Page Not Found - EngiVora Admin',
    }
  }

  const title = `Manage ${type.charAt(0).toUpperCase() + type.slice(1)} - EngiVora Admin`
  const description = `Admin panel for managing ${type} on EngiVora platform.`

  return {
    title,
    description,
    robots: 'noindex, nofollow', // Admin pages should not be indexed
  }
}

export default async function AdminManagePage({ params }: AdminManagePageProps) {
  const { type } = await params

  if (!validTypes.includes(type)) {
    notFound()
  }

  return <AdminManagementClient type={type} />
}
