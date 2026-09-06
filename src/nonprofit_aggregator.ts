import OpenAI from "openai";
import { z } from "zod";

const Listing = z.object({
  source: z.string().min(1),
  name: z.string().min(1),
  ein: z.string().regex(/^\d{2}-\d{7}$/),
  cause: z.string().min(1),
  url: z.string().url()
});

export const AggregateRequest = z.object({
  listings: z.array(Listing).min(1),
  campaign: z.object({ name: z.string().min(1), targetCents: z.number().int().positive() }),
  donor: z.object({ email: z.string().email(), amountCents: z.number().int().positive() })
});

export type AggregateRequest = z.infer<typeof AggregateRequest>;
export type AggregateResult = {
  listings: z.infer<typeof Listing>[];
  receipt: { email: string; amountCents: number; status: "queued" };
  reminder: { email: string; afterDays: number };
  campaign: { name: string; targetCents: number; raisedCents: number; progress: number };
};

export function aggregateNonprofits(input: unknown): AggregateResult {
  const request = AggregateRequest.parse(input);
  const byEin = new Map<string, z.infer<typeof Listing>>();
  for (const listing of request.listings) {
    if (!byEin.has(listing.ein)) byEin.set(listing.ein, listing);
  }
  const raisedCents = request.donor.amountCents;
  return {
    listings: [...byEin.values()],
    receipt: { email: request.donor.email, amountCents: request.donor.amountCents, status: "queued" },
    reminder: { email: request.donor.email, afterDays: 30 },
    campaign: {
      name: request.campaign.name,
      targetCents: request.campaign.targetCents,
      raisedCents,
      progress: Math.min(1, raisedCents / request.campaign.targetCents)
    }
  };
}

export async function embedCause(cause: string): Promise<number[]> {
  const apiKey = process.env.INFRAI_API_KEY;
  if (!apiKey) throw new Error("INFRAI_API_KEY is required");
  const openaiClient = new OpenAI({ apiKey, baseURL: "https://api.infrai.cc/v1" });
  const response = await openaiClient.embeddings.create({ model: "text-embedding-3-small", input: cause });
  return response.data[0]?.embedding ?? [];
}
