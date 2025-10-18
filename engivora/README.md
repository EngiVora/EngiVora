This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

<!-- Updated environment variables for Vercel deployment -->

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

This application uses a custom JWT-based authentication system for both regular users and administrators:

### For Regular Users:
- Visit `/signup` to create a new account with your name, email, password, department, year, and roll number
- Visit `/login` to sign in to your existing account
- Demo credentials: `student@example.com` / `password123`
- After login, you can access your profile at `/profile`

### For Administrators:
- Visit `/admin/login` to sign in to the admin portal
- Demo credentials: `admin@engivora.com` / `admin123`
- After login, you'll be redirected to the admin dashboard

### For Student Accounts:
- Dedicated API endpoints for student signup, login, and password reset
- See [STUDENT_BLOG_API_DOCS.md](STUDENT_BLOG_API_DOCS.md) for detailed API documentation

### For Admin Blog Management:
- Full CRUD operations for blog posts via admin API
- See [STUDENT_BLOG_API_DOCS.md](STUDENT_BLOG_API_DOCS.md) for detailed API documentation

## MongoDB Atlas Integration

This application is configured to use MongoDB Atlas for data storage:

- See [MONGODB_ATLAS_INTEGRATION.md](MONGODB_ATLAS_INTEGRATION.md) for setup instructions
- All student and blog data is stored in MongoDB Atlas
- Connection uses environment variables for security

**Note:** Some authentication routes have fallback mechanisms to mock data. 
To ensure data is stored in Atlas, use:
- Student authentication: `/api/students/*` routes
- Enhanced authentication: `/api/auth/enhanced-*` routes (guarantees Atlas storage)
- Admin panel for blog management
- See [instructions-for-atlas-data.md](instructions-for-atlas-data.md) for details

## Enhanced Authentication System

The application now includes an enhanced authentication system that guarantees all signup and signin data is stored in MongoDB Atlas:

- See [ENHANCED_AUTH_SYSTEM.md](ENHANCED_AUTH_SYSTEM.md) for detailed documentation
- Enhanced signup: `/api/auth/enhanced-signup`
- Enhanced login: `/api/auth/enhanced-login`
- User data verification: `/api/auth/list-users`
- Debug users page: `/users-debug`

## Environment Variables:
Make sure to set the following environment variables in your `.env.local` file:
```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=604800
MONGODB_URI=your-mongodb-connection-string
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.