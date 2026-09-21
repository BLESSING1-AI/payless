"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AnalysisResult } from "@/lib/types";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon: string }> = {
    verified: { label: "Verified", className: "bg-green-100 text-green-800 border-green-200", icon: "🟢" },
    reported: { label: "Reported", className: "bg-amber-100 text-amber-800 border-amber-200", icon: "🟡" },
    unverified: { label: "Unverified", className: "bg-slate-100 text-slate-700 border-slate-200", icon: "⚪" },
    expired: { label: "Expired", className: "bg-red-100 text-red-800 border-red-200", icon: "🔴" },
    unavailable: { label: "Unavailable", className: "bg-slate-100 text-slate-600 border-slate-200", icon: "—" },
  };
  const s = map[status] || map.unverified;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.className}`} title={s.label}>
      <span aria-hidden>{s.icon}</span>
      {s.label}
    </span>
  );
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = sessionStorage.getItem("payless_url");
    if (!url) {
      setError("No product link found. Please go back and paste a URL.");
      setLoading(false);
      return;
    }

    async function run() {
      try {
        const res = await fetch("/api/analyze-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok && !data.message) throw new Error("Request failed");
        setResult(data);
      } catch {
        setError("We couldn’t analyse this link right now. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-teal-700">
            <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center text-sm font-bold">P</span>
            PayLess
          </Link>
          <Link href="/" className="text-sm text-teal-700 font-medium hover:underline">New search</Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {loading && (
          <div className="text-center py-20" role="status" aria-live="polite">
            <div className="inline-block w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            <p className="mt-4 text-slate-600">Looking for savings…</p>
            <p className="mt-1 text-sm text-slate-400">This usually takes a few seconds</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-800 font-medium">{error}</p>
            <Link href="/" className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium">Try another link</Link>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                {result.product?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result.product.image} alt={result.product.title || "Product"} className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-xl bg-slate-50 border border-slate-100 shrink-0" />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm shrink-0">No image</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-500">{result.retailer.name}</p>
                  <h1 className="text-lg sm:text-xl font-semibold text-slate-900 mt-0.5 leading-snug">
                    {result.product?.title || "Product details limited"}
                  </h1>
                  {result.product?.price != null && (
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {result.currency === "ZAR" ? "R" : result.currency + " "}
                      {result.product.price.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </p>
                  )}
                  {result.product?.price == null && (
                    <p className="mt-2 text-slate-500 text-sm">Price not extracted — check the retailer page</p>
                  )}
                  <a href={result.product?.productUrl || "#"} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center text-sm font-medium text-teal-700 hover:underline">
                    Open original listing →
                  </a>
                </div>
              </div>
            </section>

            <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 text-sm text-teal-900">{result.message}</div>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Savings opportunities</h2>
              <ul className="space-y-3">
                {result.opportunities.map((opp, i) => (
                  <li key={i} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{opp.title}</h3>
                      <StatusBadge status={opp.status} />
                    </div>
                    <p className="mt-1.5 text-sm text-slate-600">{opp.description}</p>
                    {opp.actionUrl && (
                      <a href={opp.actionUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">
                        {opp.actionLabel} →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {result.searchLinks.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">Compare &amp; search</h2>
                <ul className="space-y-2">
                  {result.searchLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 hover:border-teal-300 hover:bg-teal-50/50 transition-colors">
                        <span>{link.label}</span>
                        <span className="text-teal-600" aria-hidden>↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {result.limitations.length > 0 && (
              <section className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-amber-900 mb-2">Important notes</h2>
                <ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
                  {result.limitations.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-amber-800">
                  Prices and availability can change. Confirm the final price at checkout. We never invent coupons or prices.
                </p>
              </section>
            )}

            <div className="text-center pt-4">
              <Link href="/" className="inline-flex h-12 px-6 items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold">
                Check another product
              </Link>
            </div>

            <p className="text-center text-xs text-slate-400 pb-8">
              Last checked {new Date(result.lastChecked).toLocaleString("en-ZA")}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
