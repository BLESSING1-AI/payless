import Link from "next/link";

export const metadata = { title: "Terms of Service – PayLess" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-semibold text-teal-700">← PayLess</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>
        <div className="mt-8 space-y-4 text-slate-700">
          <p>PayLess is provided free of charge, “as is”, without warranties of any kind.</p>
          <p>Prices, coupons, shipping costs and availability change frequently. Information shown is not a guarantee. Always confirm the final price and terms at the retailer’s checkout.</p>
          <p>We are not affiliated with Amazon, Takealot, SHEIN, Temu, AliExpress or other retailers unless explicitly stated.</p>
          <p>You agree not to abuse the service (excessive automated requests, attempts to bypass rate limits, or use for illegal purposes).</p>
          <p>We may update these terms; continued use constitutes acceptance.</p>
        </div>
      </main>
    </div>
  );
}
