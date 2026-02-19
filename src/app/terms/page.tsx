import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Owls Insight",
  description: "Terms of Service for the Owls Insight API platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-12 block w-fit"
        >
          &larr; Back to home
        </Link>

        <h1 className="text-4xl font-mono font-bold mb-2">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-12">Effective date: February 18, 2026</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">1. Agreement to Terms</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you
              (&quot;you&quot;, &quot;your&quot;, &quot;User&quot;) and Owls Insight LLC
              (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), governing your access to and
              use of the Owls Insight website at owlsinsight.com, the Owls Insight API, WebSocket feeds,
              documentation, and all related services (collectively, the &quot;Service&quot;).
            </p>
            <p className="mt-3">
              By creating an account, generating an API key, or otherwise accessing the Service, you acknowledge
              that you have read, understood, and agree to be bound by these Terms and our{" "}
              <a href="/privacy" className="text-[#00FF88] hover:underline">Privacy Policy</a>, which is
              incorporated herein by reference. If you do not agree to these Terms, you must not access or use
              the Service.
            </p>
            <p className="mt-3">
              If you are using the Service on behalf of an organization, you represent and warrant that you have
              authority to bind that organization to these Terms, and &quot;you&quot; refers to both you
              individually and the organization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              Owls Insight is a real-time sports betting odds aggregation platform. The Service collects publicly
              available odds, spreads, totals, and player prop data from multiple licensed sportsbooks and
              prediction markets, normalizes the data, and delivers it to subscribers through:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-zinc-400">
              <li>A RESTful JSON API accessible at api.owlsinsight.com</li>
              <li>Real-time WebSocket feeds for streaming odds updates</li>
              <li>Historical odds and props archive endpoints</li>
              <li>Live scores enrichment data</li>
              <li>Developer documentation at owlsinsight.com/docs</li>
            </ul>
            <p className="mt-3">
              The Service currently covers odds from sportsbooks including but not limited to Pinnacle, FanDuel,
              DraftKings, BetMGM, Bet365, Caesars, 1xBet, and Kalshi across NBA, NCAAB, NFL, NHL, NCAAF, MLB,
              Soccer, Tennis, CS2, and other sports. Coverage may change at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">3. Eligibility</h2>
            <p>
              You must be at least 18 years of age to use the Service. By agreeing to these Terms, you represent
              and warrant that you are at least 18 years old and have the legal capacity to enter into a binding
              contract. If you are under 18 years old, you may not create an account or use the Service under
              any circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">4. Account Registration and Security</h2>
            <p>
              To access the Service, you must register for an account by providing a valid email address and
              creating a password, or by authenticating through a supported OAuth provider (currently Discord).
              You agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-zinc-400">
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the confidentiality of your password and API keys</li>
              <li>Accept responsibility for all activity that occurs under your account</li>
              <li>Notify us immediately at david@wisesportsai.com if you suspect unauthorized access to your account</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate any account that we reasonably believe has been
              compromised, is being used fraudulently, or is in violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">5. API Keys</h2>
            <p>
              API keys are credentials that authenticate your requests to the Service. Each API key is unique
              to your account and is subject to the rate limits and access permissions of your subscription tier.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-zinc-400">
              <li>API keys are confidential — treat them as you would a password</li>
              <li>Do not share, publish, or embed API keys in client-side code, public repositories, or any publicly accessible location</li>
              <li>Do not sell, transfer, sublicense, or provide your API keys to third parties</li>
              <li>You are responsible for all usage associated with your API keys, whether authorized by you or not</li>
              <li>Compromised keys should be revoked immediately through your dashboard and replaced with new ones</li>
            </ul>
            <p className="mt-3">
              We reserve the right to revoke any API key at any time if we detect misuse, sharing, or a security
              compromise, with or without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">6. Subscription Plans and Billing</h2>
            <p className="font-medium text-white">6.1 Plans</p>
            <p className="mt-2">
              The Service is offered through tiered subscription plans (currently Bench, Rookie, and MVP), each
              with defined rate limits, feature access, and monthly pricing as described on our pricing page.
              We may modify plan names, features, or pricing at any time. Material changes to pricing will be
              communicated to active subscribers at least 30 days before taking effect.
            </p>

            <p className="font-medium text-white mt-4">6.2 Billing</p>
            <p className="mt-2">
              Subscriptions are billed on a recurring monthly basis. Payment is processed through Stripe, PayPal,
              or NOWPayments (cryptocurrency), depending on the payment method you select at checkout. By
              subscribing, you authorize us to charge your chosen payment method on a recurring basis until you
              cancel. All prices are in US dollars unless otherwise stated.
            </p>

            <p className="font-medium text-white mt-4">6.3 Free Trials</p>
            <p className="mt-2">
              We may offer free trial periods for certain plans. At the end of a trial, your subscription will
              automatically convert to a paid subscription unless you cancel before the trial expires. Trial
              eligibility is limited to one trial per user. Creating multiple accounts to obtain additional
              trials is a violation of these Terms.
            </p>

            <p className="font-medium text-white mt-4">6.4 Cancellation</p>
            <p className="mt-2">
              You may cancel your subscription at any time through your dashboard billing page. Upon
              cancellation, your access to paid features continues until the end of your current billing period.
              No prorated refunds are issued for partial months. After the billing period ends, your account
              reverts to a free tier with no API access.
            </p>

            <p className="font-medium text-white mt-4">6.5 Refunds</p>
            <p className="mt-2">
              Refund requests are handled on a case-by-case basis. If you experience a significant service
              outage or billing error, contact us at david@wisesportsai.com within 14 days of the charge. We
              reserve the right to grant or deny refund requests at our sole discretion.
            </p>

            <p className="font-medium text-white mt-4">6.6 Failed Payments</p>
            <p className="mt-2">
              If a recurring payment fails, we will notify you by email and may retry the charge. If payment
              remains unsuccessful, your subscription may be suspended or canceled. You remain responsible for
              any outstanding charges.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">7. Acceptable Use</h2>
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You shall not:</p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-zinc-400">
              <li>Share, resell, redistribute, or sublicense API data or API keys to any third party without our prior written consent</li>
              <li>Attempt to circumvent, disable, or interfere with rate limits, authentication mechanisms, or any security features of the Service</li>
              <li>Create multiple accounts to circumvent rate limits, abuse free trials, or evade enforcement actions</li>
              <li>Use the Service to build a competing product or service that replicates the core functionality of Owls Insight</li>
              <li>Scrape, crawl, or use automated means to access the Service outside of the provided API endpoints</li>
              <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of any part of the Service</li>
              <li>Introduce viruses, malware, or any harmful code to the Service</li>
              <li>Use the Service in any manner that could disable, overburden, damage, or impair the Service or interfere with any other party&apos;s use of the Service</li>
              <li>Use the Service for any purpose that is illegal under applicable law, including but not limited to gambling in jurisdictions where it is prohibited</li>
              <li>Misrepresent your identity or affiliation when creating an account</li>
            </ul>
            <p className="mt-3">
              We reserve the right to investigate suspected violations and take appropriate action, including
              suspending or terminating your account without notice or refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">8. Rate Limits and Fair Use</h2>
            <p>
              Each subscription tier has defined rate limits (requests per minute and requests per month). These
              limits are enforced automatically. Requests exceeding your tier&apos;s limits will receive HTTP 429
              (Too Many Requests) responses.
            </p>
            <p className="mt-3">
              Sustained usage patterns designed to maximize throughput at the expense of service quality for
              other users may be considered abuse even if technically within your plan&apos;s stated limits. We
              reserve the right to impose additional restrictions or require a plan upgrade if your usage pattern
              negatively impacts the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">9. Intellectual Property</h2>
            <p>
              The Service, including its software, API design, documentation, website design, logos, trademarks,
              and all content created by us, is owned by Owls Insight LLC and is protected by copyright,
              trademark, and other intellectual property laws.
            </p>
            <p className="mt-3">
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the
              Service in accordance with these Terms and your subscription plan. This license does not grant you
              any right to use our trademarks, logos, or branding without prior written consent.
            </p>
            <p className="mt-3">
              The odds data delivered through the Service is aggregated from publicly available sources. We do
              not claim ownership of the underlying odds data published by third-party sportsbooks. Your use of
              such data is subject to these Terms and any applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">10. Data Accuracy and No Gambling Advice</h2>
            <p>
              The Service provides odds data for informational and analytical purposes only. We aggregate data
              from third-party sources and, while we strive for accuracy and timeliness, we make no
              representations or warranties regarding the accuracy, completeness, reliability, or timeliness of
              any data provided.
            </p>
            <p className="mt-3 font-medium text-white">
              The Service does not constitute gambling advice, betting recommendations, or financial advice of
              any kind. We do not recommend, endorse, or encourage gambling. Any decisions you make based on
              data obtained through the Service are made at your own risk and sole discretion. You acknowledge
              that sports betting involves the risk of financial loss.
            </p>
            <p className="mt-3">
              We are not a sportsbook, bookmaker, or gambling operator. We do not accept bets, facilitate
              wagering, or hold user funds. We are a data aggregation service only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">11. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted or error-free access to
              the Service. The Service may be temporarily unavailable due to scheduled maintenance, infrastructure
              issues, third-party dependencies, or events beyond our reasonable control.
            </p>
            <p className="mt-3">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with
              or without notice. We will make reasonable efforts to provide advance notice of significant changes
              or planned downtime. Service status is available at status.owlsinsight.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">12. Third-Party Services</h2>
            <p>
              The Service integrates with third-party providers for payment processing (Stripe, PayPal,
              NOWPayments), authentication (Discord), and infrastructure (Amazon Web Services, Cloudflare).
              Your use of these third-party services is subject to their respective terms and privacy policies.
              We are not responsible for the availability, accuracy, or conduct of any third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">13. Disclaimer of Warranties</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE IS PROVIDED &quot;AS IS&quot; AND
              &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR
              OTHERWISE. WE SPECIFICALLY DISCLAIM ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p className="mt-3">
              WE DO NOT WARRANT THAT: (A) THE SERVICE WILL MEET YOUR REQUIREMENTS; (B) THE SERVICE WILL BE
              UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (C) THE DATA PROVIDED THROUGH THE SERVICE WILL BE
              ACCURATE, RELIABLE, OR COMPLETE; OR (D) ANY DEFECTS IN THE SERVICE WILL BE CORRECTED.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">14. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL OWLS INSIGHT LLC, ITS
              OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS
              OF REVENUE, LOSS OF DATA, LOSS OF BUSINESS OPPORTUNITY, OR LOSS OF GOODWILL, ARISING OUT OF OR
              IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICE, WHETHER BASED ON WARRANTY,
              CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY, EVEN IF WE HAVE BEEN
              ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="mt-3">
              IN NO EVENT SHALL OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING
              TO THESE TERMS OR THE SERVICE EXCEED THE AMOUNTS YOU HAVE PAID TO US IN THE TWELVE (12) MONTHS
              PRECEDING THE EVENT GIVING RISE TO THE LIABILITY, OR ONE HUNDRED US DOLLARS ($100), WHICHEVER IS
              GREATER.
            </p>
            <p className="mt-3">
              SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN WARRANTIES OR LIABILITY.
              IN SUCH JURISDICTIONS, OUR LIABILITY SHALL BE LIMITED TO THE GREATEST EXTENT PERMITTED BY LAW.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">15. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Owls Insight LLC, its officers, directors,
              employees, and agents from and against any and all claims, liabilities, damages, losses, costs,
              and expenses (including reasonable attorneys&apos; fees) arising out of or in connection with: (a)
              your use of the Service; (b) your violation of these Terms; (c) your violation of any rights of
              any third party; or (d) any content or data you transmit through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">16. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with or without cause and with
              or without notice, including for violation of these Terms. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-zinc-400">
              <li>Your right to access and use the Service ceases immediately</li>
              <li>All API keys associated with your account are revoked</li>
              <li>We are not obligated to provide refunds for any remaining subscription period, except where required by law</li>
              <li>Sections 9, 10, 13, 14, 15, 17, and 18 survive termination</li>
            </ul>
            <p className="mt-3">
              You may terminate your account at any time by canceling your subscription and contacting us at
              david@wisesportsai.com to request account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">17. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of
              New Jersey, United States, without regard to its conflict of law provisions.
            </p>
            <p className="mt-3">
              Any dispute arising out of or relating to these Terms or the Service shall first be resolved
              through good-faith negotiation. If the dispute cannot be resolved informally within 30 days,
              either party may pursue resolution in the state or federal courts located in New Jersey. You
              consent to the exclusive jurisdiction and venue of such courts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">18. General Provisions</h2>
            <p className="font-medium text-white">18.1 Modifications to Terms</p>
            <p className="mt-2">
              We reserve the right to modify these Terms at any time. If we make material changes, we will
              notify you by email or through a prominent notice on the Service at least 15 days before the
              changes take effect. Your continued use of the Service after the effective date of revised Terms
              constitutes your acceptance of the changes. If you do not agree to the revised Terms, you must
              stop using the Service and cancel your subscription.
            </p>

            <p className="font-medium text-white mt-4">18.2 Entire Agreement</p>
            <p className="mt-2">
              These Terms, together with the Privacy Policy, constitute the entire agreement between you and us
              regarding the Service and supersede all prior agreements, representations, and understandings.
            </p>

            <p className="font-medium text-white mt-4">18.3 Severability</p>
            <p className="mt-2">
              If any provision of these Terms is held to be invalid or unenforceable, that provision shall be
              modified to the minimum extent necessary to make it enforceable, and the remaining provisions
              shall continue in full force and effect.
            </p>

            <p className="font-medium text-white mt-4">18.4 Waiver</p>
            <p className="mt-2">
              Our failure to enforce any right or provision of these Terms shall not constitute a waiver of
              such right or provision.
            </p>

            <p className="font-medium text-white mt-4">18.5 Assignment</p>
            <p className="mt-2">
              You may not assign or transfer your rights or obligations under these Terms without our prior
              written consent. We may assign our rights and obligations without restriction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">19. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-lg border border-white/[0.06] bg-[#111113]">
              <p className="text-zinc-300">Owls Insight LLC</p>
              <p className="mt-1">
                <a href="mailto:david@wisesportsai.com" className="text-[#00FF88] hover:underline">
                  david@wisesportsai.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
