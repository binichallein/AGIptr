import test from "node:test";
import assert from "node:assert/strict";

import { canFetchTimelineUrl, extractFollowableLinks } from "../scripts/lib/timeline-search/fetcher.mjs";

test("canFetchTimelineUrl only accepts allowlisted official domains", () => {
  const officialDomains = ["openai.com"];

  assert.equal(canFetchTimelineUrl("https://openai.com/index/gpt-5/", officialDomains), true);
  assert.equal(canFetchTimelineUrl("https://news.openai.com/index/gpt-5/", officialDomains), false);
  assert.equal(canFetchTimelineUrl("https://example.com/openai-gpt-5", officialDomains), false);
});

test("extractFollowableLinks keeps official links and respects hop limit metadata", () => {
  const links = extractFollowableLinks({
    html: `
      <a href="https://openai.com/index/gpt-5/">official</a>
      <a href="https://example.com/gpt-5/">secondary</a>
      <a href="/index/gpt-4-5/">relative</a>
    `,
    baseUrl: "https://openai.com/index/introducing-gpt-5/",
    officialDomains: ["openai.com"],
    currentDepth: 1,
    maxDepth: 2
  });

  assert.deepEqual(
    links.map((link) => link.url),
    ["https://openai.com/index/gpt-5/", "https://openai.com/index/gpt-4-5/"]
  );
  assert.ok(links.every((link) => link.depth === 2));
});
