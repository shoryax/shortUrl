import { NextRequest, NextResponse } from "next/server";
import { shortenUrlSchema } from "@/lib/validators";
import { createShortUrl } from "@/services/url.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = shortenUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const url = await createShortUrl(parsed.data.url);

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${url.shortCode}`;

    return NextResponse.json(
      {
        shortCode: url.shortCode,
        shortUrl,
        originalUrl: url.originalUrl,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating short URL:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}