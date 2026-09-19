export type RetailerId =
  | "takealot"
  | "amazon"
  | "aliexpress"
  | "alibaba"
  | "shein"
  | "temu"
  | "ebay"
  | "walmart"
  | "unknown";

export interface RetailerInfo {
  id: RetailerId;
  name: string;
  domains: string[];
  currency: string;
  country: string;
  affiliateSupported: boolean;
}

export const RETAILERS: RetailerInfo[] = [
  {
    id: "takealot",
    name: "Takealot",
    domains: ["takealot.com", "www.takealot.com"],
    currency: "ZAR",
    country: "ZA",
    affiliateSupported: true,
  },
  {
    id: "amazon",
    name: "Amazon",
    domains: ["amazon.com", "amazon.co.uk", "amazon.de", "amazon.co.za", "www.amazon.com", "www.amazon.co.uk"],
    currency: "USD",
    country: "US",
    affiliateSupported: true,
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    domains: ["aliexpress.com", "www.aliexpress.com", "m.aliexpress.com"],
    currency: "USD",
    country: "CN",
    affiliateSupported: true,
  },
  {
    id: "alibaba",
    name: "Alibaba",
    domains: ["alibaba.com", "www.alibaba.com"],
    currency: "USD",
    country: "CN",
    affiliateSupported: false,
  },
  {
    id: "shein",
    name: "SHEIN",
    domains: ["shein.com", "www.shein.com", "za.shein.com", "m.shein.com"],
    currency: "ZAR",
    country: "ZA",
    affiliateSupported: true,
  },
  {
    id: "temu",
    name: "Temu",
    domains: ["temu.com", "www.temu.com"],
    currency: "ZAR",
    country: "ZA",
    affiliateSupported: true,
  },
  {
    id: "ebay",
    name: "eBay",
    domains: ["ebay.com", "www.ebay.com", "ebay.co.uk"],
    currency: "USD",
    country: "US",
    affiliateSupported: true,
  },
  {
    id: "walmart",
    name: "Walmart",
    domains: ["walmart.com", "www.walmart.com"],
    currency: "USD",
    country: "US",
    affiliateSupported: true,
  },
];

export function detectRetailer(url: string): RetailerInfo {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    for (const r of RETAILERS) {
      if (r.domains.some((d) => hostname === d || hostname.endsWith("." + d))) {
        return r;
      }
    }
  } catch {
    // invalid URL
  }
  return {
    id: "unknown",
    name: "Unknown retailer",
    domains: [],
    currency: "ZAR",
    country: "ZA",
    affiliateSupported: false,
  };
}

export function isSupportedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.startsWith("172.") ||
      host === "metadata.google.internal" ||
      host.endsWith(".local") ||
      host === "0.0.0.0"
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
