import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura+ | Make your campus love look expensive.",
  description: "Aura+ helps CU students make fake weddings, fake events, proposals, and couple moments feel premium and unforgettable.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}