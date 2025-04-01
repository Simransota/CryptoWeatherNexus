"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { WeatherSection } from "./weather/weather-section"
import { CryptoSection } from "./crypto/crypto-section"
import { NewsSection } from "./news/news-section"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import { fetchNewsData } from "@/redux/features/newsSlice"
import type { AppDispatch } from "@/redux/store"
import { ThemeToggle } from "./theme-toggle"
import { setupWebSocket } from "@/lib/websocket"

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchWeatherData())
    dispatch(fetchCryptoData())
    dispatch(fetchNewsData())

    // Set up periodic refresh (every 60 seconds)
    const intervalId = setInterval(() => {
      dispatch(fetchWeatherData())
      dispatch(fetchCryptoData())
      dispatch(fetchNewsData())
    }, 60000)

    // Set up WebSocket connection
    setupWebSocket()

    // Clean up on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch])

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">CryptoWeather Nexus</h1>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WeatherSection />
        <CryptoSection />
        <NewsSection />
      </div>
    </div>
  )
}

