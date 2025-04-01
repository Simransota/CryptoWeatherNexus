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
      className="group block p-4 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{news.title}</h3>
          {news.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 group-hover:text-muted-foreground/80 transition-colors">
              {news.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{news.source}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </a>
  )
}

