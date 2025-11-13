"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EventCard } from "@/components/ui/event-card";

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  isOnline: boolean;
  maxAttendees: number;
  registeredAttendees: number;
  price: number;
  organizer: string;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl: string;
  requirements: string;
  agenda: string[];
  createdAt: string;
  updatedAt: string;
}

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events?featured=true&limit=3');
        const data = await response.json();
        
        if (data.success) {
          setEvents(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString(),
      mon: date.toLocaleString('default', { month: 'short' }).toUpperCase()
    };
  };

  // Get tag color based on event type
  const getTagColor = (type: string) => {
    switch (type) {
      case 'Workshop':
        return 'bg-yellow-100 text-yellow-800';
      case 'Webinar':
        return 'bg-green-100 text-green-800';
      case 'Competition':
        return 'bg-red-100 text-red-800';
      case 'Conference':
        return 'bg-blue-100 text-blue-800';
      case 'Career Fair':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100">Upcoming Events</h2>
            <p className="mt-2 text-slate-400">Stay updated with our latest events and opportunities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-100">Upcoming Events</h2>
          <p className="mt-2 text-slate-400">Stay updated with our latest events and opportunities</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const { day, mon } = formatDate(event.startDate);
            const tagColor = getTagColor(event.type);
            
            return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EventCard
                  day={day}
                  mon={mon}
                  tag={event.type}
                  title={event.title}
                  tagColor={tagColor}
                  href={`/events/${event._id}`}
                  image={event.imageUrl}
                />
              </motion.div>
            );
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-medium"
          >
            View all events
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}