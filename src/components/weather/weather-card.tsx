"use client"

import type React from "react"

import { useDispatch } from "react-redux"
import { Star } from "lucide-react"
import { toggleFavoriteCity } from "@/redux/features/preferencesSlice"
import type { WeatherData } from "@/redux/features/weatherSlice"
import { Button } from "@/components/ui/button"

interface WeatherCardProps {
  weather: WeatherData
  isFavorite: boolean
}

export function WeatherCard({ weather, isFavorite }: WeatherCardProps) {
  const dispatch = useDispatch()

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleFavoriteCity(weather.city))
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.conditions}
            width={50}
            height={50}
          />
        </div>
        <div>
          <h3 className="font-medium">{weather.city}</h3>
          <p className="text-sm text-muted-foreground">{weather.conditions}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-lg font-semibold">{Math.round(weather.temperature)}°C</p>
          <p className="text-xs text-muted-foreground">Humidity: {weather.humidity}%</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          className={isFavorite ? "text-yellow-500" : "text-muted-foreground"}
        >
          <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
        </Button>
      </div>
    </div>
  )
}

