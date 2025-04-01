"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { CryptoCard } from "./crypto-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

// Define the CryptoData type to match what CryptoCard expects
interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  image?: string;
}

export function CryptoSection() {
  const { data, loading, error } = useSelector((state: RootState) => state.crypto)
  const favorites = useSelector((state: RootState) => state.preferences.favoriteCryptos)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cryptocurrency</CardTitle>
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
          <CardTitle>Cryptocurrency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-destructive">
            <p>Error loading cryptocurrency data</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const favoriteCryptos = data.filter((crypto: CryptoData) => favorites.includes(crypto.id))
  const nonFavoriteCryptos = data.filter((crypto: CryptoData) => !favorites.includes(crypto.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency</CardTitle>
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
                {favoriteCryptos.map((crypto: CryptoData) => (
                  <Link href={`/crypto/${crypto.id}`} key={crypto.id}>
                    <CryptoCard crypto={crypto} isFavorite={true} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-muted-foreground">
              All Cryptocurrencies
            </h3>
            <div className="space-y-3">
              {nonFavoriteCryptos.map((crypto: CryptoData) => (
                <Link href={`/crypto/${crypto.id}`} key={crypto.id}>
                  <CryptoCard crypto={crypto} isFavorite={false} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}