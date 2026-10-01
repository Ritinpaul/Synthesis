import "./globals.css";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "Synthesis - AI Codebase Intelligence & PR Risk Platform",
  description: "Autonomous Codebase Intelligence, Breaking Change Detection, and Multi-Agent Architecture Q&A",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#060A0A] text-slate-100 antialiased flex h-screen overflow-hidden">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
