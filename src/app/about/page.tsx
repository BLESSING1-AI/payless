import Link from "next/link";

export const metadata = {
  title: "About – PayLess",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-semibold text-teal-700">
            ← PayLess
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
        <h1 className="text-3xl font-bold text-slate-900">About PayLess</h1>
        <p className="text-lg text-slate-600 mt-4">
          PayLess is a free tool built around one simple idea: ordinary people shouldn’t have to pay more than they have to.
        </p>
        <p className="mt-4 text-slate-700">
          We help shoppers—especially families and people on limited budgets—find legitimate ways to reduce the cost of products they want to buy online: public promo codes, cheaper listings, free-shipping options and clear comparison links.
        </p>
        <p className="mt-4 text-slate-700">
          We never invent coupons, prices or savings. When something cannot be verified, we say so. The platform is free for shoppers; where legitimate affiliate programmes exist we may earn a commission if you buy through certain links, at no extra cost to you.
        </p>
        <p className="mt-4 text-slate-700">
          Primary focus: South African shoppers (ZAR), with support for Takealot, SHEIN, Temu, AliExpress, Amazon and more.
        </p>
        <p className="mt-8">
          <Link href="/" className="text-teal-700 font-medium">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
