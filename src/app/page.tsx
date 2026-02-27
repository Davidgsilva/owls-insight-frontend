import type { Metadata } from "next";
import {
  Header,
  Hero,
  LiveTicker,
  Features,
  Coverage,
  Pricing,
  Footer,
} from "@/components/landing";

export const metadata: Metadata = {
  title: {
    absolute: "Owls Insight — Real-Time Sports Betting Odds API",
  },
  description:
    "Compare live betting odds from 9 sources including sharp lines, FanDuel, DraftKings, BetMGM, Bet365, Caesars, Kalshi, 1xBet, and Polymarket. REST API and WebSocket for NBA, NFL, NHL, MLB, NCAAB, soccer, tennis, and esports.",
  alternates: {
    canonical: "https://owlsinsight.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://owlsinsight.com/#organization",
      name: "Owls Insight",
      url: "https://owlsinsight.com",
      description:
        "Real-time sports betting odds aggregation API covering major sportsbooks and prediction markets.",
    },
    {
      "@type": "WebApplication",
      "@id": "https://owlsinsight.com/#webapp",
      name: "Owls Insight API",
      url: "https://owlsinsight.com",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description:
        "REST API and WebSocket service for live sports betting odds from 9 sources. Covers NBA, NFL, NHL, MLB, NCAAB, soccer, tennis, CS2, and more.",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
          url: "https://owlsinsight.com/register",
          availability: "https://schema.org/InStock",
          description: "Basic access with rate limits",
        },
        {
          "@type": "Offer",
          name: "Bench",
          price: "9.99",
          priceCurrency: "USD",
          url: "https://owlsinsight.com/register?tier=bench",
          availability: "https://schema.org/InStock",
          description: "Standard API access",
        },
        {
          "@type": "Offer",
          name: "Rookie",
          price: "24.99",
          priceCurrency: "USD",
          url: "https://owlsinsight.com/register?tier=rookie",
          availability: "https://schema.org/InStock",
          description: "Enhanced access with player props",
        },
        {
          "@type": "Offer",
          name: "MVP",
          price: "49.99",
          priceCurrency: "USD",
          url: "https://owlsinsight.com/register?tier=mvp",
          availability: "https://schema.org/InStock",
          description:
            "Full access with real-time WebSocket, player props, and historical data",
        },
      ],
      featureList: [
        "Live odds from 9 sources",
        "REST API and WebSocket",
        "Player props",
        "Live scores",
        "Historical odds data",
        "Line movement tracking",
      ],
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What sportsbooks does Owls Insight cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Owls Insight aggregates odds from 9 sources: sharp lines, FanDuel, DraftKings, BetMGM, Bet365, Caesars, Kalshi, 1xBet, and Polymarket.",
      },
    },
    {
      "@type": "Question",
      name: "What sports are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NBA, NFL, NHL, MLB, NCAAB, NCAAF, soccer (global leagues), tennis, and CS2 esports.",
      },
    },
    {
      "@type": "Question",
      name: "Does Owls Insight support real-time data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The MVP plan includes WebSocket streaming for real-time odds updates with sub-second latency on sharp lines.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="min-h-screen">
        <Header />
        <Hero />
        <LiveTicker />
        <Features />
        <Coverage />
        <Pricing />
        <Footer />
      </main>
    </>
  );
}
