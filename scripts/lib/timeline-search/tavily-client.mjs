const TAVILY_ENDPOINT = "https://api.tavily.com/search";

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function searchWithTavily({
  apiKey,
  query,
  includeDomains = [],
  maxResults = 3,
  fetchImpl = fetch,
  maxRetries = 1
}) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetchImpl(TAVILY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: "advanced",
          max_results: maxResults,
          include_domains: includeDomains,
          include_raw_content: true
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily search failed with status ${response.status}`);
      }

      const payload = await response.json();
      return payload.results || [];
    } catch (error) {
      lastError = error;
      const timeout = error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT";
      if (!timeout || attempt === maxRetries) {
        throw error;
      }
      await wait(300 * (attempt + 1));
    }
  }

  throw lastError;
}
