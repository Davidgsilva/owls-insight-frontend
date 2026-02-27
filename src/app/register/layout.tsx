import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Sign up for Owls Insight to get your API key. Free tier available. Access live odds from 9 sources including sharp lines, FanDuel, DraftKings, BetMGM, Bet365, Caesars, Kalshi, 1xBet, and Polymarket.",
  alternates: {
    canonical: "https://owlsinsight.com/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
