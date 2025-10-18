import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/db'
import { Exam } from '@/models/Exam'
import { ExamDetailClient } from '@/components/exams/exam-detail-client'

interface ExamPageProps {
  params: Promise<{ id: string }>
}

async function getExamById(id: string) {
  try {
    await connectToDatabase()
    const exam = await Exam.findById(id)
    return exam
  } catch (error) {
    console.error('Error fetching exam:', error)
    return null
  }
}

async function getRelatedExams(currentExamId: string, category: string, limit = 3) {
  try {
    await connectToDatabase()
    const relatedExams = await Exam.find({
      _id: { $ne: currentExamId },
      category,
      isActive: true
    })
    .sort({ date: 1 })
    .limit(limit)
    
    return relatedExams
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
  const description = `Register for ${exam.title}. ${exam.description || `Engineering exam scheduled for ${new Date(exam.date).toLocaleDateString()}`}. Fee: ${exam.fee || 'Free'}`

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

  const relatedExams = await getRelatedExams(id, exam.category)

  return (
    <ExamDetailClient 
      exam={exam} 
      relatedExams={relatedExams}
    />
  )
}