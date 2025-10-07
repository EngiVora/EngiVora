import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "react-hot-toast"
import { ConditionalLayout } from "@/components/conditional-layout"
import { ClerkProvider } from '@clerk/nextjs'
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { ParticleWaves } from "@/components/ui/particle-waves"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Check if Clerk is properly configured
const isClerkConfigured = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder')
}

// Conditional Clerk wrapper
function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured()) {
    return <ClerkProvider>{children}</ClerkProvider>
  }
  return <>{children}</>
}

export const metadata: Metadata = {
  title: "Engivora - One-stop hub for every engineering student",
  description: "Your comprehensive platform for exam updates, job opportunities, blogs, discounts, and career guidance for engineering students.",
  keywords: "engineering, exams, jobs, career, student hub, engineering students",
  authors: [{ name: "Engivora Team" }],
  openGraph: {
    title: "Engivora - Engineering Student Hub",
    description: "One-stop hub for every engineering student",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
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
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}
