"use client"

import { useEffect, useState, use } from "react"
import { useSelector } from "react-redux"
import { ArrowLeft } from "lucide-react"
import type { RootState } from "@/redux/store"
import { fetchCityWeatherHistory } from "@/lib/api/weather"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

type WeatherHistoryItem = {
  date: string
  temperature: number
  humidity: number
  conditions: string
}

export default function CityWeatherPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = use(params)
  const city = decodeURIComponent(resolvedParams.city)
  const weatherData = useSelector((state: RootState) => state.weather.data.find((item: { city: string }) => item.city === city))

  const [history, setHistory] = useState<WeatherHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true)
        const data = await fetchCityWeatherHistory(city)
        setHistory(data)
      } catch (error) {
        console.error("Failed to load weather history:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [city])

  if (!weatherData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">City not found</h1>
          <p className="text-muted-foreground">We couldn't find weather data for {city}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{city}</CardTitle>
              <CardDescription>Current weather conditions</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt={weatherData.conditions}
                width={80}
                height={80}
              />
              <div className="text-right">
                <div className="text-4xl font-bold">{Math.round(weatherData.temperature)}°C</div>
                <div className="text-muted-foreground">{weatherData.conditions}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Humidity</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{weatherData.humidity}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Feels Like</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{Math.round(weatherData.temperature - 1)}°C</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Wind</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">12 km/h</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Pressure</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">1015 hPa</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
            <CardDescription>Historical and predicted weather for {city}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-4">
                {history.map((day) => (
                  <Card key={day.date} className="overflow-hidden">
                    <CardHeader className="p-3 bg-muted/50">
                      <CardTitle className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 text-center">
                      <div className="mb-2">
                        <img
                          src={`https://openweathermap.org/img/wn/${
                            day.conditions === "Sunny"
                              ? "01d"
                              : day.conditions === "Cloudy"
                                ? "03d"
                                : day.conditions === "Rainy"
                                  ? "10d"
                                  : day.conditions === "Partly Cloudy"
                                    ? "02d"
                                    : "01d"
                          }@2x.png`}
                          alt={day.conditions}
                          width={50}
                          height={50}
                          className="mx-auto"
                        />
                      </div>
                      <div className="text-lg font-semibold">{day.temperature}°C</div>
                      <div className="text-xs text-muted-foreground">{day.conditions}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

