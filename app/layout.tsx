import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CandidView - IEEWA",
  description: "Candidate Management System",
  manifest: "/manifest.json",
  themeColor: "#14b8a6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CandidView",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}