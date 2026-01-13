import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ReadingSettingsProvider } from "@/contexts/ReadingSettingsContext";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Quran App - Read, Listen & Reflect",
  description: "A beautiful and modern Quran reading application with audio recitations, translations, and bookmarking features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider>
            <ReadingSettingsProvider>
              {children}
            </ReadingSettingsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
