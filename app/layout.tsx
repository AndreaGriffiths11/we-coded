import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "WeCoded | Celebrate in Code",
  description: "An interactive celebration of diversity in tech through code and stories",
  authors: [{ name: "WeCoded Community" }],
  keywords: ["diversity", "tech", "coding", "inclusion", "community"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: "#1a1a3a"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`app-body ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}