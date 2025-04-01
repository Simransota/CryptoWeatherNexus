"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ArrowLeft, ExternalLink } from 'lucide-react'
import type { RootState } from "@/redux/store"
import { fetchCryptoHistory } from "@/lib/api/crypto"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Cell 
} from "recharts"

type PriceHistoryItem = {
  timestamp: string
  price: number
}

type CryptoDetailProps = {
  cryptoId: string
}

export function CryptoDetail({ cryptoId }: CryptoDetailProps) {
  const cryptoData = useSelector((state: RootState) => state.crypto.data.find((item: { id: string }) => item.id === cryptoId))

  const [history, setHistory] = useState<PriceHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true)
        const data = await fetchCryptoHistory(cryptoId)
        setHistory(data)
      } catch (error) {
        console.error("Failed to load crypto history:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [cryptoId])

  if (!cryptoData) {
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
          <h1 className="text-2xl font-bold mb-2">Cryptocurrency not found</h1>
          <p className="text-muted-foreground">We couldn't find data for {cryptoId}</p>
        </div>
      </div>
    )
  }

  const isPositiveChange = cryptoData.change24h >= 0

  // Format data for charts
  const chartData = history.map((item, index) => ({
    date: new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price: item.price,
    // Calculate daily change for bar chart
    change: index > 0
      ? ((item.price - history[index - 1].price) / history[index - 1].price) * 100
      : 0
  }))

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
            <div className="flex items-center gap-3">
              {cryptoData.image ? (
                <img
                  src={cryptoData.image || "/placeholder.svg"}
                  alt={cryptoData.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {cryptoData.symbol.charAt(0)}
                </div>
              )}
              <div>
                <CardTitle className="text-2xl">
                  {cryptoData.name} ({cryptoData.symbol})
                </CardTitle>
                <CardDescription>
                  <a
                    href={`https://www.coingecko.com/en/coins/${cryptoData.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    View on CoinGecko <ExternalLink className="h-3 w-3" />
                  </a>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${cryptoData.price.toLocaleString()}</div>
              <div className={`flex items-center justify-end ${isPositiveChange ? "text-green-500" : "text-red-500"}`}>
                {isPositiveChange ? "+" : ""}
                {cryptoData.change24h.toFixed(2)}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Market Cap</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">${cryptoData.marketCap.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Volume (24h)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">${(cryptoData.marketCap * 0.05).toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Circulating Supply</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {Math.round(cryptoData.marketCap / cryptoData.price).toLocaleString()} {cryptoData.symbol}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Price History (7 Days)</CardTitle>
            <CardDescription>Historical price data for {cryptoData.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Area Chart */}
              <div className="h-[300px]">
                <CardTitle className="text-sm mb-4">Price Trend</CardTitle>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="date"
                      stroke="gray"
                      tick={{ fill: "gray" }}
                    />
                    <YAxis
                      stroke="gray"
                      tick={{ fill: "gray" }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="gray" />

                    <Tooltip
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: 'gray',
                        borderRadius: '0.5rem',
                        color: 'white'
                      }}
                      labelStyle={{ color: 'white' }}
                    />

                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Change Bar Chart */}
              <div className="h-[300px]">
                <CardTitle className="text-sm mb-4">Daily Price Change (%)</CardTitle>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.slice(1)} // Skip first day as it has no change
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    {/* Axis Styling */}
                    <XAxis
                      dataKey="date"
                      stroke="gray"
                      tick={{ fill: "gray" }}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value.toFixed(1)}%`}
                      stroke="gray"
                      tick={{ fill: "gray" }}
                    />

                    {/* Grid Lines */}
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="gray" />

                    {/* Tooltip Styling */}
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']}
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: 'gray',
                        borderRadius: '0.5rem',
                        color: 'white',
                      }}
                      labelStyle={{ color: 'white' }}
                    />

                    {/* Bar Colors */}
                    <Bar dataKey="change">
                      {chartData.slice(1).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.change >= 0 ? '#10b981' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 