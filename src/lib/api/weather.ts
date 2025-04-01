const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=0&lon=0&dt=${Math.floor(
        Date.now() / 1000
      )}&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch weather history for ${city}`);
    }

    const data = await response.json();
    return data.hourly.map((entry: { dt: number; temp: any; humidity: any; weather: { main: any; }[]; }) => ({
      date: new Date(entry.dt * 1000).toISOString().split("T")[0],
      temperature: entry.temp,
      humidity: entry.humidity,
      conditions: entry.weather[0].main,
    }));
  } catch (error) {
    console.error(`Error fetching weather history for ${city}:`, error);
    throw error;
  }
}
