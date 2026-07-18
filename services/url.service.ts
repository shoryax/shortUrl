import { prisma } from "@/lib/prisma";
import { generateShortCode } from "@/lib/nanoid";

const MAX_RETRIES = 5;

export async function createShortUrl(originalUrl: string) {
  let shortCode = generateShortCode();
  let attempts = 0;

  // Handle the (rare) case of a collision on the unique short code
  while (attempts < MAX_RETRIES) {
    const existing = await prisma.url.findUnique({ where: { shortCode } });
    if (!existing) break;
    shortCode = generateShortCode();
    attempts++;
  }

  if (attempts === MAX_RETRIES) {
    throw new Error("Failed to generate a unique short code, please try again");
  }

  const url = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
    },
  });

  return url;
}

// services/url.service.ts

export async function getOriginalUrl(
  shortCode: string,
  meta?: { referrer?: string; userAgent?: string }
) {
  const url = await prisma.url.findUnique({ where: { shortCode } });

  if (!url) return null;

  // Log the click, but don't block the redirect if logging fails
  await prisma.click.create({
    data: {
      urlId: url.id,
      referrer: meta?.referrer,
      userAgent: meta?.userAgent,
    },
  });

  return url;
}