import type { Metadata, Viewport } from "next";
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
  title: "TOMOS Beta 0.2 | Executive Mode",
  description:
    "TOMOS Beta 0.2 is a mobile-first private AI operating system for executives to review, approve, hold, and consult AI from iPhone.",
  keywords: [
    "TOMOS",
    "Private AI Brand Operating System",
    "API-ready Demo",
    "Executive Mode",
    "Mobile First",
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
    title: "TOMOS Beta 0.2 | Executive Mode",
    description:
      "A mobile-first private AI operating system for executives to approve AI decisions from iPhone.",
    siteName: "TOMOS",
    locale: "ja_JP",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "TOMOS",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
