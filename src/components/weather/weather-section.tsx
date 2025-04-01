"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { WeatherCard } from "./weather-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import type { WeatherData } from "@/redux/features/weatherSlice"

export function WeatherSection() {
  const { data, loading, error } = useSelector((state: RootState) => state.weather)
  const favorites = useSelector((state: RootState) => state.preferences.favoriteCities)

  // Make sure data is fully typed and valid before rendering
  const validWeatherData = data?.filter((item): item is WeatherData => {
    return (
      typeof item.city === 'string' &&
      typeof item.temperature === 'number' &&
      typeof item.humidity === 'number' &&
      typeof item.conditions === 'string' &&
      typeof item.icon === 'string'
    );
  }) || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[125px] w-full rounded-md" />
            <Skeleton className="h-[125px] w-full rounded-md" />
            <Skeleton className="h-[125px] w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-destructive">
            <p>Error loading weather data</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favorites.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Favorites</h3>
              <div className="space-y-3">
                {validWeatherData
                  .filter((city) => favorites.includes(city.city))
                  .map((city) => (
                    <Link href={`/weather/${encodeURIComponent(city.city)}`} key={city.city}>
                      <WeatherCard weather={city} isFavorite={true} />
                    </Link>
                  ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {validWeatherData.map((city) => (
              <Link href={`/weather/${encodeURIComponent(city.city)}`} key={city.city}>
                <WeatherCard weather={city} isFavorite={favorites.includes(city.city)} />
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}