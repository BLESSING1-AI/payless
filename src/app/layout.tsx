import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayLess – They shouldn’t pay more than they have to",
  description:
    "Paste any supported shopping link and we’ll look for legitimate ways to help you save—promo codes, cheaper listings, shipping savings and more. Free for shoppers.",
  applicationName: "PayLess",
  keywords: ["price comparison", "coupons", "South Africa", "Takealot", "SHEIN", "Temu", "savings", "budget shopping"],
  authors: [{ name: "PayLess" }],
  openGraph: {
    title: "PayLess – Find it. Compare it. Pay less.",
    description: "Free tool that helps ordinary people find legitimate ways to reduce the cost of products they want to buy online.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PayLess – They shouldn’t pay more than they have to",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PayLess",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
