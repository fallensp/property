import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import { ThemeProvider } from "@/components/theme/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Property Listing Wizard',
  description:
    'Create property listings with a guided, multi-step experience aligned with PRD requirements.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitializer = `
    (function() {
      try {
        var stored = localStorage.getItem('property-theme');
        var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored === 'light' || stored === 'dark' ? stored : (systemPrefersDark ? 'dark' : 'light');
        var root = document.documentElement;
        root.classList.remove('light','dark');
        root.classList.add(theme);
        root.style.colorScheme = theme;
      } catch (error) {
        console.warn('Theme initialization failed', error);
      }
    })();
  `;

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="theme-initializer" strategy="beforeInteractive">
          {themeInitializer}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
