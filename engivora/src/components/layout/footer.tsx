"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { FaWhatsapp } from "react-icons/fa"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  ArrowRight,
  X
} from "lucide-react"
import { useState } from "react"

const quickLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "https://mail.google.com/mail/?view=cm&fs=1&to=help.engivora@gmail.com" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
]

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/share/17ADfX3ftc/", icon: Facebook },
  { name: "Twitter", href: "https://x.com/EngiVora?t=cGq6vflclyOXbSLS7A5dtA&s=09", icon: Twitter },
  { name: "Instagram", href: "https://www.instagram.com/engivora?igsh=bXRqa3Y2czR5OXJr", icon: Instagram },
  { name: "LinkedIn", href: "http://linkedin.com/company/engivora", icon: Linkedin },
  { name: "YouTube", href: "https://www.youtube.com/@EngiVora", icon: Youtube },
  { name: "WhatsApp", href: "https://whatsapp.com/channel/0029Vb6Xf4dLY6czwlSlyK0B", icon: FaWhatsapp },
  { name: "Mail", href: "https://mail.google.com/mail/?view=cm&fs=1&to=help.engivora@gmail.com", icon: Mail },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setShowPopup(true)  
    setEmail("")        
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <footer className="bg-muted/50 border-t relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Logo size="md" />
              <span className="text-xl font-bold gradient-text">Engivora</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              One-stop hub for every engineering student. Your gateway to exams, jobs, career guidance, and exclusive student discounts.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/exams" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Exam Updates
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link href="/counselling" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Career Counselling
                </Link>
              </li>
              <li>
                <Link href="/discounts" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Student Discounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest exam updates, job alerts, and exclusive student offers.
            </p>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="sm">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Engivora. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>

        {/*  Popup Section */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative">
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
              >
                <X className="h-5 w-5" />
              </button>
              <h4 className="text-lg font-semibold mb-2">Thank You!</h4>
              <p className="text-sm text-muted-foreground mb-4">You have successfully subscribed to our newsletter.</p>
              <Button onClick={closePopup} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}
