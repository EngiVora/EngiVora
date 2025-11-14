import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogCategoryClient from "./BlogCategoryClient"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

const validCategories = ['technology', 'career', 'academic', 'lifestyle', 'news']

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params

  if (!validCategories.includes(category)) {
    return {
      title: 'Category Not Found - Engivora',
      description: 'The requested category could not be found.'
    }
  }

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  return {
    title: `${categoryName} Articles - Engivora Blog`,
    description: `Explore ${categoryName.toLowerCase()} articles and insights for engineering students.`,
    keywords: `${category}, engineering, articles, blog, ${categoryName.toLowerCase()}`,
    openGraph: {
      title: `${categoryName} Articles - Engivora Blog`,
      description: `Explore ${categoryName.toLowerCase()} articles and insights for engineering students.`,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: `${categoryName} Articles - Engivora Blog`,
      description: `Explore ${categoryName.toLowerCase()} articles and insights for engineering students.`
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  if (!validCategories.includes(category)) {
    notFound()
  }

  return <BlogCategoryClient category={category} />
}
