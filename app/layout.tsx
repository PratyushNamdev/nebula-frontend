import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/react_query_provider";
import { MobileSidebarWrapper } from "@layout";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nebula",
  description: "Cloud for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}
      >
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dggdpeaw4/image/upload/v1768509648/Gemini_Generated_Image_6clhm6clhm6clhm6_c7o1cw.png')",
          }}
        />
        <ReactQueryProvider>
          <MobileSidebarWrapper />
          {children}
          <Toaster richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
