import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Synthesis - Codebase Intelligence Platform",
  description: "Autonomous Codebase Intelligence, Architecture Q&A, and PR Copilot",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-200 antialiased font-sans flex h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
