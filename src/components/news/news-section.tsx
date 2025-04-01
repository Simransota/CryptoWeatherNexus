"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { NewsCard } from "./news-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Define the NewsItem interface to match what NewsCard expects
interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

export function NewsSection() {
  const { data, loading, error } = useSelector((state: RootState) => state.news)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crypto News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[100px] w-full rounded-md" />
            <Skeleton className="h-[100px] w-full rounded-md" />
            <Skeleton className="h-[100px] w-full rounded-md" />
            <Skeleton className="h-[100px] w-full rounded-md" />
            <Skeleton className="h-[100px] w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crypto News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-destructive">
            <p>Error loading news data</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 5).map((news: NewsItem) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}