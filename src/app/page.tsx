import {
  Header,
  Hero,
  LiveTicker,
  Features,
  Coverage,
  Pricing,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <LiveTicker />
      <Features />
      <Coverage />
      <Pricing />
      <Footer />
    </main>
  );
}
