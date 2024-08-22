"use client";

import { Inter } from "next/font/google";
import TopMenu from "./components/TopMenu";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <h1>Traffic Monitor</h1>
          <TopMenu />
        </header>
        {children}
      </body>
    </html>
  );
}
