import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Complete API reference for Owls Insight. REST endpoints and WebSocket events for live odds, player props, scores, historical data, and Kalshi prediction markets.",
  alternates: {
    canonical: "https://owlsinsight.com/docs",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
