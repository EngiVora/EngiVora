"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  Briefcase, 
  FileText, 
  Percent, 
  Users,
  Calendar,
  MapPin,
  Building,
  Clock,
  MessageCircle
} from "lucide-react"

// Mock data for highlights
const examHighlights = [
  {
    id: 1,
    title: "GATE 2025",
    date: "Feb 1, 2025",
    deadline: "Dec 15, 2024",
    type: "Postgraduate"
  },
  {
    id: 2,
    title: "JEE Advanced 2025",
    date: "May 25, 2025",
    deadline: "Apr 30, 2025",
    type: "Undergraduate"
  }
]

const jobHighlights = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Google",
    location: "Bangalore",
    salary: "₹15-25 LPA",
    type: "Full-time"
  },
  {
    id: 2,
    title: "Data Scientist Intern",
    company: "Microsoft",
    location: "Hyderabad",
    salary: "₹50K/month",
    type: "Internship"
  }
]

const blogHighlights = [
  {
    id: 1,
    title: "How to Crack Technical Interviews",
    author: "Sarah Johnson",
    readTime: "5 min read",
    category: "Career Tips"
  },
  {
    id: 2,
    title: "Top 10 Programming Languages for 2025",
    author: "Mike Chen",
    readTime: "8 min read",
    category: "Technology"
  }
]

const discountHighlights = [
  {
    id: 1,
    title: "Coursera Courses",
    discount: "50% OFF",
    partner: "Coursera",
    validUntil: "Dec 31, 2024"
  },
  {
    id: 2,
    title: "JetBrains IDEs",
    discount: "Free License",
    partner: "JetBrains",
    validUntil: "Ongoing"
  }
]

const workHubHighlights = [
  {
    id: 1,
    title: "AI Chatbot Project",
    members: 5,
    status: "Active",
    category: "Machine Learning"
  },
  {
    id: 2,
    title: "Smart Home Automation",
    members: 3,
    status: "Recruiting",
    category: "IoT"
  }
]

export function HighlightsGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What&apos;s happening now
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest opportunities and resources for engineering students.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Exam Section Preview */}
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Exam Updates</CardTitle>
                </div>
                <Link href="/exams" className="text-primary hover:underline text-sm">
                  View All →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {examHighlights.map((exam) => (
                <div key={exam.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{exam.title}</h4>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {exam.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Deadline: {exam.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Jobs Snapshot */}
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Latest Jobs</CardTitle>
                </div>
                <Link href="/jobs" className="text-primary hover:underline text-sm">
                  View All →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobHighlights.map((job) => (
                <div key={job.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{job.title}</h4>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      {job.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Building className="h-3 w-3" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                    <div className="font-medium text-primary">{job.salary}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Blogs */}
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">Top Blogs</CardTitle>
                </div>
                <Link href="/blogs" className="text-primary hover:underline text-sm">
                  View All →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {blogHighlights.map((blog) => (
                <div key={blog.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{blog.title}</h4>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      {blog.category}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>By {blog.author}</div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Work Hub Shortcut */}
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-lg">Work Hub</CardTitle>
                </div>
                <Link href="/work-hub" className="text-primary hover:underline text-sm">
                  View All →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {workHubHighlights.map((project) => (
                <div key={project.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{project.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'Active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>{project.category}</div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{project.members} members</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Discount Offer Teaser */}
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Percent className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-lg">Student Discounts</CardTitle>
                </div>
                <Link href="/discounts" className="text-primary hover:underline text-sm">
                  View All →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {discountHighlights.map((discount) => (
                <div key={discount.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{discount.title}</h4>
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded font-bold">
                      {discount.discount}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Partner: {discount.partner}</div>
                    <div>Valid until: {discount.validUntil}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-hover bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Get started with the most popular features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/exams">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Exams
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Find Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/counselling">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Book Counselling
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
