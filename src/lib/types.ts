export type VerificationStatus = "verified" | "reported" | "unverified" | "expired" | "unavailable";

export interface ProductInfo {
  title: string | null;
  brand: string | null;
  image: string | null;
  price: number | null;
  currency: string;
  retailer: string;
  retailerId: string;
  productUrl: string;
  description: string | null;
  extractedAt: string;
  extractionMethod: "opengraph" | "jsonld" | "meta" | "limited" | "none";
}

export interface CouponInfo {
  code: string | null;
  title: string;
  discount: string;
  type: "percentage" | "fixed" | "free_shipping" | "other";
  source: string;
  status: VerificationStatus;
  requirements: string | null;
  expiresAt: string | null;
  lastChecked: string;
}

export interface SavingsOpportunity {
  type: "coupon" | "cheaper_listing" | "free_shipping" | "promo" | "alternative";
  title: string;
  description: string;
  estimatedSaving: number | null;
  currency: string;
  status: VerificationStatus;
  actionUrl: string | null;
  actionLabel: string;
  code?: string | null;
}

export interface AnalysisResult {
  success: boolean;
  product: ProductInfo | null;
  retailer: {
    id: string;
    name: string;
    supported: boolean;
  };
  opportunities: SavingsOpportunity[];
  estimatedOriginal: number | null;
  estimatedBest: number | null;
  potentialSaving: number | null;
  currency: string;
  message: string;
  limitations: string[];
  lastChecked: string;
  searchLinks: { label: string; url: string }[];
}
