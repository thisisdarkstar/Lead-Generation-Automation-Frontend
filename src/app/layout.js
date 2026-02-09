import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lead Generation Automation",
  description: "Created By Darkstar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Popunder Ad Script */}
        <Script
          src="https://pl28663721.effectivegatecpm.com/4d/9f/00/4d9f0090033f201022b5ba66b45c044a.js"
          strategy="afterInteractive"
        />
        {/* Social Bar Script */}
        <Script
          src="https://pl28683893.effectivegatecpm.com/92/97/a9/9297a95748368c78bd8b72335241e42e.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
