"use client";

import { Inter } from "next/font/google";
import TopMenu from "./components/TopMenu";
import "./globals.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body className={inter.className}>
          <header>
            <TopMenu />
          </header>
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
