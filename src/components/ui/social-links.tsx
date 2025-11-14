"use client"

import Link from "next/link"
import {
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  Twitter,
  ExternalLink,
  Users
} from "lucide-react"
import { WhatsAppIcon } from "./whatsapp-icon"
import { TelegramIcon } from "./telegram-icon"

interface SocialLink {
  name: string
  href: string
  icon: React.ComponentType<any>
  color: string
  hoverColor: string
  description?: string
}

interface WhatsAppChannel {
  name: string
  href: string
  icon: React.ComponentType<any>
  color: string
  hoverColor: string
  description: string
}

const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "http://linkedin.com/company/engivora",
    icon: Linkedin,
    color: "text-blue-600",
    hoverColor: "hover:text-blue-500",
    description: "Professional network and career updates"
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/engivora?igsh=bXRqa3Y2czR5OXJr",
    icon: Instagram,
    color: "text-pink-600",
    hoverColor: "hover:text-pink-500",
    description: "Visual content and student stories"
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@EngiVora",
    icon: Youtube,
    color: "text-red-600",
    hoverColor: "hover:text-red-500",
    description: "Educational videos and tutorials"
  },
  {
    name: "Telegram",
    href: "https://t.me/engivora",
    icon: TelegramIcon,
    color: "text-blue-500",
    hoverColor: "hover:text-blue-400",
    description: "Instant updates and community chat"
  },
  {
    name: "Twitter",
    href: "https://x.com/EngiVora?t=ki-9XSCzfUHpT_K8Lrqo1Q&s=09",
    icon: Twitter,
    color: "text-gray-800 dark:text-slate-200",
    hoverColor: "hover:text-gray-600 dark:hover:text-slate-300",
    description: "Latest news and quick updates"
  },
  {
    name: "Threads",
    href: "https://www.threads.com/@engivora",
    icon: Users,
    color: "text-gray-800 dark:text-slate-200",
    hoverColor: "hover:text-gray-600 dark:hover:text-slate-300",
    description: "Community discussions and insights"
  }
]

const whatsappChannel: WhatsAppChannel = {
  name: "WhatsApp Channel",
  href: "https://whatsapp.com/channel/0029Vb75C2EDeON8HP7kgq20",
  icon: WhatsAppIcon,
  color: "text-green-600",
  hoverColor: "hover:text-green-500",
  description: "Direct updates and announcements"
}

interface SocialLinksProps {
  variant?: "header" | "footer" | "compact" | "detailed"
  className?: string
  showLabels?: boolean
  showDescriptions?: boolean
}

export function SocialLinks({
  variant = "compact",
  className = "",
  showLabels = false,
  showDescriptions = false
}: SocialLinksProps) {
  if (variant === "header") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {socialLinks.slice(0, 4).map((social) => (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-slate-400 ${social.hoverColor} transition-colors p-1.5 rounded-lg hover:bg-slate-800/50`}
            title={social.name}
          >
            <social.icon className="h-4 w-4" />
            <span className="sr-only">{social.name}</span>
          </Link>
        ))}
        <div className="w-px h-4 bg-slate-700 mx-1" />
        <Link
          href={whatsappChannel.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-slate-400 ${whatsappChannel.hoverColor} transition-colors p-1.5 rounded-lg hover:bg-slate-800/50`}
          title={whatsappChannel.name}
        >
          <whatsappChannel.icon className="h-4 w-4" />
          <span className="sr-only">{whatsappChannel.name}</span>
        </Link>
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="font-semibold text-lg mb-4 text-slate-200">Connect with Us</h3>
        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors p-2.5 rounded-lg hover:bg-slate-800/50 group"
            >
              <social.icon className={`h-5 w-5 ${social.color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium">{social.name}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </Link>
          ))}
        </div>
        <div className="pt-3 border-t border-slate-700">
          <Link
            href={whatsappChannel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors p-2.5 rounded-lg hover:bg-slate-800/50 group"
          >
            <whatsappChannel.icon className={`h-5 w-5 ${whatsappChannel.color} group-hover:scale-110 transition-transform`} />
            <div className="flex-1">
              <span className="text-sm font-medium block">{whatsappChannel.name}</span>
              <span className="text-xs text-slate-500">{whatsappChannel.description}</span>
            </div>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Connect with Us</h2>
          <p className="text-slate-400">Stay connected and never miss an update!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-slate-800 ${social.color} group-hover:scale-110 transition-transform duration-300`}>
                  <social.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100 group-hover:text-sky-400 transition-colors">
                      {social.name}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {showDescriptions && social.description && (
                    <p className="text-sm text-slate-400 mt-2">{social.description}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href={whatsappChannel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-800/50 p-5 hover:border-green-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 block"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-green-900/50 ${whatsappChannel.color} group-hover:scale-110 transition-transform duration-300`}>
                <whatsappChannel.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-100 group-hover:text-green-400 transition-colors">
                    {whatsappChannel.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">
                    Official
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </div>
                <p className="text-sm text-slate-400 mt-2">{whatsappChannel.description}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  }

  // Default compact variant
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.map((social) => (
        <Link
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-slate-400 ${social.hoverColor} transition-colors p-2 rounded-lg hover:bg-slate-800/50`}
          title={social.name}
        >
          <social.icon className="h-5 w-5" />
          {showLabels && <span className="ml-2 text-sm">{social.name}</span>}
          <span className="sr-only">{social.name}</span>
        </Link>
      ))}
    </div>
  )
}

// Export individual social links data for other components
export type { WhatsAppChannel };
export { socialLinks, whatsappChannel }