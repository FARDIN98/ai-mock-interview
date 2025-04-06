import type { Metadata, Viewport } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Define the Mona Sans font with variable font settings
const monaSans = Mona_Sans({
  variable: "--font-mona-sans", // Set the CSS variable name for the font
  subsets: ["latin"], // Specify the character subsets to include (Latin in this case)
});

// Define metadata for the application
export const metadata: Metadata = {
  title: "PrepWise", // Set the title of the application
  description: "An AI powered platform preparing for mock interviews.", // Set the description of the application
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PrepWise"
  }
};

// Define viewport configuration
export const viewport: Viewport = {
  themeColor: "#06B6D4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

// Define the root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Define the type of the children prop as React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="application-name" content="PrepWise" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PrepWise" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/robot.png" />
      </head>
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
