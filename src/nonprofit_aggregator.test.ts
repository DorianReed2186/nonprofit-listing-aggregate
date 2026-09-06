import assert from "node:assert/strict";
import { aggregateNonprofits } from "./nonprofit_aggregator.js";

const result = aggregateNonprofits({
  listings: [
    { source: "a", name: "Care", ein: "12-3456789", cause: "health", url: "https://example.org/a" },
    { source: "b", name: "Care", ein: "12-3456789", cause: "health", url: "https://example.org/a" }
  ],
  campaign: { name: "Care drive", targetCents: 10000 },
  donor: { email: "person@example.org", amountCents: 2500 }
});

assert.equal(result.listings.length, 1);
assert.equal(result.campaign.progress, 0.25);
assert.equal(result.receipt.status, "queued");
console.log("aggregate decision test passed");
