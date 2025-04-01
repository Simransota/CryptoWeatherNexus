export async function fetchCryptoNews() {
    try {
      // Replace with your actual NewsData.io API key
      const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY 
      const response = await fetch(`https://newsdata.io/api/1/news?apikey=${API_KEY}&q=cryptocurrency&language=en&size=5`)
  
      if (!response.ok) {
        throw new Error("Failed to fetch news data")
      }
  
      const data = await response.json()
  
      return data.results.map((item: any) => ({
        id: item.article_id,
        title: item.title,
        description: item.description,
        url: item.link,
        source: item.source_id,
        publishedAt: item.pubDate,
      }))
    } catch (error) {
      console.error("Error fetching news data:", error)
  
      // Return mock data if API fails
      return [
        {
          id: "1",
          title: "Bitcoin Surges Past $65,000 as Institutional Adoption Grows",
          description:
            "Bitcoin has reached new heights as major financial institutions continue to invest in the cryptocurrency.",
          url: "#",
          source: "CryptoNews",
          publishedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Ethereum 2.0 Upgrade: What You Need to Know",
          description: "The long-awaited Ethereum upgrade promises improved scalability and reduced energy consumption.",
          url: "#",
          source: "BlockchainToday",
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "3",
          title: "Regulatory Challenges Facing Cryptocurrency Markets",
          description:
            "Governments worldwide are developing new frameworks to regulate digital assets and protect investors.",
          url: "#",
          source: "FinancialTimes",
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: "4",
          title: "NFT Market Shows Signs of Recovery After Slump",
          description:
            "After months of declining sales, the NFT market is showing renewed activity with several high-profile auctions.",
          url: "#",
          source: "ArtTech",
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: "5",
          title: "DeFi Protocols Face Security Challenges as TVL Grows",
          description:
            "As more value is locked in DeFi protocols, security concerns and audit requirements become increasingly important.",
          url: "#",
          source: "CryptoInsider",
          publishedAt: new Date(Date.now() - 345600000).toISOString(),
        },
      ]
    }
  }
  
  