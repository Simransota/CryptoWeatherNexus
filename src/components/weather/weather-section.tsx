"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { WeatherCard } from "./weather-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import type { WeatherData } from "@/redux/features/weatherSlice"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

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

  const favoriteCities = validWeatherData.filter((city) => favorites.includes(city.city))
  const nonFavoriteCities = validWeatherData.filter((city) => !favorites.includes(city.city))

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
        <div className="space-y-6">
          {favorites.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-yellow-500">
                <Star className="h-4 w-4" fill="currentColor" />
                Favorites List
              </h3>
              <div className="space-y-3">
                {favoriteCities.map((city) => (
                  <Link href={`/weather/${encodeURIComponent(city.city)}`} key={city.city}>
                    <WeatherCard weather={city} isFavorite={true} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-muted-foreground">
              All Cities
            </h3>
            <div className="space-y-3">
              {nonFavoriteCities.map((city) => (
                <Link href={`/weather/${encodeURIComponent(city.city)}`} key={city.city}>
                  <WeatherCard weather={city} isFavorite={false} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}