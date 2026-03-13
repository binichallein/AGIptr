import test from "node:test";
import assert from "node:assert/strict";

import { extractWithTavily, searchWithTavily } from "../scripts/lib/timeline-search/tavily-client.mjs";

test("searchWithTavily retries a timeout once before succeeding", async () => {
  let attempts = 0;

  const results = await searchWithTavily({
    apiKey: "test-key",
    query: "site:openai.com GPT announcement",
    includeDomains: ["openai.com"],
    excludeDomains: ["community.openai.com"],
    maxResults: 2,
    fetchImpl: async (_url, request) => {
      attempts += 1;
      if (attempts === 1) {
        const error = new TypeError("fetch failed");
        error.cause = { code: "UND_ERR_CONNECT_TIMEOUT" };
        throw error;
      }
      const payload = JSON.parse(request.body);
      assert.deepEqual(payload.exclude_domains, ["community.openai.com"]);
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

test("extractWithTavily returns extracted results for exact URLs", async () => {
  const results = await extractWithTavily({
    apiKey: "test-key",
    urls: ["https://openai.com/index/gpt-4-1/"],
    query: "GPT-4.1 release date",
    fetchImpl: async (_url, request) => {
      const payload = JSON.parse(request.body);
      assert.equal(payload.extract_depth, "advanced");
      assert.equal(payload.urls[0], "https://openai.com/index/gpt-4-1/");
      assert.equal(payload.query, "GPT-4.1 release date");
      return {
        ok: true,
        async json() {
          return {
            results: [
              {
                url: "https://openai.com/index/gpt-4-1/",
                raw_content: "April 14, 2025\nIntroducing GPT-4.1 in the API"
              }
            ]
          };
        }
      };
    }
  });

  assert.deepEqual(results, [
    {
      url: "https://openai.com/index/gpt-4-1/",
      raw_content: "April 14, 2025\nIntroducing GPT-4.1 in the API"
    }
  ]);
});

test("searchWithTavily retries a 432 response before succeeding", async () => {
  let attempts = 0;

  const results = await searchWithTavily({
    apiKey: "test-key",
    query: 'site:openai.com "GPT-4.1"',
    includeDomains: ["openai.com"],
    fetchImpl: async () => {
      attempts += 1;
      if (attempts === 1) {
        return {
          ok: false,
          status: 432
        };
      }
      return {
        ok: true,
        async json() {
          return {
            results: [{ url: "https://openai.com/index/gpt-4-1/" }]
          };
        }
      };
    }
  });

  assert.equal(attempts, 2);
  assert.deepEqual(results, [{ url: "https://openai.com/index/gpt-4-1/" }]);
});
