# PayLess

**They shouldn’t pay more than they have to.**

Free shopping savings helper for ordinary people—especially families and shoppers on limited budgets in South Africa and beyond.

## What it does (MVP)

1. Paste a product URL from a supported retailer (Takealot, Amazon, SHEIN, Temu, AliExpress, eBay, Walmart, Alibaba).
2. The system detects the retailer and attempts to extract publicly available product information (Open Graph / JSON-LD / meta).
3. Shows transparent savings opportunities: comparison search links, public promo *hints* (clearly labelled **Unverified**), free-shipping reminders.
4. Never invents coupons, prices or savings. Always directs the user to confirm at the retailer’s checkout.
5. Free for shoppers. Mobile-first, installable as a PWA.

## Technology

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- Server-side product extraction with Cheerio + SSRF protection + rate limiting
- Retailer adapter architecture (easy to add more stores)
- Vercel-ready deployment

## Supported retailers (detection)

Takealot · Amazon · AliExpress · Alibaba · SHEIN · Temu · eBay · Walmart

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Push to GitHub and connect to Vercel, or:

```bash
npx vercel
```

## Known limitations (honest)

- Many retailers load prices with client-side JavaScript; server-side extraction often returns title/image only.
- No live coupon verification API in this MVP—promo hints are marked **Unverified**.
- No guaranteed cross-store price matching yet.
- Affiliate links are prepared for but not fully wired without approved partner accounts.
- Budget mode, price watches, admin dashboard and notifications are planned next phases.

## Product principle

Optimise for **savings for the user**, not maximum affiliate commission.

## License

MIT – free to use and improve.
