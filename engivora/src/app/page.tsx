import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  Briefcase, 
  FileText, 
  Percent, 
  Users, 
  MessageCircle,
  ArrowRight
} from "lucide-react"
import { UpdateTicker } from "@/components/home/update-ticker"
import { HighlightsGrid } from "@/components/home/highlights-grid"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            One-stop hub for every{" "}
            <span className="text-yellow-300">engineering student</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Your gateway to exam updates, job opportunities, career guidance, 
            and exclusive student discounts. Everything you need to succeed in your engineering journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Explore Exams
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Find Jobs
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Read Blogs
            </Button>
          </div>
        </div>
      </section>

      {/* Update Ticker */}
      <UpdateTicker />

      {/* Highlights Grid */}
      <HighlightsGrid />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need in one place
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From exam preparation to career guidance, we have got you covered with comprehensive tools and resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Exam Updates</CardTitle>
                <CardDescription>
                  Stay updated with the latest engineering exam notifications, dates, and application deadlines.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/exams" className="text-primary hover:underline font-medium">
                  Browse Exams →
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Job Opportunities</CardTitle>
                <CardDescription>
                  Discover internship and job opportunities from top companies across various engineering domains.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/jobs" className="text-primary hover:underline font-medium">
                  Find Jobs →
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Expert Blogs</CardTitle>
                <CardDescription>
                  Read insights from industry experts, career tips, and technical articles written for engineering students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/blogs" className="text-primary hover:underline font-medium">
                  Read Blogs →
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Percent className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Student Discounts</CardTitle>
                <CardDescription>
                  Access exclusive discounts on courses, tools, software, and services designed for engineering students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/discounts" className="text-primary hover:underline font-medium">
                  View Discounts →
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Work Hub</CardTitle>
                <CardDescription>
                  Connect with fellow students, share projects, and collaborate on innovative engineering solutions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/work-hub" className="text-primary hover:underline font-medium">
                  Join Hub →
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Career Counselling</CardTitle>
                <CardDescription>
                  Get personalized career guidance from experienced professionals to shape your engineering career path.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/counselling" className="text-primary hover:underline font-medium">
                  Book Session →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Exam Updates</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Job Opportunities</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Expert Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to accelerate your engineering career?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of engineering students who are already using Engivora to stay ahead in their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
