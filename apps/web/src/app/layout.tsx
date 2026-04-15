import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Metriq",
  description: "Proof-of-work hiring platform MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

