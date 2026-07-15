import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://sushmita-kc-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sushmita Kc — Digital Marketing Specialist",
    template: "%s | Sushmita Kc",
  },
  description:
    "Data-driven Digital Marketing Specialist in Brisbane & Kathmandu. SEO, PPC, social media, content & analytics that drive measurable growth.",
  keywords: [
    "Digital Marketing Specialist",
    "SEO",
    "PPC",
    "Google Ads",
    "Social Media Marketing",
    "Content Marketing",
    "Brisbane",
    "Kathmandu",
    "Sushmita Kc",
  ],
  authors: [{ name: "Sushmita Kc" }],
  creator: "Sushmita Kc",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "Sushmita Kc Portfolio",
    title: "Sushmita Kc — Digital Marketing Specialist",
    description:
      "Driving measurable growth through data-driven digital strategies.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushmita Kc — Digital Marketing Specialist",
    description:
      "Driving measurable growth through data-driven digital strategies.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <Navbar nav={content.nav} />
        <main className="flex-1">{children}</main>
        <Footer
          nav={content.nav}
          contact={content.contact}
          services={content.services}
        />
      </body>
    </html>
  );
}
