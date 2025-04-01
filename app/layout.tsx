import type { Metadata } from "next";
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
};

// Define the root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Define the type of the children prop as React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
