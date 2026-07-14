import { z } from "zod";

export const shortenUrlSchema = z.object({
  url: z.string().url({ message: "Please provide a valid URL" }),
});

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;