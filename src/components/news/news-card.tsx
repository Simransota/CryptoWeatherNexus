import { ExternalLink } from "lucide-react"
import type { NewsItem } from "@/redux/features/newsSlice"

interface NewsCardProps {
  news: NewsItem
}

export function NewsCard({ news }: NewsCardProps) {
  // Format the date
  const formattedDate = new Date(news.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-medium line-clamp-2">{news.title}</h3>
          {news.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{news.description}</p>}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{news.source}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      </div>
    </a>
  )
}

