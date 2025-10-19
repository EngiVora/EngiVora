"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SocialLinks } from "@/components/ui/social-links";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Star,
  TrendingUp,
  MessageSquare,
  Bell,
  ExternalLink,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { TelegramIcon } from "@/components/ui/telegram-icon";

const stats = [
  { label: "Active Followers", value: "50K+", icon: Users },
  { label: "Daily Updates", value: "10+", icon: Bell },
  { label: "Student Engagement", value: "95%", icon: Star },
  { label: "Growth Rate", value: "200%", icon: TrendingUp },
];

const features = [
  {
    title: "Instant Updates",
    description:
      "Get real-time notifications about exam schedules, job openings, and important announcements across all platforms.",
    icon: Bell,
  },
  {
    title: "Interactive Community",
    description:
      "Join discussions, ask questions, and connect with fellow engineering students and professionals.",
    icon: MessageSquare,
  },
  {
    title: "Exclusive Content",
    description:
      "Access platform-specific content including career tips, study materials, and industry insights.",
    icon: Star,
  },
  {
    title: "24/7 Support",
    description:
      "Get assistance and support from our team through multiple communication channels.",
    icon: Clock,
  },
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "help.engivora@gmail.com",
    href: "mailto:help.engivora@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bengaluru, Karnataka, India",
    href: "#",
  },
];

export default function ConnectPage() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  return (
    <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="w-full max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Connect with Us
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-slate-400 leading-relaxed">
            Join our thriving community of engineering students and
            professionals across multiple platforms. Stay updated, get inspired,
            and never miss an opportunity.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon
                className={`h-8 w-8 mx-auto mb-4 transition-colors ${
                  hoveredStat === index ? "text-sky-400" : "text-slate-400"
                }`}
              />
              <div className="text-2xl font-bold text-slate-100 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <SocialLinks variant="detailed" showDescriptions={true} />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Why Connect with Us?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Discover the benefits of staying connected with EngiVora across
              all our social media platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-3 rounded-lg bg-sky-900/20 text-sky-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Get in Touch
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Have questions? Need support? Reach out to us through any of these
              channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={index}
                className="text-center p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
              >
                <contact.icon className="h-8 w-8 mx-auto mb-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {contact.label}
                </h3>
                {contact.href !== "#" ? (
                  <a
                    href={contact.href}
                    className="text-slate-400 hover:text-sky-400 transition-colors flex items-center justify-center gap-2"
                  >
                    {contact.value}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="text-slate-400">{contact.value}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center bg-gradient-to-r from-sky-900/20 to-purple-900/20 rounded-xl p-12 border border-sky-800/50"
        >
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Never Miss an Update
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and follow us on social media to stay
            informed about the latest opportunities, exam updates, and career
            guidance for engineering students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-4">
              <Mail className="h-5 w-5 text-sky-400" />
              <span className="text-slate-300">Newsletter coming soon!</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Meanwhile, connect with us on:</span>
              <SocialLinks variant="compact" className="ml-2" />
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-slate-400 mb-8">
            Choose your preferred platform and start connecting with thousands
            of engineering students.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="http://linkedin.com/company/engivora"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Follow on LinkedIn
              <ExternalLink className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="https://whatsapp.com/channel/0029Vb75C2EDeON8HP7kgq20"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join WhatsApp Channel
              <WhatsAppIcon className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="https://t.me/engivora"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Telegram
              <TelegramIcon className="h-4 w-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
