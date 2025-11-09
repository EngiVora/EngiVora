import type { Metadata } from "next"
import { notFound } from "next/navigation"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/db"
import { Blog } from "@/models/Blog"
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
    
    // Find blog by slug and ensure it's published
    // Use lean() for better performance and populate authorId if it exists
    const blog = await Blog.findOne({ slug, published: true })
      .populate('authorId', 'name email avatar bio')
      .lean() as any;

    if (!blog) {
      return null;
    }

    // Increment view count - handle _id properly with lean()
    const blogId = blog._id;
    if (blogId) {
      await Blog.updateOne({ _id: blogId }, { $inc: { views: 1 } });
    }

    // Transform database response to match expected format
    const authorId = blog.authorId as any;
    const blogIdString = blogId?.toString() || (blogId as any)?.toString() || '';
    
    return {
      id: blogIdString,
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      content: blog.content,
      category: blog.category,
      tags: blog.tags || [],
      author: {
        id: authorId?._id?.toString() || authorId?.id || '1',
        name: authorId?.name || 'Admin',
        email: authorId?.email || 'admin@engivora.com',
        bio: authorId?.bio || 'Engineering expert and content creator.',
        avatar: authorId?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc'
      },
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
async function getRelatedBlogs(currentId: string, category: string, tags: string[]) {
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
