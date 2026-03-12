import test from "node:test";
import assert from "node:assert/strict";

import { searchWithTavily } from "../scripts/lib/timeline-search/tavily-client.mjs";

test("searchWithTavily retries a timeout once before succeeding", async () => {
  let attempts = 0;

  const results = await searchWithTavily({
    apiKey: "test-key",
    query: "site:openai.com GPT announcement",
    includeDomains: ["openai.com"],
    maxResults: 2,
    fetchImpl: async () => {
      attempts += 1;
      if (attempts === 1) {
        const error = new TypeError("fetch failed");
        error.cause = { code: "UND_ERR_CONNECT_TIMEOUT" };
        throw error;
      }
      return {
        ok: true,
        async json() {
          return {
            results: [{ url: "https://openai.com/index/gpt-5/" }]
          };
        }
      };
    }
  });

  assert.equal(attempts, 2);
  assert.deepEqual(results, [{ url: "https://openai.com/index/gpt-5/" }]);
});
