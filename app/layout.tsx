'use client';

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/wecoded.ico" sizes="any" />
        <title>WeCoded Game - Celebrate Diversity in Tech</title>
        <meta name="description" content="An interactive game celebrating diversity in tech through stories and challenges" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}