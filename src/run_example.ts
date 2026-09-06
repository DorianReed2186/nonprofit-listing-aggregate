import { aggregateNonprofits } from "./nonprofit_aggregator.js";

const result = aggregateNonprofits({
  listings: [
    { source: "state-registry", name: "River Health Fund", ein: "12-3456789", cause: "community health", url: "https://example.org/river" },
    { source: "city-directory", name: "River Health Fund", ein: "12-3456789", cause: "community health", url: "https://example.org/river" },
    { source: "state-registry", name: "Food Bridge", ein: "98-7654321", cause: "food access", url: "https://example.org/food" }
  ],
  campaign: { name: "Spring care", targetCents: 100000 },
  donor: { email: "donor@example.org", amountCents: 25000 }
});

console.log(JSON.stringify(result, null, 2));
