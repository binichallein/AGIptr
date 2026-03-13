const TAVILY_SEARCH_ENDPOINT = "https://api.tavily.com/search";
const TAVILY_EXTRACT_ENDPOINT = "https://api.tavily.com/extract";

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function postToTavily({ endpoint, payload, fetchImpl = fetch, maxRetries = 1 }) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = new Error(`Tavily request failed with status ${response.status}`);
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      const timeout = error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT";
      const retryableStatus = [429, 432].includes(error?.status);
      if ((!timeout && !retryableStatus) || attempt === maxRetries) {
        throw error;
      }
      await wait(retryableStatus ? 1000 * (attempt + 1) : 300 * (attempt + 1));
    }
  }

  throw lastError;
}

export async function searchWithTavily({
  apiKey,
  query,
  includeDomains = [],
  excludeDomains = [],
  maxResults = 3,
  fetchImpl = fetch,
  maxRetries = 1
}) {
  const payload = await postToTavily({
    endpoint: TAVILY_SEARCH_ENDPOINT,
    payload: {
      api_key: apiKey,
      query,
      search_depth: "advanced",
      max_results: maxResults,
      include_domains: includeDomains,
      exclude_domains: excludeDomains,
      include_raw_content: true
    },
    fetchImpl,
    maxRetries
  });

  return payload.results || [];
}

export async function extractWithTavily({
  apiKey,
  urls = [],
  query = "",
  fetchImpl = fetch,
  maxRetries = 1
}) {
  const payload = await postToTavily({
    endpoint: TAVILY_EXTRACT_ENDPOINT,
    payload: {
      api_key: apiKey,
      urls,
      query,
      extract_depth: "advanced",
      format: "text",
      chunks_per_source: query ? 3 : undefined,
      timeout: 60
    },
    fetchImpl,
    maxRetries
  });

  return payload.results || [];
}
