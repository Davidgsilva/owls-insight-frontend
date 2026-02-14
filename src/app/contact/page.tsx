import Link from "next/link";
import { EnvelopeSimple, DiscordLogo, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Contact — Owls Insight",
  description: "Get in touch with the Owls Insight team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <Link
          href="/#pricing"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-12 w-fit"
        >
          <ArrowLeft size={16} />
          Back to pricing
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 mb-6">
          <span className="text-xs font-mono text-green-400">CONTACT</span>
        </div>

        <h1 className="text-4xl font-mono font-bold mb-4">
          Get in <span className="text-green-400">Touch</span>
        </h1>
        <p className="text-zinc-400 mb-12">
          Have questions about our API, pricing, or need help getting started?
          Reach out through any of the channels below.
        </p>

        <div className="space-y-4">
          <a
            href="mailto:david@wisesportsai.com"
            className="flex items-center gap-4 p-5 rounded-xl border border-white/5 bg-[#111111] hover:border-[#00FF88]/30 transition-all group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#00FF88]/10">
              <EnvelopeSimple size={20} className="text-[#00FF88]" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-0.5">Email</p>
              <p className="font-mono text-[#00FF88] group-hover:text-[#00d4aa] transition-colors">
                david@wisesportsai.com
              </p>
            </div>
          </a>

          <a
            href="https://discord.gg/Dhau4fEu63"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-xl border border-white/5 bg-[#111111] hover:border-[#5865F2]/30 transition-all group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#5865F2]/10">
              <DiscordLogo size={20} className="text-[#5865F2]" />
            </div>
            <div>
              <p className="text-sm text-zinc-500 mb-0.5">Discord</p>
              <p className="font-mono text-[#5865F2] group-hover:text-[#7289DA] transition-colors">
                Join the Owls Insight channel
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
