import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NavigationLoader } from "@/components/layout/NavigationLoader";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "JBC Solar Energy | Powering a Brighter Tomorrow",
    template: "%s | JBC Solar Energy",
  },
  description:
    "Smart solar solutions, professionally delivered. High-efficiency residential, commercial, and industrial solar installations with 25-year warranty.",
  keywords: [
    "Solar Energy",
    "JBC Solar",
    "Solar Panels",
    "Residential Solar",
    "Commercial Solar",
    "Austin Solar Installation",
    "Clean Energy",
  ],
  authors: [{ name: "JBC Solar Energy" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakartaSans.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans bg-white text-slate-800 antialiased selection:bg-[#f36a26]/20 selection:text-[#f36a26]">
        <Header />
        <NavigationLoader />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
