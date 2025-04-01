export async function fetchCryptoInfo(cryptoIds: string[]) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(",")}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
      )
  
      if (!response.ok) {
        throw new Error("Failed to fetch crypto data")
      }
  
      const data = await response.json()
  
      return data.map((crypto: any) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        price: crypto.current_price,
        change24h: crypto.price_change_percentage_24h,
        marketCap: crypto.market_cap,
        image: crypto.image,
      }))
    } catch (error) {
      console.error("Error fetching crypto data:", error)
  
      // Return mock data if API fails
      return [
        {
          id: "bitcoin",
          name: "Bitcoin",
          symbol: "BTC",
          price: 65000,
          change24h: 2.5,
          marketCap: 1250000000000,
          image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        },
        {
          id: "ethereum",
          name: "Ethereum",
          symbol: "ETH",
          price: 3500,
          change24h: 1.8,
          marketCap: 420000000000,
          image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        },
        {
          id: "solana",
          name: "Solana",
          symbol: "SOL",
          price: 140,
          change24h: 3.2,
          marketCap: 60000000000,
          image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
        },
      ]
    }
  }
  
  export async function fetchCryptoHistory(cryptoId: string) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=7&interval=daily`,
      )
  
      if (!response.ok) {
        throw new Error(`Failed to fetch history for ${cryptoId}`)
      }
  
      const data = await response.json()
  
      // Format the data for our chart
      return data.prices.map((item: [number, number]) => ({
        timestamp: new Date(item[0]).toISOString().split("T")[0],
        price: item[1],
      }))
    } catch (error) {
      console.error(`Error fetching history for ${cryptoId}:`, error)
  
      // Return mock data if API fails
      const today = new Date()
      const mockData = []
  
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
  
        let basePrice = 0
        if (cryptoId === "bitcoin") basePrice = 65000
        else if (cryptoId === "ethereum") basePrice = 3500
        else if (cryptoId === "solana") basePrice = 140
  
        mockData.push({
          timestamp: date.toISOString().split("T")[0],
          price: basePrice * (0.95 + Math.random() * 0.1),
        })
      }
  
      return mockData
    }
  }
  
  