"use client"

import type React from "react"

import { useDispatch } from "react-redux"
import { Star } from "lucide-react"
import { toggleFavoriteCrypto } from "@/redux/features/preferencesSlice"
import type { CryptoData } from "@/redux/features/cryptoSlice"
import { Button } from "@/components/ui/button"

interface CryptoCardProps {
  crypto: CryptoData
  isFavorite: boolean
}

export function CryptoCard({ crypto, isFavorite }: CryptoCardProps) {
  const dispatch = useDispatch()

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleFavoriteCrypto(crypto.id))
  }

  const isPositiveChange = crypto.change24h >= 0

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {crypto.image ? (
            <img
              src={crypto.image || "/placeholder.svg"}
              alt={crypto.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {crypto.symbol.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium">{crypto.name}</h3>
          <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-lg font-semibold">${crypto.price.toLocaleString()}</p>
          <p className={`text-xs ${isPositiveChange ? "text-green-500" : "text-red-500"}`}>
            {isPositiveChange ? "+" : ""}
            {crypto.change24h.toFixed(2)}%
          </p>
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

