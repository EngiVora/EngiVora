import type { Metadata } from "next";
import ConnectPage from "@/components/pages/ConnectPage";

export const metadata: Metadata = {
  title: "Connect with Us - EngiVora",
  description:
    "Stay connected with EngiVora through our social media channels. Follow us on LinkedIn, Instagram, YouTube, Telegram, Twitter, Threads, and WhatsApp for the latest updates, engineering content, and student opportunities.",
  keywords:
    "EngiVora social media, engineering students, LinkedIn, Instagram, YouTube, Telegram, Twitter, Threads, WhatsApp, engineering community",
  openGraph: {
    title: "Connect with EngiVora",
    description:
      "Join our community of engineering students across all social media platforms",
    type: "website",
  },
};

export default function ConnectPageWrapper() {
  return <ConnectPage />;
}
