import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Owls Insight",
  description: "Privacy Policy for the Owls Insight API platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-12 block w-fit"
        >
          &larr; Back to home
        </Link>

        <h1 className="text-4xl font-mono font-bold mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-12">Effective date: February 18, 2026</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Owls Insight LLC (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
              operates the Owls Insight platform at owlsinsight.com and the Owls Insight API at
              api.owlsinsight.com (collectively, the &quot;Service&quot;).
            </p>
            <p className="mt-3">
              This Privacy Policy explains what information we collect, how we use and share it, and your
              choices regarding your information. By using the Service, you agree to the collection and use of
              information in accordance with this policy. This policy should be read alongside our{" "}
              <a href="/terms" className="text-[#00FF88] hover:underline">Terms of Service</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">2. Information We Collect</h2>

            <p className="font-medium text-white">2.1 Information You Provide</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-zinc-400">
              <li>
                <strong className="text-zinc-300">Account registration:</strong> Email address and password
                (stored as a bcrypt hash — we never store plaintext passwords)
              </li>
              <li>
                <strong className="text-zinc-300">Discord OAuth:</strong> If you sign in with Discord, we
                receive your Discord user ID, username, and avatar URL. We do not access your Discord messages,
                servers, or friends list
              </li>
              <li>
                <strong className="text-zinc-300">Billing information:</strong> Your subscription tier and
                billing status. We do not directly collect or store credit card numbers, bank account details,
                or PayPal credentials — all payment processing is handled by our third-party payment processors
                (see Section 5)
              </li>
              <li>
                <strong className="text-zinc-300">Support communications:</strong> Any emails or messages you
                send to us
              </li>
            </ul>

            <p className="font-medium text-white mt-5">2.2 Information Collected Automatically</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-zinc-400">
              <li>
                <strong className="text-zinc-300">API usage data:</strong> For each API request, we log the API
                key used, the endpoint accessed, response status code, and timestamp. This data is used to
                enforce rate limits, generate your usage dashboard, and monitor service health
              </li>
              <li>
                <strong className="text-zinc-300">Server logs:</strong> Standard web server logs including IP
                addresses, request URLs, user agent strings, referrer URLs, and response codes. These logs are
                used for security monitoring and debugging
              </li>
              <li>
                <strong className="text-zinc-300">Error tracking:</strong> If an error occurs during your use
                of the Service, we may log technical details to diagnose and fix the issue
              </li>
            </ul>

            <p className="font-medium text-white mt-5">2.3 Information We Do Not Collect</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-zinc-400">
              <li>We do not use analytics trackers (no Google Analytics, Mixpanel, Amplitude, etc.)</li>
              <li>We do not use advertising pixels or retargeting cookies</li>
              <li>We do not collect biometric data, geolocation data, or device fingerprints</li>
              <li>We do not purchase data about you from third-party data brokers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-zinc-400">
              <li>
                <strong className="text-zinc-300">Provide the Service:</strong> Authenticate your identity,
                process API requests, enforce rate limits and subscription entitlements, and deliver data
                through the API and WebSocket feeds
              </li>
              <li>
                <strong className="text-zinc-300">Process payments:</strong> Manage your subscription, process
                billing through our payment providers, and handle cancellations and refunds
              </li>
              <li>
                <strong className="text-zinc-300">Communicate with you:</strong> Send transactional emails
                including account verification, password reset, payment confirmations, payment failure
                notifications, subscription changes, and trial expiration reminders. We do not send marketing
                emails
              </li>
              <li>
                <strong className="text-zinc-300">Maintain security:</strong> Detect and prevent fraud, abuse,
                and unauthorized access to accounts and API keys
              </li>
              <li>
                <strong className="text-zinc-300">Improve the Service:</strong> Analyze aggregate, anonymized
                usage patterns to identify performance issues, optimize infrastructure, and guide feature
                development
              </li>
              <li>
                <strong className="text-zinc-300">Comply with legal obligations:</strong> Respond to legal
                requests and prevent harm as required by applicable law
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">4. Cookies and Local Storage</h2>
            <p>
              We use minimal browser storage, limited to what is necessary for the Service to function:
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border border-white/[0.06]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Type</th>
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Name</th>
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Purpose</th>
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">httpOnly cookie</td>
                    <td className="px-4 py-2"><code className="text-xs bg-white/5 px-1 py-0.5 rounded">token</code></td>
                    <td className="px-4 py-2">Session authentication (JWT)</td>
                    <td className="px-4 py-2">7 days</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">localStorage</td>
                    <td className="px-4 py-2"><code className="text-xs bg-white/5 px-1 py-0.5 rounded">owls_user</code></td>
                    <td className="px-4 py-2">Cached user profile for instant UI load</td>
                    <td className="px-4 py-2">Until logout</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">sessionStorage</td>
                    <td className="px-4 py-2"><code className="text-xs bg-white/5 px-1 py-0.5 rounded">paypal_sub_id</code></td>
                    <td className="px-4 py-2">PayPal subscription ID during checkout redirect</td>
                    <td className="px-4 py-2">Until tab closes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              We do not use any third-party tracking cookies, analytics cookies, or advertising cookies. We do
              not participate in cross-site tracking. Because we only use strictly necessary cookies, no cookie
              consent banner is required under most privacy regulations, though we disclose our cookie usage
              here for transparency.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">5. Third-Party Service Providers</h2>
            <p>
              We share your information with the following categories of service providers, solely to operate
              the Service. We do not sell your personal information to anyone.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border border-white/[0.06]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Provider</th>
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Purpose</th>
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Data Shared</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">Stripe</td>
                    <td className="px-4 py-2">Credit/debit card payments</td>
                    <td className="px-4 py-2">Email, subscription tier, payment details (handled by Stripe)</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">PayPal</td>
                    <td className="px-4 py-2">PayPal payments</td>
                    <td className="px-4 py-2">Email, subscription tier, PayPal payer ID</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">NOWPayments</td>
                    <td className="px-4 py-2">Cryptocurrency payments</td>
                    <td className="px-4 py-2">User ID, subscription tier, payment status</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">Amazon Web Services</td>
                    <td className="px-4 py-2">Cloud infrastructure and hosting</td>
                    <td className="px-4 py-2">All Service data (stored in US-East-1 region, Virginia)</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">AWS Simple Email Service</td>
                    <td className="px-4 py-2">Transactional email delivery</td>
                    <td className="px-4 py-2">Email address, email content</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">Cloudflare</td>
                    <td className="px-4 py-2">CDN, DDoS protection, DNS</td>
                    <td className="px-4 py-2">IP addresses, request metadata (processed at edge, not stored long-term)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Discord</td>
                    <td className="px-4 py-2">OAuth authentication</td>
                    <td className="px-4 py-2">Discord user ID, username, avatar (only if you choose Discord sign-in)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Each provider is subject to their own privacy policy. We encourage you to review them:
              {" "}<a href="https://stripe.com/privacy" className="text-[#00FF88] hover:underline" target="_blank" rel="noopener noreferrer">Stripe</a>,
              {" "}<a href="https://www.paypal.com/webapps/mpp/ua/privacy-full" className="text-[#00FF88] hover:underline" target="_blank" rel="noopener noreferrer">PayPal</a>,
              {" "}<a href="https://nowpayments.io/privacy-policy" className="text-[#00FF88] hover:underline" target="_blank" rel="noopener noreferrer">NOWPayments</a>,
              {" "}<a href="https://aws.amazon.com/privacy/" className="text-[#00FF88] hover:underline" target="_blank" rel="noopener noreferrer">AWS</a>,
              {" "}<a href="https://www.cloudflare.com/privacypolicy/" className="text-[#00FF88] hover:underline" target="_blank" rel="noopener noreferrer">Cloudflare</a>,
              {" "}<a href="https://discord.com/privacy" className="text-[#00FF88] hover:underline" target="_blank" rel="noopener noreferrer">Discord</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">6. Data Retention</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border border-white/[0.06]">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Data Type</th>
                    <th className="px-4 py-2 text-zinc-400 font-mono font-medium">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-400">
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">Account data (email, password hash, profile)</td>
                    <td className="px-4 py-2">Until account deletion</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">API usage logs (per-request)</td>
                    <td className="px-4 py-2">90 days</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">Aggregate usage statistics</td>
                    <td className="px-4 py-2">Indefinitely (anonymized)</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">Server and access logs</td>
                    <td className="px-4 py-2">30 days</td>
                  </tr>
                  <tr className="border-b border-white/[0.06]">
                    <td className="px-4 py-2">Subscription and billing records</td>
                    <td className="px-4 py-2">7 years (tax and legal compliance)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Deleted account data</td>
                    <td className="px-4 py-2">Permanently removed within 30 days of deletion request</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">7. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-zinc-400">
              <li>
                <strong className="text-zinc-300">Encryption in transit:</strong> All connections use TLS/HTTPS.
                Unencrypted HTTP requests are automatically redirected
              </li>
              <li>
                <strong className="text-zinc-300">Password security:</strong> Passwords are hashed using bcrypt
                with per-user salts. We never store or log plaintext passwords
              </li>
              <li>
                <strong className="text-zinc-300">API key security:</strong> API keys are stored as SHA-256
                hashes. The full key is shown only once at creation time and cannot be retrieved afterward
              </li>
              <li>
                <strong className="text-zinc-300">Session tokens:</strong> Authentication uses signed JWTs stored
                in httpOnly, Secure, SameSite cookies that are inaccessible to client-side JavaScript
              </li>
              <li>
                <strong className="text-zinc-300">Infrastructure security:</strong> Our infrastructure runs on
                AWS with network isolation, encrypted storage, and role-based access controls. External traffic
                is routed through Cloudflare for DDoS protection
              </li>
            </ul>
            <p className="mt-3">
              While we strive to use commercially acceptable means to protect your information, no method of
              electronic transmission or storage is 100% secure. We cannot guarantee absolute security. If we
              become aware of a security breach that affects your personal data, we will notify you in
              accordance with applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">8. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-zinc-400">
              <li>
                <strong className="text-zinc-300">Right to access:</strong> Request a copy of the personal data
                we hold about you
              </li>
              <li>
                <strong className="text-zinc-300">Right to correction:</strong> Request correction of inaccurate
                or incomplete data. You can update your email and password directly from your dashboard account
                settings
              </li>
              <li>
                <strong className="text-zinc-300">Right to deletion:</strong> Request deletion of your account
                and personal data. Some data may be retained as described in Section 6 (e.g., billing records
                for tax compliance)
              </li>
              <li>
                <strong className="text-zinc-300">Right to data portability:</strong> Request your data in a
                structured, machine-readable format
              </li>
              <li>
                <strong className="text-zinc-300">Right to object:</strong> Object to processing of your data
                for certain purposes
              </li>
              <li>
                <strong className="text-zinc-300">Right to restrict processing:</strong> Request that we limit
                how we use your data
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:david@wisesportsai.com" className="text-[#00FF88] hover:underline">
                david@wisesportsai.com
              </a>{" "}
              with the subject line &quot;Privacy Rights Request.&quot; We will respond within 30 days. We may
              ask you to verify your identity before processing your request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">9. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, the California Consumer Privacy Act (CCPA) provides you with
              additional rights:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-zinc-400">
              <li>
                <strong className="text-zinc-300">Right to know:</strong> You may request disclosure of the
                categories and specific pieces of personal information we have collected about you
              </li>
              <li>
                <strong className="text-zinc-300">Right to delete:</strong> You may request deletion of your
                personal information, subject to legal exceptions
              </li>
              <li>
                <strong className="text-zinc-300">Right to non-discrimination:</strong> We will not discriminate
                against you for exercising your CCPA rights
              </li>
              <li>
                <strong className="text-zinc-300">No sale of personal information:</strong> We do not sell
                personal information to third parties as defined by the CCPA. We do not share personal
                information for cross-context behavioral advertising
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">10. European Economic Area (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, the
              General Data Protection Regulation (GDPR) applies to our processing of your personal data.
            </p>
            <p className="mt-3">
              <strong className="text-zinc-300">Legal basis for processing:</strong> We process your data based on:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-zinc-400">
              <li><strong className="text-zinc-300">Contract performance:</strong> Processing necessary to provide the Service you subscribed to (account management, API access, billing)</li>
              <li><strong className="text-zinc-300">Legitimate interests:</strong> Security monitoring, fraud prevention, service improvement</li>
              <li><strong className="text-zinc-300">Legal obligation:</strong> Tax record retention, responding to lawful requests</li>
            </ul>
            <p className="mt-3">
              <strong className="text-zinc-300">International data transfers:</strong> Your data is processed
              and stored in the United States (AWS US-East-1). By using the Service, you consent to the
              transfer of your data to the United States. We rely on Standard Contractual Clauses and
              service-specific safeguards provided by our infrastructure providers to ensure adequate protection.
            </p>
            <p className="mt-3">
              You may lodge a complaint with your local data protection authority if you believe we have
              violated your rights under GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">11. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed to individuals under the age of 18. We do not knowingly collect
              personal information from children under 18. If we become aware that we have collected personal
              data from a child under 18, we will take steps to delete that information as soon as possible.
              If you believe we may have collected data from a child, please contact us at
              david@wisesportsai.com.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices,
              technology, legal requirements, or other factors. If we make material changes, we will notify
              you by email or through a prominent notice on the Service at least 15 days before the changes
              take effect. The &quot;Effective date&quot; at the top of this page indicates when this policy was
              last revised.
            </p>
            <p className="mt-3">
              Your continued use of the Service after the effective date of any revised Privacy Policy
              constitutes your acceptance of the changes. If you do not agree to the revised policy, you should
              stop using the Service and request account deletion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-mono font-semibold text-white mb-3">13. Contact</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-lg border border-white/[0.06] bg-[#111113]">
              <p className="text-zinc-300">Owls Insight LLC</p>
              <p className="text-zinc-300">Data Protection Inquiries</p>
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
