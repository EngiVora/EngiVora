import { connectToDatabase } from '@/lib/db';
import { Event } from '@/models/Event';
import { Message } from '@/models/Message';
import { Notification } from '@/models/Notification';
import { ActivityLog } from '@/models/ActivityLog';

async function initDatabase() {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log('Connected to database successfully');

    // Create sample event
    const sampleEvent = await Event.create({
      title: "Welcome to EngiVora",
      description: "This is a sample event to demonstrate the Events feature",
      type: "Webinar",
      status: "Upcoming",
      startDate: new Date(Date.now() + 86400000), // Tomorrow
      endDate: new Date(Date.now() + 86400000 + 3600000), // Tomorrow + 1 hour
      startTime: "10:00",
      endTime: "11:00",
      location: "Online",
      isOnline: true,
      maxAttendees: 100,
      registeredAttendees: 0,
      price: 0,
      organizer: "EngiVora Team",
      category: "Education",
      tags: ["welcome", "introduction", "platform"],
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      requirements: "None",
      agenda: [
        "10:00 - Welcome & Introduction",
        "10:15 - Platform Overview",
        "10:45 - Q&A Session"
      ],
    });
    console.log('Sample event created:', sampleEvent.title);

    // Create sample message
    const sampleMessage = await Message.create({
      subject: "Welcome to EngiVora Platform",
      sender: "admin@engivora.com",
      recipient: "user@example.com",
      content: "Welcome to our engineering platform! We're excited to have you join our community. This is a sample message to demonstrate the messaging system.",
      type: "Welcome",
      status: "Unread",
      priority: "Normal",
      isStarred: false,
      isArchived: false,
    });
    console.log('Sample message created:', sampleMessage.subject);

    // Create sample notification
    const sampleNotification = await Notification.create({
      title: "New Features Available",
      message: "We've added new features to the platform. Check them out!",
      type: "System",
      priority: "Normal",
      status: "Unread",
      recipient: "All Users",
      isArchived: false,
      category: "Maintenance",
    });
    console.log('Sample notification created:', sampleNotification.title);

    // Create sample activity log
    const sampleActivityLog = await ActivityLog.create({
      timestamp: new Date(),
      user: "System",
      email: "system@engivora.com",
      action: "Create",
      resource: "Sample Data",
      ipAddress: "127.0.0.1",
      userAgent: "Database Initialization Script",
      device: "Desktop",
      location: "Server",
      status: "Success",
      details: "Database initialization completed successfully",
    });
    console.log('Sample activity log created:', sampleActivityLog.action);

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase();