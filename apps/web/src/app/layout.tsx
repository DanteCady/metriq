import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getSiteUrl } from "../lib/site-url";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = getSiteUrl();
const defaultDescription =
  "Proof-of-work hiring platform with rubric-backed auditions and evidence-first review.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Metriq",
    template: "%s · Metriq",
  },
  description: defaultDescription,
  applicationName: "Metriq",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Metriq",
    title: "Metriq",
    description: defaultDescription,
  },
  twitter: {
    card: "summary",
    title: "Metriq",
    description: defaultDescription,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-dvh font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

