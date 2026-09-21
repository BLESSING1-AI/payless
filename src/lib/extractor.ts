import * as cheerio from "cheerio";
import { detectRetailer, isSupportedUrl } from "./retailers";
import type { ProductInfo, AnalysisResult, SavingsOpportunity } from "./types";

const FETCH_TIMEOUT = 8000;
const USER_AGENT = "Mozilla/5.0 (compatible; PayLessBot/1.0; +https://payless.vercel.app)";

function parsePrice(text: string | undefined | null): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d.,]/g, "").replace(",", ".");
  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const n = parseFloat(match[1]);
  return isNaN(n) ? null : n;
}

async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html", "Accept-Language": "en-ZA,en;q=0.9" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("xhtml")) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractFromHtml(html: string, url: string, retailerName: string, currency: string): ProductInfo {
  const $ = cheerio.load(html);
  const ogTitle = $('meta[property="og:title"]').attr("content") || null;
  const ogImage = $('meta[property="og:image"]').attr("content") || null;
  const ogDesc = $('meta[property="og:description"]').attr("content") || null;
  const titleTag = $("title").first().text().trim() || null;
  let jsonLdPrice: number | null = null;
  let jsonLdTitle: string | null = null;
  let jsonLdImage: string | null = null;
  let jsonLdBrand: string | null = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item["@type"] === "Product" || String(item["@type"] || "").includes("Product")) {
          jsonLdTitle = item.name || jsonLdTitle;
          jsonLdBrand = item.brand?.name || item.brand || jsonLdBrand;
          if (item.image) jsonLdImage = Array.isArray(item.image) ? item.image[0] : item.image;
          const offers = item.offers || item.Offers;
          if (offers) {
            const offer = Array.isArray(offers) ? offers[0] : offers;
            if (offer?.price) jsonLdPrice = parsePrice(String(offer.price));
          }
        }
      }
    } catch { /* ignore */ }
  });
  const title = ogTitle || jsonLdTitle || titleTag;
  const image = ogImage || jsonLdImage;
  const price = jsonLdPrice;
  let method: ProductInfo["extractionMethod"] = "none";
  if (jsonLdTitle || jsonLdPrice) method = "jsonld";
  else if (ogTitle || ogImage) method = "opengraph";
  else if (titleTag) method = "meta";
  else method = "limited";
  return {
    title: title ? title.slice(0, 300) : null,
    brand: jsonLdBrand,
    image: image || null,
    price,
    currency,
    retailer: retailerName,
    retailerId: detectRetailer(url).id,
    productUrl: url,
    description: ogDesc ? ogDesc.slice(0, 500) : null,
    extractedAt: new Date().toISOString(),
    extractionMethod: method,
  };
}

const PUBLIC_PROMO_HINTS: Record<string, { title: string; discount: string; type: string; requirements: string }[]> = {
  takealot: [{ title: "Takealot free shipping threshold", discount: "Free shipping over typical order minimum", type: "free_shipping", requirements: "Threshold may change" }],
  shein: [{ title: "SHEIN first-order / app discounts", discount: "Often 10–30% for new users via app", type: "percentage", requirements: "Usually new customers" }],
  temu: [{ title: "Temu new-user promotions", discount: "Frequently offers first-order deals", type: "percentage", requirements: "New accounts" }],
  aliexpress: [{ title: "AliExpress coins & store coupons", discount: "Store coupons + coins often available", type: "other", requirements: "Login required" }],
};

function buildSearchLinks(product: ProductInfo | null, url: string) {
  const q = encodeURIComponent(product?.title || "product");
  return [
    { label: "Google Shopping (compare prices)", url: `https://www.google.com/search?tbm=shop&q=${q}&hl=en&gl=za` },
    { label: "Search on Takealot", url: `https://www.takealot.com/all?qsearch=${q}` },
    { label: "Search on SHEIN", url: `https://za.shein.com/pdsearch/${q}/` },
    { label: "Open original product page", url },
  ];
}

export async function analyzeUrl(rawUrl: string): Promise<AnalysisResult> {
  const limitations: string[] = [];
  const now = new Date().toISOString();
  if (!rawUrl || typeof rawUrl !== "string") {
    return { success: false, product: null, retailer: { id: "unknown", name: "Unknown", supported: false }, opportunities: [], estimatedOriginal: null, estimatedBest: null, potentialSaving: null, currency: "ZAR", message: "Please paste a valid product link.", limitations: ["No URL provided"], lastChecked: now, searchLinks: [] };
  }
  let url = rawUrl.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
  if (!isSupportedUrl(url)) {
    return { success: false, product: null, retailer: { id: "unknown", name: "Unknown", supported: false }, opportunities: [], estimatedOriginal: null, estimatedBest: null, potentialSaving: null, currency: "ZAR", message: "This URL is not allowed or is invalid. Only public http/https product pages are accepted.", limitations: ["URL validation failed"], lastChecked: now, searchLinks: [] };
  }
  const retailer = detectRetailer(url);
  const supported = retailer.id !== "unknown";
  if (!supported) limitations.push("Retailer not in current supported list. You can still compare using the search links.");
  let product: ProductInfo | null = null;
  const html = await fetchHtml(url);
  if (html) {
    product = extractFromHtml(html, url, retailer.name, retailer.currency);
    if (!product.title && !product.price) limitations.push("Could not extract full product details (many stores load prices with JavaScript).");
  } else {
    limitations.push("We could not retrieve the page content (site may block automated requests or be temporarily unavailable).");
    product = { title: null, brand: null, image: null, price: null, currency: retailer.currency, retailer: retailer.name, retailerId: retailer.id, productUrl: url, description: null, extractedAt: now, extractionMethod: "none" };
  }
  const opportunities: SavingsOpportunity[] = [];
  opportunities.push({ type: "cheaper_listing", title: "Compare prices across stores", description: "Use the search links below to check Google Shopping, Takealot, SHEIN and others. Shipping and import costs can change the final total.", estimatedSaving: null, currency: retailer.currency, status: "unverified", actionUrl: null, actionLabel: "See search links" });
  for (const h of PUBLIC_PROMO_HINTS[retailer.id] || []) {
    opportunities.push({ type: h.type === "free_shipping" ? "free_shipping" : "promo", title: h.title, description: `${h.discount}. ${h.requirements}. This has not been automatically verified – check at checkout.`, estimatedSaving: null, currency: retailer.currency, status: "unverified", actionUrl: url, actionLabel: "Check on retailer" });
  }
  if (["takealot", "shein", "temu"].includes(retailer.id)) {
    opportunities.push({ type: "free_shipping", title: "Check free-shipping threshold", description: "Many South African-facing stores offer free shipping above a minimum order value.", estimatedSaving: null, currency: "ZAR", status: "unverified", actionUrl: url, actionLabel: "View product" });
  }
  let message = product?.title
    ? `We found product information for “${product.title.slice(0, 80)}${product.title.length > 80 ? "…" : "”}.`
    : "We identified the retailer but could not fully extract product details.";
  message += " No guaranteed savings are shown because live coupon verification requires additional data sources. Use the comparison links and always confirm the final price at checkout.";
  if (!limitations.length) limitations.push("Prices and promotions change frequently. Always verify at the retailer’s checkout.");
  return {
    success: true,
    product,
    retailer: { id: retailer.id, name: retailer.name, supported },
    opportunities,
    estimatedOriginal: product?.price ?? null,
    estimatedBest: null,
    potentialSaving: null,
    currency: retailer.currency || "ZAR",
    message,
    limitations,
    lastChecked: now,
    searchLinks: buildSearchLinks(product, url),
  };
}
