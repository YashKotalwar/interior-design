import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Kotalwar Interiors — Rooms, considered.",
    template: "%s · Kotalwar",
  },
  description:
    "Kotalwar Interiors. Interior design for houses that are meant to be lived in. Residences, kitchens, and working rooms.",
  openGraph: {
    title: "Kotalwar Interiors — Rooms, considered.",
    description: "A studio practice. Rooms drawn for light, material, and daily use.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className={`${geistSans.className} flex min-h-full flex-col bg-mist text-ink`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
