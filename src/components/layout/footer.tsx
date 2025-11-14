"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Mail, ArrowRight } from "lucide-react";
import { SocialLinks } from "@/components/ui/social-links";
import { useState } from "react";

const quickLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 glass-panel accent-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Logo size="md" />
              <span className="text-xl font-bold gradient-text">Engivora</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              One-stop hub for every engineering student. Your gateway to exams,
              jobs, career guidance, and exclusive student discounts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-200">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-sky-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-200">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/exams"
                  className="text-slate-400 hover:text-sky-400 transition-colors text-sm"
                >
                  Exam Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-slate-400 hover:text-sky-400 transition-colors text-sm"
                >
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="/discounts"
                  className="text-slate-400 hover:text-sky-400 transition-colors text-sm"
                >
                  Student Discounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect with Us */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4 text-slate-200">Connect with Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors p-2.5 rounded-lg hover:bg-slate-800/50 group">
                  <Mail className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <span className="text-sm font-medium block">Email Support</span>
                    <a href="mailto:help.engivora@gmail.com" className="text-xs text-slate-500 hover:text-sky-400 transition-colors">
                      help.engivora@gmail.com
                    </a>
                  </div>
                </div>
                <SocialLinks variant="footer" />
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-slate-200">
              Stay Updated
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest exam updates, job alerts, and exclusive student
              offers.
            </p>
            <form onSubmit={handleNewsletterSignup} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 neon-ring"
                size="sm"
              >
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2025 Engivora. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-sky-400 transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-sky-400 transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
