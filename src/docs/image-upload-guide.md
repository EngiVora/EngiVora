# Image Upload Guide

This guide explains how to use the image upload functionality for exams, blogs, events, and jobs in the Engivora platform.

## Overview

All content types (exams, blogs, events, jobs) now support image uploads. Images are displayed in both the admin panels and public pages.

## How Image Upload Works

1. **Admin Panel**: When creating or editing content, you can upload an image file using the file input field.
2. **Preview**: A preview of the uploaded image is displayed before saving.
3. **Storage**: In the current implementation, images are stored as Data URLs (base64 encoded). In a production environment, you would upload images to a service like Cloudinary or AWS S3.
4. **Database**: The image URL is stored in the database along with other content data.
5. **Display**: Images are displayed in both admin panels and public pages.

## Content Types with Image Support

### Exams
- Image displayed on exam cards in the public exams page
- Image upload available in Exam Management admin panel

### Blogs
- Image displayed as blog post thumbnails
- Image upload available in Blog Management admin panel

### Events
- Image displayed on event cards and detail pages
- Image upload available in Event Management admin panel

### Jobs
- Image displayed on job cards and detail pages
- Image upload available in Job Management admin panel

## Using Dummy Data

We've provided a dummy data management system to help you test the image functionality:

1. Navigate to **Admin Panel → Dummy Data**
2. Click "Insert Dummy Data" for any content type to add sample data with images
3. View the data to see how images are stored and displayed

## Testing Image Upload

You can test the image upload functionality using the provided test script:

```bash
# Run the test script
npx ts-node src/scripts/test-image-upload.ts
```

This script will simulate the image upload process for all content types.

## API Endpoints

All content creation APIs now accept an `imageUrl` parameter:

### Exams
```
POST /api/exams
{
  "name": "Exam Name",
  "imageUrl": "https://example.com/image.jpg"
  // ... other fields
}
```

### Blogs
```
POST /api/blogs
{
  "title": "Blog Title",
  "imageUrl": "https://example.com/image.jpg"
  // ... other fields
}
```

### Jobs
```
POST /api/jobs
{
  "title": "Job Title",
  "imageUrl": "https://example.com/image.jpg"
  // ... other fields
}
```

### Events
```
POST /api/events
{
  "title": "Event Title",
  "imageUrl": "https://example.com/image.jpg"
  // ... other fields
}
```

## Implementation Details

### Frontend Components
- **Exam Management**: `src/components/admin/exam-management.tsx`
- **Blog Management**: `src/components/admin/blog-management.tsx`
- **Event Management**: `src/components/admin/event-management.tsx`
- **Job Management**: `src/components/admin/job-management.tsx`

### Models
- **Exam**: `src/models/Exam.ts`
- **Blog**: `src/models/Blog.ts`
- **Event**: `src/models/Event.ts`
- **Job**: `src/models/Job.ts`

### API Routes
- **Exams**: `src/app/api/exams/route.ts`
- **Blogs**: `src/app/api/blogs/route.ts`
- **Events**: `src/app/api/events/route.ts`
- **Jobs**: `src/app/api/jobs/route.ts`

## Production Considerations

For a production environment, consider implementing:

1. **Image Hosting Service**: Use Cloudinary, AWS S3, or similar services for image storage
2. **Image Optimization**: Implement responsive images and compression
3. **Validation**: Add image size and format validation
4. **Security**: Implement proper authentication and authorization for image uploads

## Troubleshooting

### Images Not Displaying
1. Check that the `imageUrl` field is properly set in the database
2. Verify the image URL is accessible
3. Check browser console for any errors

### Upload Issues
1. Ensure the file input is working correctly
2. Check that the preview is displayed after selecting an image
3. Verify the image URL is being sent to the API

## Support

For any issues or questions about the image upload functionality, please contact the development team.