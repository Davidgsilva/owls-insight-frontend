import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://owlsinsight.com"),
  title: {
    default: "Owls Insight — Sports Betting Odds API",
    template: "%s | Owls Insight",
  },
  description:
    "Real-time sports betting odds API. Compare sharp lines, FanDuel, DraftKings, BetMGM, Bet365, Caesars, Kalshi, 1xBet, and Polymarket via REST and WebSocket.",
  keywords: [
    "sports betting API",
    "odds API",
    "live odds",
    "betting data",
    "NBA odds",
    "NFL odds",
    "NHL odds",
    "MLB odds",
    "NCAAB odds",
    "soccer odds",
    "sportsbook API",
    "odds comparison",
    "line movement",
    "player props API",
    "sharp lines API",
    "sports data API",
    "betting odds aggregator",
    "real-time odds",
    "WebSocket odds",
  ],
  authors: [{ name: "Owls Insight" }],
  openGraph: {
    title: "Owls Insight — Real-Time Sports Betting Odds API",
    description:
      "Compare live odds from 9 sources via REST API and WebSocket. NBA, NFL, NHL, MLB, NCAAB, soccer, tennis, and esports.",
    url: "https://owlsinsight.com",
    siteName: "Owls Insight",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Owls Insight — Real-Time Sports Betting Odds API",
    description:
      "Compare live odds from 9 sources via REST API and WebSocket. NBA, NFL, NHL, MLB, NCAAB, soccer, tennis, and esports.",
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
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
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
