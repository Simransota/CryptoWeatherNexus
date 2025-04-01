const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export async function fetchWeatherForCities(cities: any[]) {
  if (!WEATHER_API_KEY) {
    throw new Error("Missing API key. Please set WEATHER_API_KEY in environment variables.");
  }

  const weatherPromises = cities.map(async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch weather for ${city}`);
      }

      const data = await response.json();
      return {
        city: city,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        conditions: data.weather[0].main,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      throw error;
    }
  });

  const weatherResults = await Promise.allSettled(weatherPromises);
  return weatherResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
}

export async function fetchCityWeatherHistory(city: string) {
  if (!WEATHER_API_KEY) {
    throw new Error("Missing API key. Please set WEATHER_API_KEY in environment variables.");
  }

  try {
    // First, get the coordinates for the city
    const geocodeResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WEATHER_API_KEY}`
    );

    if (!geocodeResponse.ok) {
      throw new Error(`Failed to fetch coordinates for ${city}`);
    }

    const geocodeData = await geocodeResponse.json();
    if (!geocodeData.length) {
      throw new Error(`City ${city} not found`);
    }

    const { lat, lon } = geocodeData[0];

    // Then fetch the 5-day forecast
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch weather forecast for ${city}`);
    }

    const data = await response.json();
    
    // Group forecasts by day and get the first forecast of each day
    const dailyForecasts = data.list.reduce((acc: any[], forecast: any) => {
      const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
      
      // Only add the first forecast of each day
      if (!acc.find(item => item.date === date)) {
        acc.push({
          date,
          temperature: forecast.main.temp,
          humidity: forecast.main.humidity,
          conditions: forecast.weather[0].main,
        });
      }
      return acc;
    }, []);

    return dailyForecasts;
  } catch (error) {
    console.error(`Error fetching weather history for ${city}:`, error);
    throw error;
  }
}