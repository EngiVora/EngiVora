import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/db'
import { Event } from '@/models/Event'
import { EventDetailClient } from '@/components/events/event-detail-client'

interface EventPageProps {
  params: Promise<{ id: string }>
}

async function getEventById(id: string) {
  try {
    await connectToDatabase()
    const event = await Event.findById(id)
    return event
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

async function getRelatedEvents(currentEventId: string, category: string, limit = 3) {
  try {
    await connectToDatabase()
    const relatedEvents = await Event.find({
      _id: { $ne: currentEventId },
      category,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    
    return relatedEvents
  } catch (error) {
    console.error('Error fetching related events:', error)
    return []
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    return {
      title: 'Event Not Found - EngiVora',
      description: 'The requested event could not be found.',
    }
  }

  return {
    title: `${event.title} - EngiVora Events`,
    description: event.description || `Join us for ${event.title} - ${event.type} event on ${new Date(event.startDate).toLocaleDateString()}`,
    keywords: [
      'engineering events',
      event.type.toLowerCase(),
      event.category.toLowerCase(),
      ...(event.tags || [])
    ].join(', '),
    authors: [{ name: event.organizer }],
    openGraph: {
      title: event.title,
      description: event.description,
      type: 'website',
      images: event.imageUrl ? [event.imageUrl] : ['/images/event-placeholder.jpg'],
      siteName: 'EngiVora',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : ['/images/event-placeholder.jpg'],
    },
    alternates: {
      canonical: `/events/${id}`,
    },
  }
}

export async function generateStaticParams() {
  try {
    await connectToDatabase()
    const events = await Event.find({ isActive: true }).select('_id').limit(100)
    
    return events.map((event) => ({
      id: event._id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params for events:', error)
    return []
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  const relatedEvents = await getRelatedEvents(id, event.category)

  return (
    <EventDetailClient 
      event={event} 
      relatedEvents={relatedEvents}
    />
  )
}
