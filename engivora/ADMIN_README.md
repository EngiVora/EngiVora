# Engivora Admin Panel

A comprehensive admin panel for managing the Engivora platform, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication & Security
- Secure admin login system
- Role-based access control
- Session management
- IP whitelisting (configurable)
- Two-factor authentication support

### 📊 Dashboard & Analytics
- Real-time analytics dashboard
- User growth tracking
- Page view statistics
- Traffic source analysis
- Device breakdown
- Real-time activity monitoring

### 👥 User Management
- Complete user database management
- User role assignment (Admin, Moderator, Student)
- User status management (Active, Inactive, Suspended)
- Bulk user operations
- User search and filtering
- Export/Import functionality

### 📝 Content Management
- **Blog Management**: Create, edit, publish, and manage blog posts
- **Job Management**: Post and manage job listings and internships
- **Exam Management**: Schedule and manage exam updates and registrations
- Content moderation and approval workflows
- Featured content management

### ⚙️ System Settings
- **General Settings**: Site configuration, branding, timezone
- **Email Settings**: SMTP configuration, notification templates
- **Security Settings**: Password policies, session timeouts, IP restrictions
- **Notification Settings**: Email, push, and SMS notifications
- **Appearance Settings**: Theme customization, logo management
- **Content Settings**: File upload limits, comment moderation
- **API Settings**: API access control, rate limiting, webhooks
- **Backup Settings**: Automated backups, retention policies

### 🔧 Additional Features
- Responsive design (mobile-friendly)
- Dark/Light theme support
- Real-time notifications
- Search functionality across all modules
- Export/Import capabilities
- Activity logging
- System status monitoring

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Next.js 15+

### Installation

1. Navigate to the project directory:
```bash
cd engivora
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the admin panel:
```
http://localhost:3000/admin/login
```

### Default Login Credentials

**Email:** admin@engivora.com  
**Password:** admin123

> ⚠️ **Important**: Change these credentials in production!

## Admin Panel Structure

```
/admin
├── /login                 # Admin login page
├── /                      # Dashboard (main analytics)
├── /analytics            # Detailed analytics
├── /users                # User management
├── /user-roles           # Role management
├── /blogs                # Blog post management
├── /jobs                 # Job listing management
├── /exams                # Exam management
├── /discounts            # Discount management
├── /events               # Event management
├── /messages             # Message management
├── /notifications        # Notification management
├── /system               # System information
├── /activity             # Activity logs
├── /security             # Security settings
└── /settings             # General settings
```

## Key Components

### AdminLayout
- Main layout wrapper with sidebar navigation
- Authentication guard
- Responsive design

### AdminSidebar
- Navigation menu with all admin sections
- Mobile-responsive hamburger menu
- Active page highlighting

### AdminHeader
- Search functionality
- Theme toggle
- Notifications
- User profile dropdown
- Logout functionality

### AdminDashboard
- Overview statistics
- Quick actions
- Recent activity
- System status

## Authentication Flow

1. **Login**: Admin users must authenticate via `/admin/login`
2. **Token Storage**: JWT tokens stored in localStorage (configure for production)
3. **Route Protection**: All admin routes protected by `AdminAuthGuard`
4. **Session Management**: Configurable session timeouts
5. **Logout**: Clears tokens and redirects to login

## Customization

### Adding New Admin Pages

1. Create a new page in `/app/admin/[page-name]/page.tsx`
2. Add the route to the navigation in `AdminSidebar`
3. Create corresponding components in `/components/admin/`

### Styling

The admin panel uses Tailwind CSS with a consistent design system:
- Primary colors: Blue (#3B82F6)
- Secondary colors: Green (#10B981)
- Status colors: Red (errors), Yellow (warnings), Green (success)

### Configuration

Most settings can be configured through the admin settings panel:
- Go to `/admin/settings`
- Configure email, security, appearance, and other settings
- Changes are saved to the application state

## Security Considerations

### Production Deployment

1. **Change Default Credentials**: Update admin login credentials
2. **Secure Token Storage**: Use httpOnly cookies instead of localStorage
3. **HTTPS**: Ensure all admin traffic uses HTTPS
4. **IP Whitelisting**: Configure IP restrictions for admin access
5. **Rate Limiting**: Implement API rate limiting
6. **Backup Strategy**: Configure automated backups

### Environment Variables

Create a `.env.local` file with:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your-database-url
SMTP_HOST=your-smtp-host
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## API Integration

The admin panel is designed to work with REST APIs. Key endpoints needed:

- `POST /api/auth/login` - Admin authentication
- `GET /api/admin/users` - User management
- `GET /api/admin/analytics` - Analytics data
- `POST /api/admin/content` - Content management
- `PUT /api/admin/settings` - Settings management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Add proper error handling
5. Include loading states
6. Test responsive design

## Support

For issues or questions:
1. Check the console for errors
2. Verify authentication status
3. Check network requests
4. Review component props and state

## License

This admin panel is part of the Engivora project and follows the same licensing terms.
