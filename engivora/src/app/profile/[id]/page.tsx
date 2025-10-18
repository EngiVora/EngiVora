import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/db'
import { Student } from '@/models/Student'
import { StudentProfileClient } from '@/components/profile/student-profile-client'

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

async function getStudentById(id: string) {
  try {
    await connectToDatabase()
    const student = await Student.findById(id).select('-password -__v')
    return student
  } catch (error) {
    console.error('Error fetching student:', error)
    return null
  }
}

async function getRelatedStudents(currentStudentId: string, skills: string[], limit = 3) {
  try {
    await connectToDatabase()
    const relatedStudents = await Student.find({
      _id: { $ne: currentStudentId },
      skills: { $in: skills },
      isActive: true
    })
    .select('name email skills profilePicture college yearOfStudy')
    .limit(limit)
    
    return relatedStudents
  } catch (error) {
    console.error('Error fetching related students:', error)
    return []
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params
  const student = await getStudentById(id)

  if (!student) {
    return {
      title: 'Profile Not Found - EngiVora',
      description: 'The requested profile could not be found.',
    }
  }

  const title = `${student.name} - Student Profile - EngiVora`
  const description = `View ${student.name}'s profile. ${student.bio || `Engineering student at ${student.college}`}. Skills: ${student.skills?.join(', ') || 'Various'}`

  return {
    title,
    description,
    keywords: [
      'engineering student',
      student.college || '',
      student.skills?.join(', ') || '',
      student.name || ''
    ].filter(Boolean).join(', '),
    authors: [{ name: student.name }],
    openGraph: {
      title,
      description,
      type: 'profile',
      images: student.profilePicture ? [student.profilePicture] : ['/images/user-placeholder.jpg'],
      siteName: 'EngiVora',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: student.profilePicture ? [student.profilePicture] : ['/images/user-placeholder.jpg'],
    },
    alternates: {
      canonical: `/profile/${id}`,
    },
  }
}

export async function generateStaticParams() {
  try {
    await connectToDatabase()
    const students = await Student.find({ isActive: true })
      .select('_id')
      .limit(100)
    
    return students.map((student) => ({
      id: student._id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params for profiles:', error)
    return []
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  const student = await getStudentById(id)

  if (!student) {
    notFound()
  }

  const relatedStudents = await getRelatedStudents(id, student.skills || [])

  return (
    <StudentProfileClient 
      student={student} 
      relatedStudents={relatedStudents}
    />
  )
}
