"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please paste a product link.");
      return;
    }
    setLoading(true);
    try {
      sessionStorage.setItem("payless_url", trimmed);
      router.push("/results");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-teal-700 text-lg">
            <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-sm font-bold">P</span>
            PayLess
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/about" className="hover:text-teal-700">About</Link>
            <Link href="/privacy" className="hover:text-teal-700">Privacy</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-teal-50 to-slate-50 px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-teal-700 font-medium text-sm sm:text-base mb-3 tracking-wide">
              Free for shoppers · No subscription
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              They shouldn&apos;t pay more than they have to.
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Paste any supported shopping link and we&apos;ll look for legitimate ways to help you save—promo codes, cheaper listings, shipping savings and more.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 max-w-2xl mx-auto">
              <label htmlFor="product-url" className="sr-only">Product URL</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="product-url"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="Paste product link here (Amazon, Takealot, SHEIN, Temu…)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 h-14 px-5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold text-base shadow-sm transition-colors whitespace-nowrap"
                >
                  {loading ? "Looking…" : "Find My Savings"}
                </button>
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>
              )}
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Supported: Amazon · AliExpress · Alibaba · Takealot · SHEIN · Temu · eBay · Walmart
            </p>
          </div>
        </section>

        <section className="px-4 py-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">How it works</h2>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Paste a product link", desc: "Copy the URL from any supported store and paste it above." },
              { step: "2", title: "We search for savings", desc: "We identify the retailer and look for public promos and comparison options." },
              { step: "3", title: "Compare your options", desc: "See cheaper listings, shipping tips and promo hints with clear confidence labels." },
              { step: "4", title: "Buy from the retailer", desc: "We never charge you. You complete the purchase directly with the store." },
            ].map((item) => (
              <li key={item.step} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-sm">{item.step}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-slate-100 px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why we built this</h2>
            <p className="text-slate-700 leading-relaxed">
              Online prices can make ordinary things feel out of reach. We believe people shouldn&apos;t have to give up something they need simply because they didn&apos;t know about a discount, cheaper seller or free-shipping option.
            </p>
            <p className="mt-6 font-semibold text-teal-800 text-lg">
              They shouldn&apos;t pay more than they have to.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Prices and coupons can change. Estimated savings are not guarantees. Final checkout price is determined by the retailer.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} PayLess · Free for shoppers</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-teal-700">About</Link>
            <Link href="/privacy" className="hover:text-teal-700">Privacy</Link>
            <Link href="/terms" className="hover:text-teal-700">Terms</Link>
            <Link href="/affiliate" className="hover:text-teal-700">Affiliate disclosure</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
