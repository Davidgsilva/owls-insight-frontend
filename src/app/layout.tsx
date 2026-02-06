import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Owls Insight",
  description:
    "Professional-grade sports betting odds API with real-time WebSocket updates. Access odds from Pinnacle, FanDuel, DraftKings, BetMGM, Bet365, and Caesars across NBA, NFL, NHL, MLB, NCAAB, and NCAAF.",
  keywords: [
    "sports betting API",
    "odds API",
    "real-time odds",
    "betting data",
    "NBA odds",
    "NFL odds",
    "NHL odds",
    "sportsbook API",
    "line movement",
    "player props API",
  ],
  authors: [{ name: "Owls Insight" }],
  openGraph: {
    title: "Owls Insight",
    description:
      "Professional-grade sports betting odds API with real-time WebSocket updates from 6 major sportsbooks.",
    url: "https://owlsinsight.com",
    siteName: "Owls Insight",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Owls Insight",
    description:
      "Professional-grade sports betting odds API with real-time WebSocket updates from 6 major sportsbooks.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111113',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  );
}
