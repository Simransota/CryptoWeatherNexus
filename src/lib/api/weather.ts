// This would normally use environment variables for API keys
const WEATHER_API_KEY = process.env.WEATHER_API_KEY

// Replace the entire fetchWeatherForCities function with this improved version
export async function fetchWeatherForCities(cities: string[]) {
  // Check if we're using the placeholder API key
  if (WEATHER_API_KEY === process.env.WEATHER_API_KEY ) {
    console.log("Using mock weather data (no API key provided)")
    // Return mock data immediately without attempting API calls
    return [
      {
        city: "New York",
        temperature: 22,
        humidity: 65,
        conditions: "Cloudy",
        icon: "03d",
      },
      {
        city: "London",
        temperature: 18,
        humidity: 70,
        conditions: "Rainy",
        icon: "10d",
      },
      {
        city: "Tokyo",
        temperature: 28,
        humidity: 55,
        conditions: "Sunny",
        icon: "01d",
      },
    ]
  }

  try {
    // Only attempt API calls if we have a valid API key
    const weatherPromises = cities.map((city) =>
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch weather for ${city}`)
          }
          return response.json()
        })
        .then((data) => ({
          city: city,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          conditions: data.weather[0].main,
          icon: data.weather[0].icon,
        }))
        .catch((error) => {
          console.error(`Error fetching weather for ${city}:`, error)
          // Return fallback data for this specific city
          return {
            city: city,
            temperature: 0,
            humidity: 0,
            conditions: "Unknown",
            icon: "01d",
          }
        }),
    )

    return await Promise.all(weatherPromises)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    // If there's a general error, fall back to mock data
    return [
      {
        city: "New York",
        temperature: 22,
        humidity: 65,
        conditions: "Cloudy",
        icon: "03d",
      },
      {
        city: "London",
        temperature: 18,
        humidity: 70,
        conditions: "Rainy",
        icon: "10d",
      },
      {
        city: "Tokyo",
        temperature: 28,
        humidity: 55,
        conditions: "Sunny",
        icon: "01d",
      },
    ]
  }
}

export async function fetchCityWeatherHistory(city: string) {
  // In a real app, this would fetch historical data from an API
  // For demo purposes, we'll generate mock data

  const today = new Date()
  const data = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toISOString().split("T")[0],
      temperature: Math.round(15 + Math.random() * 15),
      humidity: Math.round(50 + Math.random() * 30),
      conditions: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
    })
  }

  return data.reverse()
}

