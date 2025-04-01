// Define types for the API response
interface NewsApiResponse {
    status: string;
    totalResults: number;
    results: NewsApiItem[];
  }
  
  interface NewsApiItem {
    article_id: string;
    title: string;
    description: string;
    link: string;
    source_id: string;
    pubDate: string;
  }
  
  export interface NewsItem {
    id: string;
    title: string;
    description: string;
    url: string;
    source: string;
    publishedAt: string;
  }
  
  // Cache storage
  let cachedNews: NewsItem[] | null = null;
  let lastFetchTime: number | null = null;
  const CACHE_DURATION = 10 * 60 * 1000; // Cache for 10 minutes
  
  // Track API usage
  let creditsUsed = 0;
  const MAX_CREDITS = 200;
  
  // Helper function to delay execution
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Helper function to check if error is rate limit
  const isRateLimitError = (error: any): boolean => {
    return error?.message?.includes('429') || error?.message?.includes('TOO MANY REQUESTS');
  };
  
  export async function fetchCryptoNews(retries = 3): Promise<NewsItem[]> {
    const now = Date.now();
  
    // Serve cached data if still fresh
    if (cachedNews && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
      console.log("Serving cached news data...");
      return cachedNews;
    }
  
    // Prevent API calls if credits are exhausted
    if (creditsUsed >= MAX_CREDITS) {
      console.warn("API credits exhausted. Returning cached data...");
      if (cachedNews) return cachedNews;
      throw new Error("API credits exhausted. Try again later.");
    }
  
    try {
      const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (!API_KEY) {
        throw new Error("News API key is not configured");
      }
  
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
      console.log("Fetching fresh crypto news...");
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency&language=en&size=20`, // Fetch 20 articles per request
        { 
          signal: controller.signal,
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
  
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        const errorMessage = `Failed to fetch news data: ${response.status} ${response.statusText}`;
  
        if (response.status === 429 && retries > 0) {
          const backoffDelay = Math.pow(2, 3 - retries) * 1000;
          console.log(`Rate limit hit. Retrying in ${backoffDelay / 1000} seconds...`);
          await delay(backoffDelay);
          return fetchCryptoNews(retries - 1);
        }
  
        throw new Error(errorMessage);
      }
  
      const data: NewsApiResponse = await response.json();
  
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Invalid news data format received");
      }
  
      // Track API credits used (Assuming 1 request = 1 credit)
      creditsUsed++;
  
      // Transform API response
      cachedNews = data.results.map((item: NewsApiItem) => ({
        id: item.article_id,
        title: item.title,
        description: item.description,
        url: item.link.startsWith("http") ? item.link : `https://${item.link}`,
        source: item.source_id,
        publishedAt: item.pubDate,
      }));
  
      lastFetchTime = Date.now();
      return cachedNews;
    } catch (error) {
      console.error("Error fetching news data:", error);
  
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error("Request is taking too long. Please check your connection and try again.");
        }
  
        if (isRateLimitError(error) && retries > 0) {
          const backoffDelay = Math.pow(2, 3 - retries) * 1000;
          console.log(`Rate limit detected. Retrying in ${backoffDelay / 1000} seconds...`);
          await delay(backoffDelay);
          return fetchCryptoNews(retries - 1);
        }
      }
  
      throw new Error("Failed to fetch news data. Please try again later.");
    }
  }
  