import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Owls Insight — Sports Betting Odds API",
  description:
    "Aggregated sports betting odds and player props API. Compare lines across major sportsbooks and prediction markets.",
  keywords: [
    "sports betting API",
    "odds API",
    "live odds",
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
    title: "Owls Insight — Sports Betting Odds API",
    description:
      "Aggregated sports betting odds and player props API. Compare lines across major sportsbooks and prediction markets.",
    url: "https://owlsinsight.com",
    siteName: "Owls Insight",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Owls Insight — Sports Betting Odds API",
    description:
      "Aggregated sports betting odds and player props API. Compare lines across major sportsbooks and prediction markets.",
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
