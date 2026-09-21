import Link from "next/link";

export const metadata = { title: "Privacy Policy – PayLess" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-semibold text-teal-700">← PayLess</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>
        <div className="mt-8 space-y-4 text-slate-700">
          <p>PayLess is free to use. We do not require an account for basic product searches.</p>
          <p>When you paste a product URL we process that URL on our servers to identify the retailer and attempt to extract publicly available product information. We do not store your personal identity with every search.</p>
          <p>We may keep aggregate, anonymised statistics (number of searches, popular retailers, error rates) to improve the service.</p>
          <p>We do not sell your personal data. We do not use your payment details (we never take payments from shoppers).</p>
          <p>If you enable optional features such as price watches in the future, we will only collect the minimum information needed and you can delete it at any time.</p>
          <p>For questions: contact via the GitHub repository issues.</p>
        </div>
      </main>
    </div>
  );
}
