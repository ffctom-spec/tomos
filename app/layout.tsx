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
  title: "TOMOS | 24h AI Brand Operating System",
  description:
    "TOMOS is an always-on AI brand operating system that researches, analyzes, proposes, improves, and routes only executive approvals to the user.",
  keywords: [
    "TOMOS",
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
    title: "TOMOS | 24h AI Brand Operating System",
    description:
      "An always-on AI Command Center for research, AIO, SNS, commerce, content review, knowledge assets, learning loops, and executive approvals.",
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
