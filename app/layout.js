import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ReduxProvider } from "@/Redux/Provider";
import { EdgeStoreProvider } from "@/lib/edgestore";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoveMaker - Get Started, Explore Workouts",
  description: "Get Started, Explore Workouts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EdgeStoreProvider>
        <ReduxProvider>
        <ClerkProvider>
        {children}
        </ClerkProvider>
        </ReduxProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
