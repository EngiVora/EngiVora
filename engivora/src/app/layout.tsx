import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"
import { ConditionalLayout } from "@/components/conditional-layout"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { ParticleWaves } from "@/components/ui/particle-waves"
import { PerformanceOptimizations } from "@/components/performance-optimizations"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Engivora - One-stop hub for every engineering student",
  description: "Your comprehensive platform for exam updates, job opportunities, blogs, discounts, and career guidance for engineering students.",
  keywords: "engineering, exams, jobs, career, student hub, engineering students",
  authors: [{ name: "Engivora Team" }],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
  openGraph: {
    title: "Engivora - Engineering Student Hub",
    description: "One-stop hub for every engineering student",
    type: "website",
    images: ['/logo.png'],
    siteName: 'Engivora',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engivora - Engineering Student Hub',
    description: 'One-stop hub for every engineering student',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative z-10">
            <ParticleWaves />
          </div>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster position="top-right" />
          <ScrollToTop />
          <PerformanceOptimizations />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  )
}