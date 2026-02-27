import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Log in to your Owls Insight account to manage API keys and access the dashboard.",
  robots: { index: false, follow: true },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
