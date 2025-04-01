export async function fetchCryptoNews() {
    try {
      // Replace with your actual NewsData.io API key
      const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY 
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency&language=en&size=5`,
        { 
          signal: controller.signal,
          // Add cache control to prevent stale data
          cache: 'no-cache',
          // Add headers to indicate we want fresh data
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
  
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch news data: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Invalid news data format received");
      }
  
      return data.results.map((item: any) => {
        // Sanitize URL
        let url = item.link;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `https://${url}`;
        }
        
        return {
          id: item.article_id,
          title: item.title,
          description: item.description,
          url: url,
          source: item.source_id,
          publishedAt: item.pubDate,
        };
      });
    } catch (error) {
      console.error("Error fetching news data:", error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error("Request is taking too long. Please check your connection and try again.");
        }
      }
      
      // Throw the error instead of returning mock data
      throw new Error("Failed to fetch news data. Please try again later.");
    }
  }
  
  