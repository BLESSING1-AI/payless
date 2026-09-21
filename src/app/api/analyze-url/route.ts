import { NextRequest, NextResponse } from "next/server";
import { analyzeUrl } from "@/lib/extractor";
import { z } from "zod";

const bodySchema = z.object({
  url: z.string().min(5).max(2048),
});

const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 20;
const WINDOW_MS = 60_000;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid product URL." },
        { status: 400 }
      );
    }

    const result = await analyzeUrl(parsed.data.url);
    return NextResponse.json(result);
  } catch (err) {
    console.error("analyze-url error", err);
    return NextResponse.json(
      {
        success: false,
        message: "We couldn’t analyse this link right now. Please try again in a moment.",
        limitations: ["Temporary server error"],
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "PayLess analyze-url",
    method: "POST",
    body: { url: "https://..." },
  });
}
