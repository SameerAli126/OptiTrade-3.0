"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown, ArrowRight, Bell } from "lucide-react"

interface NewsArticle {
  id: string
  headline: string
  summary: string
  category: "breaking" | "market" | "company" | "analysis" | "earnings"
  timestamp: string
  source: string
  sourceUrl: string
  sentiment: "positive" | "negative" | "neutral"
}

interface StockNewsWidgetProps {
  stockSymbol: string
  stockName: string
  onViewAllNews: (symbol: string) => void
}

// Mock function to get stock-specific news
const getStockNews = (symbol: string): NewsArticle[] => {
  const allNews: Record<string, NewsArticle[]> = {
    AAPL: [
      {
        id: "aapl-1",
        headline: "Apple Announces New AI Features Coming to iPhone 16 Series",
        summary:
          "Apple unveils groundbreaking AI capabilities that could revolutionize smartphone technology and boost market share in the competitive AI space.",
        category: "company",
        timestamp: "4 hours ago",
        source: "TechCrunch",
        sourceUrl: "https://techcrunch.com/apple-ai-iphone-16-announcement",
        sentiment: "positive",
      },
      {
        id: "aapl-2",
        headline: "Apple Services Revenue Hits Record High in Q4 2024",
        summary:
          "Apple's services division continues strong growth with App Store and iCloud driving significant revenue increases.",
        category: "earnings",
        timestamp: "1 day ago",
        source: "Reuters",
        sourceUrl: "https://reuters.com/apple-services-revenue-record",
        sentiment: "positive",
      },
    ],
    MSFT: [
      {
        id: "msft-1",
        headline: "Microsoft Azure Revenue Grows 30% YoY, Cloud Dominance Continues",
        summary:
          "Microsoft's cloud computing division shows robust growth as enterprises accelerate digital transformation and AI integration initiatives.",
        category: "earnings",
        timestamp: "8 hours ago",
        source: "Reuters",
        sourceUrl: "https://reuters.com/microsoft-azure-revenue-growth-q4",
        sentiment: "positive",
      },
    ],
    GOOGL: [
      {
        id: "googl-1",
        headline: "Google Bard AI Integration Boosts Search Revenue by 12%",
        summary:
          "Alphabet reports strong quarterly results driven by AI-enhanced search capabilities and improved ad targeting.",
        category: "earnings",
        timestamp: "6 hours ago",
        source: "CNBC",
        sourceUrl: "https://cnbc.com/google-bard-search-revenue-boost",
        sentiment: "positive",
      },
    ],
    NVDA: [
      {
        id: "nvda-1",
        headline: "NVIDIA Reports Record Q4 Earnings, Beats Expectations by 15%",
        summary:
          "NVIDIA Corporation exceeded analyst expectations with record-breaking quarterly earnings driven by strong AI chip demand and data center growth.",
        category: "earnings",
        timestamp: "2 hours ago",
        source: "MarketWatch",
        sourceUrl: "https://marketwatch.com/nvidia-earnings-q4-2024",
        sentiment: "positive",
      },
    ],
    TSLA: [
      {
        id: "tsla-1",
        headline: "Tesla Stock Drops 5% on Production Concerns and Delivery Delays",
        summary:
          "Tesla shares decline following reports of production bottlenecks at Gigafactory and potential delays in Model 3 deliveries for Q1.",
        category: "company",
        timestamp: "10 hours ago",
        source: "Bloomberg",
        sourceUrl: "https://bloomberg.com/tesla-production-concerns-stock-drop",
        sentiment: "negative",
      },
    ],
    META: [
      {
        id: "meta-1",
        headline: "Meta Platforms Invests $10B in VR/AR Technology Development",
        summary:
          "Meta announces massive investment in virtual and augmented reality technologies, signaling commitment to metaverse vision despite market skepticism.",
        category: "company",
        timestamp: "12 hours ago",
        source: "The Verge",
        sourceUrl: "https://theverge.com/meta-10-billion-vr-ar-investment",
        sentiment: "neutral",
      },
    ],
    AMZN: [
      {
        id: "amzn-1",
        headline: "Amazon Web Services Launches New AI-Powered Analytics Platform",
        summary:
          "AWS introduces advanced machine learning tools for enterprise customers, strengthening its position in the competitive cloud services market.",
        category: "company",
        timestamp: "14 hours ago",
        source: "TechCrunch",
        sourceUrl: "https://techcrunch.com/aws-ai-analytics-platform-launch",
        sentiment: "positive",
      },
    ],
  }

  return allNews[symbol] || []
}

export default function StockNewsWidget({ stockSymbol, stockName, onViewAllNews }: StockNewsWidgetProps) {
  const stockNews = getStockNews(stockSymbol)
  const latestNews = stockNews[0] // Get the most recent news

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Newspaper className="w-4 h-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "border-l-green-500 bg-green-50"
      case "negative":
        return "border-l-red-500 bg-red-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breaking":
        return "bg-red-100 text-red-800"
      case "earnings":
        return "bg-green-100 text-green-800"
      case "company":
        return "bg-purple-100 text-purple-800"
      case "analysis":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!latestNews) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Newspaper className="w-5 h-5" />
            {stockSymbol} News & Market Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-3">No recent news available for {stockSymbol}</p>
              <Button variant="outline" size="sm" onClick={() => onViewAllNews(stockSymbol)}>
                Browse All News
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-l-4 ${getSentimentColor(latestNews.sentiment)}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Latest {stockSymbol} News & Market Impact
          </div>
          {getSentimentIcon(latestNews.sentiment)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Horizontal Layout for News */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main News Article - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start gap-4">
              {/* News Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(latestNews.category)}>{latestNews.category.toUpperCase()}</Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{latestNews.timestamp}</span>
                    <span>•</span>
                    <span>{latestNews.source}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-base leading-tight">{latestNews.headline}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{latestNews.summary}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(latestNews.sourceUrl, "_blank")}
                    className="text-sm"
                  >
                    Read Full Article
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onViewAllNews(stockSymbol)} className="text-sm">
                    View All {stockSymbol} News
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>

              {/* News Image Placeholder */}
              <div className="hidden md:block w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          {/* News Impact & Summary - Takes up 1 column */}
          <div className="space-y-4">
            {/* News Impact */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Market Impact</span>
                <div className="flex items-center gap-1">
                  {getSentimentIcon(latestNews.sentiment)}
                  <span className="text-sm font-medium capitalize text-gray-700">{latestNews.sentiment}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Sentiment Score</span>
                  <span
                    className={`font-semibold ${
                      latestNews.sentiment === "positive"
                        ? "text-green-600"
                        : latestNews.sentiment === "negative"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {latestNews.sentiment === "positive"
                      ? "+7.2"
                      : latestNews.sentiment === "negative"
                        ? "-4.1"
                        : "0.0"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">News Volume</span>
                  <span className="font-semibold text-gray-700">{stockNews.length} articles</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-700 capitalize">{latestNews.category}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-gray-700">Quick Actions</h5>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs justify-start bg-transparent">
                  <Bell className="w-3 h-3 mr-2" />
                  Set News Alert
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start bg-transparent">
                  <TrendingUp className="w-3 h-3 mr-2" />
                  Price Impact Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional News Headlines - Horizontal scroll */}
        {stockNews.length > 1 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">More {stockSymbol} Headlines</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stockNews.slice(1, 4).map((article, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.category.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">{article.timestamp}</span>
                  </div>
                  <h6 className="text-xs font-medium leading-tight line-clamp-2">{article.headline}</h6>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(article.sourceUrl, "_blank")}
                    className="text-xs h-6 p-0 text-blue-600 hover:text-blue-800"
                  >
                    Read more →
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
