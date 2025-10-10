# Database Models

This document describes the database models used in the EngiVora platform.

## Overview

The EngiVora platform uses MongoDB as its database with Mongoose as the ODM (Object Document Mapper). All models are defined in the `src/models` directory.

## Models

### 1. User
- **File**: `src/models/User.ts`
- **Description**: Represents platform users (students, admins)
- **Key Fields**: name, email, passwordHash, role, department, year, rollNumber

### 2. Blog
- **File**: `src/models/Blog.ts`
- **Description**: Blog posts published on the platform
- **Key Fields**: title, slug, summary, content, category, tags, authorId, featured, published

### 3. Job
- **File**: `src/models/Job.ts`
- **Description**: Job listings for students
- **Key Fields**: title, company, location, type, applyUrl, deadline, description

### 4. Exam
- **File**: `src/models/Exam.ts`
- **Description**: Information about upcoming exams
- **Key Fields**: title, organization, date, category, description

### 5. Discount
- **File**: `src/models/Discount.ts`
- **Description**: Discount offers for students
- **Key Fields**: code, description, percentage, expiresAt, active

### 6. Event
- **File**: `src/models/Event.ts`
- **Description**: Events, workshops, conferences, and webinars
- **Key Fields**: title, description, type, status, startDate, endDate, location, isOnline, maxAttendees, organizer, category, tags, featured

### 7. Message
- **File**: `src/models/Message.ts`
- **Description**: Internal messaging system
- **Key Fields**: subject, sender, recipient, content, type, status, priority, isStarred, isArchived

### 8. Notification
- **File**: `src/models/Notification.ts`
- **Description**: System notifications and alerts
- **Key Fields**: title, message, type, priority, status, recipient, isArchived, category

### 9. ActivityLog
- **File**: `src/models/ActivityLog.ts`
- **Description**: User activity tracking and audit logs
- **Key Fields**: timestamp, user, email, action, resource, ipAddress, userAgent, device, location, status, details

## API Routes

Each model has corresponding API routes in the `src/app/api` directory:

- `/api/events` - Event management
- `/api/messages` - Message management
- `/api/notifications` - Notification management
- `/api/activity-logs` - Activity log management

## Usage

To use these models in your components or API routes:

```typescript
import { connectToDatabase } from '@/lib/db';
import { Event } from '@/models/Event';

// Connect to database
await connectToDatabase();

// Create a new event
const newEvent = await Event.create({
  title: "Sample Event",
  // ... other fields
});

// Find events
const events = await Event.find({ featured: true });
```

## Testing

To test the models, you can use the test API endpoint at `/api/test-models` which will return the count of documents in each collection.