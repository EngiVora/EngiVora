import type { Metadata } from "next"
import { notFound } from "next/navigation"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/db"
import { Blog } from "@/models/Blog"
import { User } from "@/models/User"
import BlogDetailClient from "./BlogDetailClient"

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

// Fetch blog by slug directly from database
async function getBlogBySlug(slug: string) {
  try {
    await connectToDatabase();
    
    // Fetch blog without populate to avoid User model registration issues
    // We'll handle author data with defaults or fetch separately if needed
    let blog = await Blog.findOne({ slug, published: true }).lean() as any;

    // If not found by slug, try to find by ID (in case slug is actually an ID)
    if (!blog && mongoose.Types.ObjectId.isValid(slug)) {
      blog = await Blog.findOne({ _id: new mongoose.Types.ObjectId(slug), published: true }).lean() as any;
    }

    if (!blog) {
      console.error(`Blog not found with slug: ${slug}`);
      return null;
    }
    
    // Ensure slug exists in the returned blog data
    if (!blog.slug && blog._id) {
      console.warn(`Blog ${blog._id} is missing a slug, generating one from title`);
      // Generate slug from title if missing
      if (blog.title) {
        blog.slug = blog.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .substring(0, 80);
      }
    }

    // Increment view count - handle _id properly with lean()
    const blogId = blog._id;
    if (blogId) {
      await Blog.updateOne({ _id: blogId }, { $inc: { views: 1 } });
    }

    // Transform database response to match expected format
    const blogIdString = blogId?.toString() || (blogId as any)?.toString() || '';
    
    // Try to fetch author data if we have an authorId and User model is available
    let fetchedAuthorData: any = null;
    if (blog.authorId) {
      try {
        // Only try to fetch user if the model is registered
        if (mongoose.models.User) {
          const author = await User.findById(blog.authorId).lean() as any;
          if (author) {
            fetchedAuthorData = {
              id: author._id?.toString() || '1',
              name: author.name || 'Admin',
              email: author.email || 'admin@engivora.com',
              bio: 'Engineering expert and content creator.',
              avatar: author.imageUrl || author.profilePicture || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc'
            };
          }
        }
      } catch (userError) {
        // If User model fetch fails, we'll use defaults below
        console.warn('Could not fetch user data:', userError);
      }
    }
    
    // Use fetched author data or fallback to defaults
    const finalAuthorData = fetchedAuthorData || {
      id: blog.authorId?.toString() || '1',
      name: 'Admin',
      email: 'admin@engivora.com',
      bio: 'Engineering expert and content creator.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc'
    };
    
    return {
      id: blogIdString,
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      content: blog.content,
      category: blog.category,
      tags: blog.tags || [],
      author: finalAuthorData,
      featured: blog.featured || false,
      published: blog.published || false,
      views: blog.views || 0,
      likes: blog.likes || 0,
      readTime: `${Math.ceil((blog.content?.length || 0) / 1000)} min read`,
      publishedAt: blog.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: blog.updatedAt?.toISOString() || new Date().toISOString(),
      image: blog.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo'
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Get related blogs directly from database
async function getRelatedBlogs(currentId: string, category: string, _tags: string[]) {
  try {
    await connectToDatabase();
    
    // Convert string ID to ObjectId for MongoDB query
    const currentObjectId = mongoose.Types.ObjectId.isValid(currentId) 
      ? new mongoose.Types.ObjectId(currentId)
      : null;
    
    // Find related blogs by category, excluding current blog
    const query: any = {
      category,
      published: true
    };
    
    if (currentObjectId) {
      query._id = { $ne: currentObjectId };
    }
    
    const relatedBlogs = await Blog.find(query)
    .sort({ createdAt: -1 })
    .limit(3)
    .select('_id title slug summary imageUrl content createdAt');

    // Transform to expected format
    return relatedBlogs.map((blog) => ({
      id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      image: blog.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo',
      readTime: `${Math.ceil((blog.content?.length || 0) / 1000)} min read`,
      publishedAt: blog.createdAt?.toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found - Engivora',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: `${blog.title} - Engivora Blog`,
    description: blog.summary,
    keywords: blog.tags.join(', '),
    authors: [{ name: blog.author.name }],
    openGraph: {
      title: blog.title,
      description: blog.summary,
      images: [blog.image],
      type: 'article',
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author.name]
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.summary,
      images: [blog.image]
    }
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const relatedBlogs = await getRelatedBlogs(blog.id.toString(), blog.category, blog.tags)

  return <BlogDetailClient blog={blog} relatedBlogs={relatedBlogs} />
}
