import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOMOS | Private AI Brand Operating System",
  description:
    "TOMOS is a private AI operating system for user-owned brands, always-on AI engines, AIO intelligence, content review, commerce analytics, and approval-based execution.",
  keywords: [
    "TOMOS",
    "Private AI Brand Operating System",
    "API-ready Demo",
    "AI Brand Operating System",
    "Always-On AI Engine",
    "Command Center",
    "Executive Approval",
    "AI Decision Log",
    "Automation Rules",
    "AIO Intelligence",
    "Learning Loop",
  ],
  openGraph: {
    title: "TOMOS | Private AI Brand Operating System",
    description:
      "A private AI operating system for user-owned brands, always-on AI engines, AIO intelligence, content review, commerce analytics, and approval-based execution.",
    siteName: "TOMOS",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black">{children}</body>
    </html>
  );
}
