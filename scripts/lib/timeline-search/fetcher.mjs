function parseHostname(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

export function canFetchTimelineUrl(url, officialDomains) {
  const hostname = parseHostname(url);
  return officialDomains.includes(hostname);
}

export function extractFollowableLinks({ html, baseUrl, officialDomains, currentDepth, maxDepth }) {
  if (currentDepth >= maxDepth) return [];
  const pattern = /href\s*=\s*"([^"]+)"/gi;
  const links = [];
  const seen = new Set();
  let match;

  while ((match = pattern.exec(String(html || "")))) {
    const href = match[1];
    let resolved;
    try {
      resolved = new URL(href, baseUrl).toString();
    } catch {
      continue;
    }
    if (!canFetchTimelineUrl(resolved, officialDomains) || seen.has(resolved)) {
      continue;
    }
    seen.add(resolved);
    links.push({
      url: resolved,
      depth: currentDepth + 1
    });
  }

  return links;
}
