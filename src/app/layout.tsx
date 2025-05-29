import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chalamet Lookalike Contest",
  description:
    "Miss the Chalamet lookalike contest in NYC? We've taken it to the internet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} antialiased`}>
        <main className="flex flex-col bg-gray-900 w-full">{children}</main>
      </body>
    </html>
  );
}
