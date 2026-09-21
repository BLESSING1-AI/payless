import Link from "next/link";

export const metadata = { title: "Affiliate Disclosure – PayLess" };

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-semibold text-teal-700">← PayLess</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Affiliate Disclosure</h1>
        <div className="mt-8 space-y-4 text-slate-700">
          <p>PayLess is free for shoppers. We never add fees to your purchase.</p>
          <p>Where legitimate affiliate programmes are available, some links on this site may be affiliate links. If you click such a link and make a purchase, we may earn a commission from the retailer at no extra cost to you.</p>
          <p>Our ranking and recommendations prioritise estimated total cost and transparency for the user, not commission size.</p>
          <p>We do not claim official partnership with any retailer unless an actual agreement exists.</p>
        </div>
      </main>
    </div>
  );
}
