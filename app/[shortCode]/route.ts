import { NextRequest, NextResponse } from "next/server";
import { getOriginalUrl } from "@/services/url.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const url = await getOriginalUrl(shortCode, {
    referrer: req.headers.get("referer") ?? undefined,
    userAgent: req.headers.get("user-agent") ?? undefined,
  });

  if (!url) {
    return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
  }

  return NextResponse.redirect(url.originalUrl);
}