import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/headerfooter/SiteFooter";
import { SiteHeader } from "@/components/headerfooter/SiteHeader";

const robotoMono = Roboto_Mono({
  variable: "--font-robotoMono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chalamet Look alike Competition",
  description:
    "Timothee Chalamet Look alike Competition on the internet judged by an AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body
        className={`${robotoMono.className} antialiased flex flex-col min-h-screen pb-16 px-4 sm:px-0`}
        style={{ backgroundColor: "#ffffff", color: "#000000" }}
      >
        <SiteHeader />
        <main className="flex flex-col w-full text-black bg-white max-w-124 items-center justify-center mx-auto">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
