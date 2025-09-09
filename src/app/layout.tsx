import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${robotoMono.className} antialiased`}>
        <main className="flex flex-col w-full text-black">{children}</main>
      </body>
    </html>
  );
}
