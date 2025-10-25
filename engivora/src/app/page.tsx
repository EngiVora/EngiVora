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

      {/* Connect with Us */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Stay Connected with EngiVora
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Join our community across all platforms for instant updates,
              career guidance, and exclusive opportunities
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
          >
            {/* Left side - Social Links */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
              <SocialLinks variant="detailed" showDescriptions={true} />
            </div>

            {/* Right side - Benefits */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900/70 transition-all duration-300 hover:border-slate-700 hover:shadow-lg group">
                <div className="w-12 h-12 bg-sky-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-sky-600/30 transition-colors duration-300">
                  <span className="text-2xl">🔔</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-2 text-lg">
                    Instant Notifications
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Get real-time alerts for exam schedules, job postings, and
                    application deadlines
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900/70 transition-all duration-300 hover:border-slate-700 hover:shadow-lg group">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/30 transition-colors duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-2 text-lg">
                    Exclusive Content
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Access platform-specific tips, study materials, and career
                    guidance content
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900/70 transition-all duration-300 hover:border-slate-700 hover:shadow-lg group">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors duration-300">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-2 text-lg">
                    Active Community
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Connect with 50K+ engineering students and get answers to
                    your questions
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Connect CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-sky-900/30 to-purple-900/30 rounded-2xl p-10 border border-sky-800/50 backdrop-blur-sm hover:from-sky-900/40 hover:to-purple-900/40 transition-all duration-500 shadow-xl"
          >
            <div className="inline-block p-4 rounded-2xl bg-sky-600/20 mb-6">
              <Users className="h-10 w-10 text-sky-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-100 mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-lg">
              Choose your favorite platform and never miss an update. Join thousands of engineering students already connected with us.
            </p>
            <div className="flex flex-wrap justify-center gap-5">
              <Link
                href="https://whatsapp.com/channel/0029Vb75C2EDeON8HP7kgq20"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center gap-3 hover:scale-105 transform duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/40"
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp Channel
              </Link>
              <Link
                href="https://t.me/engivora"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-all flex items-center gap-3 hover:scale-105 transform duration-200 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40"
              >
                <TelegramIcon className="w-5 h-5" />
                Telegram
              </Link>
              <Link
                href="http://linkedin.com/company/engivora"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center gap-3 hover:scale-105 transform duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </Link>
            </div>
            <div className="mt-6">
              <Link
                href="/connect"
                className="text-sky-400 hover:text-sky-300 transition-colors text-base font-medium inline-flex items-center gap-2"
              >
                View all platforms <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <CtaBanner />
    </div>
  );
}
