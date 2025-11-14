import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/db'
import { Exam } from '@/models/Exam'
import { ExamDetailClient } from '@/components/exams/exam-detail-client'
import mongoose from 'mongoose'

interface ExamPageProps {
  params: Promise<{ id: string }>
}

async function getExamById(id: string) {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid exam ID format:', id)
      return null
    }
    
    await connectToDatabase()
    const exam = await Exam.findById(id)
    
    if (!exam) {
      return null
    }

    // Transform database exam to match ExamDetailClient interface
    return {
      _id: exam._id.toString(),
      title: exam.title,
      description: exam.description || '',
      category: exam.category || 'general',
      conductingBody: exam.organization || 'Unknown Organization',
      date: exam.date ? new Date(exam.date).toISOString() : new Date().toISOString(),
      time: '09:00', // Default time if not in database
      duration: 180, // Default duration in minutes if not in database
      location: exam.examCenters && exam.examCenters.length > 0 
        ? exam.examCenters.join(', ') 
        : 'Multiple Locations',
      isOnline: false, // Default to false
      fee: exam.applicationFee || 0,
      eligibility: Array.isArray(exam.eligibility) 
        ? exam.eligibility.join('\n') 
        : (exam.eligibility || 'No eligibility criteria specified'),
      syllabus: exam.syllabus || [],
      importantDates: [
        {
          event: 'Registration Start',
          date: exam.registrationStartDate ? new Date(exam.registrationStartDate).toISOString() : exam.date ? new Date(exam.date).toISOString() : new Date().toISOString()
        },
        {
          event: 'Registration End',
          date: exam.registrationEndDate ? new Date(exam.registrationEndDate).toISOString() : exam.date ? new Date(exam.date).toISOString() : new Date().toISOString()
        },
        {
          event: 'Exam Date',
          date: exam.date ? new Date(exam.date).toISOString() : new Date().toISOString()
        }
      ],
      applicationLink: exam.officialWebsite || undefined,
      brochureLink: undefined,
      imageUrl: exam.imageUrl,
      isActive: exam.isActive ?? true,
      featured: false, // Default to false if not in database
      createdAt: exam.createdAt ? new Date(exam.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: exam.updatedAt ? new Date(exam.updatedAt).toISOString() : new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching exam:', error)
    return null
  }
}

async function getRelatedExams(currentExamId: string, category: string, limit = 3) {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(currentExamId)) {
      console.error('Invalid exam ID format for related exams:', currentExamId)
      return []
    }
    
    await connectToDatabase()
    
    // Build query object
    const query: any = {
      _id: { $ne: new mongoose.Types.ObjectId(currentExamId) },
      isActive: true
    }
    
    // Only filter by category if it's provided and not empty
    if (category && category !== 'general') {
      query.category = category
    }
    
    const relatedExams = await Exam.find(query)
    .sort({ date: 1 })
    .limit(limit)
    
    // Transform related exams to match ExamDetailClient interface
    return relatedExams.map(exam => ({
      _id: exam._id.toString(),
      title: exam.title,
      description: exam.description || '',
      category: exam.category || 'general',
      conductingBody: exam.organization || 'Unknown Organization',
      date: exam.date ? new Date(exam.date).toISOString() : new Date().toISOString(),
      time: '09:00',
      duration: 180,
      location: exam.examCenters && exam.examCenters.length > 0 
        ? exam.examCenters.join(', ') 
        : 'Multiple Locations',
      isOnline: false,
      fee: exam.applicationFee || 0,
      eligibility: Array.isArray(exam.eligibility) 
        ? exam.eligibility.join('\n') 
        : (exam.eligibility || ''),
      syllabus: exam.syllabus || [],
      importantDates: [],
      applicationLink: exam.officialWebsite || undefined,
      brochureLink: undefined,
      imageUrl: exam.imageUrl,
      isActive: exam.isActive ?? true,
      featured: false,
      createdAt: exam.createdAt ? new Date(exam.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: exam.updatedAt ? new Date(exam.updatedAt).toISOString() : new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error fetching related exams:', error)
    return []
  }
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { id } = await params
  const exam = await getExamById(id)

  if (!exam) {
    return {
      title: 'Exam Not Found - EngiVora',
      description: 'The requested exam could not be found.',
    }
  }

  const title = `${exam.title} - Engineering Exam - EngiVora`
  const examDate = exam.date ? new Date(exam.date).toLocaleDateString() : 'TBD'
  const description = `Register for ${exam.title}. ${exam.description || `Engineering exam scheduled for ${examDate}`}. Fee: ${exam.fee === 0 ? 'Free' : `₹${exam.fee}`}`

  return {
    title,
    description,
    keywords: [
      'engineering exam',
      exam.title,
      exam.category,
      exam.conductingBody || '',
      'exam registration'
    ].filter(Boolean).join(', '),
    authors: [{ name: exam.conductingBody || 'EngiVora' }],
    openGraph: {
      title,
      description,
      type: 'website',
      images: exam.imageUrl ? [exam.imageUrl] : ['/images/exam-placeholder.jpg'],
      siteName: 'EngiVora',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: exam.imageUrl ? [exam.imageUrl] : ['/images/exam-placeholder.jpg'],
    },
    alternates: {
      canonical: `/exams/${id}`,
    },
  }
}

export async function generateStaticParams() {
  try {
    await connectToDatabase()
    const exams = await Exam.find({ isActive: true })
      .select('_id')
      .limit(100)
    
    return exams.map((exam) => ({
      id: exam._id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params for exams:', error)
    return []
  }
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { id } = await params
  const exam = await getExamById(id)

  if (!exam) {
    notFound()
  }

  const relatedExams = await getRelatedExams(id, exam?.category || 'general')

  return (
    <ExamDetailClient 
      exam={exam} 
      relatedExams={relatedExams}
    />
  )
}