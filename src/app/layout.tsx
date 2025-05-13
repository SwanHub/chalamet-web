import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.variable} ${inter.variable} antialiased`}>
        <Header />
        <main className="container mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
