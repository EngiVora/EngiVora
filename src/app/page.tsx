"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MetricsStrip } from "@/components/home/metrics-strip";
import { Testimonials } from "@/components/home/testimonials";
import { FAQ } from "@/components/home/faq";
import { CtaBanner } from "@/components/home/cta-banner";
import { TechCard } from "@/components/ui/tech-card";
import { ProjectCard } from "@/components/ui/project-card";
import { EventCard } from "@/components/ui/event-card";
import { SocialLinks } from "@/components/ui/social-links";
import { Users, Linkedin, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { TelegramIcon } from "@/components/ui/telegram-icon";
import { FeaturedEvents } from "@/components/home/featured-events";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [pollResults, setPollResults] = useState<Record<string, number>>({
    "Time Management": 245,
    "Tough Coursework": 189,
    "Finding Internships": 312,
    Other: 94,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        console.log("Checking auth status...");
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");
        console.log("Token found:", token);
        const isLoggedInState = !!token;
        console.log("Setting isLoggedIn to:", isLoggedInState);
        setIsLoggedIn(isLoggedInState);
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();

    // Check if user has already voted
    const hasUserVoted = localStorage.getItem("hasVotedInPoll");
    if (hasUserVoted === "true") {
      setHasVoted(true);
    }

    const handleStorageChange = () => {
      console.log("Storage changed, rechecking auth status");
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleGetStarted = () => {
    console.log("Get Started button clicked");
    console.log("isLoggedIn:", isLoggedIn);
    if (isLoggedIn) {
      console.log("Redirecting to profile");
      router.push("/profile");
    } else {
      console.log("Redirecting to signup");
      router.push("/signup");
    }
  };

  const handleExploreFeatures = () => {
    console.log("Explore Features button clicked");
    const featuresSection = document.getElementById("features-section");
    console.log("Features section found:", featuresSection);
    if (featuresSection) {
      // Add a slight delay to ensure the element is fully rendered
      setTimeout(() => {
        featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      // Fallback: navigate to the features section
      console.log("Using fallback navigation");
      router.push("/#features-section");
    }
  };

  const handlePollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPollOption) {
      alert("Please select an option before voting!");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Update vote count
      setPollResults((prev) => ({
        ...prev,
        [selectedPollOption]: prev[selectedPollOption] + 1,
      }));

      // Mark as voted
      setHasVoted(true);
      localStorage.setItem("hasVotedInPoll", "true");

      setIsSubmitting(false);

      // Show success message
      alert("Thank you for voting! Your response has been recorded.");
    }, 1000);
  };

  const totalVotes = Object.values(pollResults).reduce(
    (sum, count) => sum + count,
    0,
  );

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  return (
    <div className="bg-slate-950 text-slate-100 aurora-bg">
      {/* Hero */}
      <section className="relative min-h-[640px] overflow-hidden grid-noise animated-grid">
        <div className="absolute inset-0 -z-10" />
        <div className="floating-orb w-[280px] h-[280px] -z-10 left-10 top-20 rounded-full" />
        <div className="floating-orb alt w-[340px] h-[340px] -z-10 right-10 top-28 rounded-full" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl neon-text"
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              <span className="block">Your Engineering Journey,</span>
              <span className="block bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent">
                Simplified & Supercharged.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="mt-6 text-xl text-slate-400"
            >
              Stay ahead with the latest updates, resources, and opportunities
              tailored for engineering students. Your central hub for success is
              here.
            </motion.p>
          </div>
          <div className="mt-12 flex justify-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center justify-center rounded-full bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform hover:scale-105 neon-ring"
              >
                Go to Profile
              </Link>
            ) : (
              <a
                href="/signup"
                className="flex items-center justify-center rounded-full bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform hover:scale-105 neon-ring"
              >
                Get Started Now
              </a>
            )}
            <a
              href="#features-section"
              className="flex items-center justify-center rounded-full bg-slate-800 px-8 py-4 text-base font-semibold text-slate-100 ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition-transform hover:scale-105"
            >
              Explore Features
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-sky-700/90 py-4 overflow-hidden glass-panel border-0 rounded-none">
          <div className="ticker flex whitespace-nowrap">
            <div className="inline-flex items-center gap-12">
              <span className="text-white font-medium text-lg flex items-center gap-2">
                NEW: GATE 2025 Registration Open
              </span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">
                Internship at TechCorp | Deadline: 25th Dec
              </span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">
                50% OFF on Engineering Textbooks
              </span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">
                Webinar: AI in Modern Engineering
              </span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">
                NEW: GATE 2025 Registration Open
              </span>
              <span className="text-white/70 font-medium text-lg">|</span>
              <span className="text-white font-medium text-lg flex items-center gap-2">
                Internship at TechCorp | Deadline: 25th Dec
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Logos */}
      <MetricsStrip />

      {/* Features */}
      <section id="features-section" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold tracking-tight">
              Explore Engivora&apos;s Features
            </h3>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
              Everything you need in one place. From exam schedules to career
              opportunities, we&apos;ve got you covered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <TechCard
              title="Exam Updates"
              description="Never miss a deadline. Get timely notifications for major exams."
              cta="See Updates →"
              href="/exams"
              imageUrl="/vercel.svg"
              delay={0}
              icon={
                <svg
                  className="h-10 w-10 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16m0 0h12"></path>
                  <path d="M12 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6v12Z"></path>
                  <path d="M9 14h.01"></path>
                </svg>
              }
            />
            <TechCard
              title="Jobs & Internships"
              description="Curated job postings and internships from top companies."
              cta="Find Opportunities →"
              href="/jobs"
              imageUrl="/globe.svg"
              delay={0.05}
              icon={
                <svg
                  className="h-10 w-10 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <polyline points="17 11 19 13 23 9"></polyline>
                </svg>
              }
            />
            <TechCard
              title="Blogs"
              description="Insights on cutting-edge tech, career advice, and student life."
              cta="Read Articles →"
              href="/blogs"
              imageUrl="/file.svg"
              delay={0.1}
              icon={
                <svg
                  className="h-10 w-10 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              }
            />
            <TechCard
              title="Discounts"
              description="Exclusive deals on textbooks, software, and student tools."
              cta="Get Deals →"
              href="/discounts"
              imageUrl="/window.svg"
              delay={0.15}
              icon={
                <svg
                  className="h-10 w-10 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              }
            />
            <TechCard
              title="Events"
              description="Stay updated with upcoming workshops, webinars, and competitions."
              cta="View Events →"
              href="/events"
              imageUrl="/calendar.svg"
              delay={0.2}
              icon={
                <svg
                  className="h-10 w-10 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-extrabold tracking-tight">
              Featured Student Projects
            </h3>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Innovative projects by students from the Engivora community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <ProjectCard
              title="Autonomous Delivery Drone"
              description="A project focusing on last-mile delivery solutions using UAV technology."
              imageUrl="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1600&auto=format&fit=crop"
              collaboratorsLabel="+2 collaborators"
              href="/projects/autonomous-delivery-drone"
            />
            <ProjectCard
              title="Smart Water Management System"
              description="An IoT-based system for efficient water usage monitoring and control."
              imageUrl="https://images.unsplash.com/photo-1558478551-1a378f63328e?q=80&w=1600&auto=format&fit=crop"
              href="/projects/smart-water-management"
            />
            <ProjectCard
              title="Submit Your Project"
              description="Get your work featured and recognized by the community."
              imageUrl="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop"
              href="/projects/submit"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Featured Events */}
      <FeaturedEvents />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <CtaBanner />
    </div>
  );
}
