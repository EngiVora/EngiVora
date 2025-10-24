# Blog Management Guide

This guide explains how blog management and synchronization works in the Engivora platform.

## Overview

The Engivora platform uses two separate blog collections to manage content:

1. **Blog** - Main website blog collection
2. **AdminBlog** - Admin panel blog collection

Both collections are automatically synchronized to ensure consistency between the main website and admin panel.

## How Synchronization Works

### Automatic Synchronization

1. **When creating/updating blogs through the main website API**:
   - Blogs are automatically synced to the AdminBlog collection
   - This ensures they appear in the admin panel for management

2. **When creating/updating blogs through the admin panel**:
   - Blogs are automatically synced to the main Blog collection
   - This ensures they appear on the main website

### Manual Synchronization

1. **Sync All Blogs**:
   - Use the "Sync Blogs" button in the admin panel
   - This synchronizes all blogs between both collections

2. **API Endpoint**:
   - `GET /api/admin/sync-blogs` - Sync all blogs
   - `POST /api/admin/sync-blogs` - Sync a specific blog

## Managing Blogs in the Admin Panel

### Viewing Blogs

All blogs (from both collections) are displayed in the admin panel:
- Published status is shown
- Creation/update dates are displayed
- Tags are visible

### Creating Blogs

1. Click "New Post" in the admin panel
2. Fill in the blog details
3. The blog is automatically created in both collections

### Editing Blogs

1. Click the edit icon for any blog
2. Modify the blog content
3. The changes are automatically synced to both collections

### Deleting Blogs

1. Click the delete icon for any blog
2. Confirm the deletion
3. The blog is deleted from both collections

## API Endpoints

### Main Website Blog API

- `GET /api/blogs` - Get all published blogs
- `POST /api/blogs` - Create a new blog
- `PUT /api/blogs` - Update an existing blog
- `DELETE /api/blogs?id={id}` - Delete a blog

### Admin Panel Blog API

- `GET /api/admin/blogs` - Get all blogs in admin collection
- `POST /api/admin/blogs` - Create a new blog in admin collection
- `PUT /api/admin/blogs/{id}` - Update an existing blog
- `DELETE /api/admin/blogs/{id}` - Delete a blog
- `GET /api/admin/sync-blogs` - Sync all blogs between collections
- `POST /api/admin/sync-blogs` - Sync a specific blog

## Troubleshooting

### Blogs Not Appearing in Admin Panel

1. Click the "Sync Blogs" button
2. Check the browser console for errors
3. Verify database connections

### Blogs Not Appearing on Main Website

1. Ensure the blog status is "published"
2. Check the browser console for errors
3. Verify database connections

## Support

For any issues or questions about the blog management system, please contact the development team.