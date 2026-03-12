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

export async function fetchTimelineDocument({
  url,
  officialDomains,
  fetchImpl = fetch,
  timeoutMs = 8000
}) {
  if (!canFetchTimelineUrl(url, officialDomains)) {
    return "";
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (!response.ok) {
      return "";
    }
    return await response.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}
