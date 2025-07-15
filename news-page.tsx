"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Clock,
  TrendingUp,
  Newspaper,
  Filter,
  Star,
  Globe,
  Building2,
  Zap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react"

interface NewsArticle {
  Date: string
  Ticker: string
  Title: string
  Link: string
}

interface NewsPageProps {
  initialStockFilter?: string
}

export default function NewsPage({ initialStockFilter }: NewsPageProps) {
  const [allNews, setAllNews] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [stockFilter, setStockFilter] = useState(initialStockFilter || "")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const newsPerPage = 15

  const categories = [
    { id: "all", label: "All News", icon: Newspaper },
    { id: "trending", label: "Trending", icon: Zap },
    { id: "market", label: "Market", icon: TrendingUp },
    { id: "company", label: "Company", icon: Building2 },
    { id: "earnings", label: "Earnings", icon: Star },
    { id: "analysis", label: "Analysis", icon: Globe },
  ]

  // Fetch news from API
  const fetchNews = async (page: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://archlinux.tail9023a4.ts.net/news?page=${page}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setAllNews(data)

      // Estimate total pages
      setTotalPages(Math.ceil(21700 / newsPerPage))
    } catch (err) {
      console.error("Error fetching news:", err)
      setError(err instanceof Error ? err.message : "Failed to load news")
    } finally {
      setLoading(false)
    }
  }

  // Filter news based on search, category, and stock filter
  const applyFilters = () => {
    let filtered = [...allNews]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.Ticker.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply stock filter
    if (stockFilter) {
      filtered = filtered.filter((article) => article.Ticker.toLowerCase() === stockFilter.toLowerCase())
    }

    // Apply category filter (mock implementation since API doesn't provide categories)
    if (activeCategory !== "all") {
      switch (activeCategory) {
        case "trending":
          // Show recent news (last 24 hours)
          filtered = filtered.filter((article) => {
            const articleDate = new Date(article.Date)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
            return articleDate > oneDayAgo
          })
          break
        case "earnings":
          // Filter for earnings-related keywords
          filtered = filtered.filter(
            (article) =>
              article.Title.toLowerCase().includes("earnings") ||
              article.Title.toLowerCase().includes("revenue") ||
              article.Title.toLowerCase().includes("profit") ||
              article.Title.toLowerCase().includes("q1") ||
              article.Title.toLowerCase().includes("q2") ||
              article.Title.toLowerCase().includes("q3") ||
              article.Title.toLowerCase().includes("q4"),
          )
          break
        case "market":
          // Filter for market-related keywords
          filtered = filtered.filter(
            (article) =>
              article.Title.toLowerCase().includes("market") ||
              article.Title.toLowerCase().includes("stocks") ||
              article.Title.toLowerCase().includes("trading") ||
              article.Title.toLowerCase().includes("index"),
          )
          break
        case "company":
          // Filter for company-specific news
          filtered = filtered.filter(
            (article) =>
              !article.Title.toLowerCase().includes("market") &&
              !article.Title.toLowerCase().includes("stocks") &&
              article.Ticker !== "SPY" &&
              article.Ticker !== "QQQ",
          )
          break
        case "analysis":
          // Filter for analysis keywords
          filtered = filtered.filter(
            (article) =>
              article.Title.toLowerCase().includes("analysis") ||
              article.Title.toLowerCase().includes("outlook") ||
              article.Title.toLowerCase().includes("forecast") ||
              article.Title.toLowerCase().includes("target") ||
              article.Title.toLowerCase().includes("rating"),
          )
          break
      }
    }

    setFilteredNews(filtered)
  }

  useEffect(() => {
    fetchNews(currentPage)
  }, [currentPage])

  useEffect(() => {
    if (initialStockFilter) {
      setStockFilter(initialStockFilter)
      setSearchTerm(initialStockFilter)
    }
  }, [initialStockFilter])

  useEffect(() => {
    applyFilters()
  }, [allNews, searchTerm, activeCategory, stockFilter])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const clearStockFilter = () => {
    setStockFilter("")
    setSearchTerm("")
    setActiveCategory("all")
  }

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "1 day ago"
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  // Get ticker color for gradient
  const getTickerColor = (ticker: string) => {
    const colors = [
      { primary: "#3b82f6", secondary: "#1d4ed8" }, // Blue
      { primary: "#10b981", secondary: "#059669" }, // Green
      { primary: "#f59e0b", secondary: "#d97706" }, // Yellow
      { primary: "#ef4444", secondary: "#dc2626" }, // Red
      { primary: "#8b5cf6", secondary: "#7c3aed" }, // Purple
      { primary: "#06b6d4", secondary: "#0891b2" }, // Cyan
      { primary: "#f97316", secondary: "#ea580c" }, // Orange
      { primary: "#84cc16", secondary: "#65a30d" }, // Lime
    ]

    const hash = ticker.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    return colors[Math.abs(hash) % colors.length]
  }

  // Get pagination range
  const getPaginationRange = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Latest Updates</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Market News</h1>
        </div>
        <Card className="h-64">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
              <p className="text-sm text-gray-500">Loading latest news...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Latest Updates</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Market News</h1>
        </div>
        <Card className="h-64">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
              <p className="text-sm text-red-600 mb-2">Error loading news</p>
              <p className="text-xs text-gray-500 mb-4">{error}</p>
              <Button onClick={() => fetchNews(currentPage)} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Latest Updates</p>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stockFilter ? `${stockFilter} News` : "Market News"}
            </h1>
            {stockFilter && (
              <Button variant="ghost" size="sm" onClick={clearStockFilter}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                All News
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredNews.length} articles
          </Badge>
          <Badge variant="outline" className="text-sm">
            Page {currentPage} of {totalPages}
          </Badge>
          {stockFilter && (
            <Badge variant="outline" className="text-sm">
              Filtered by {stockFilter}
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search news, stocks, or companies..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {category.label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* News Grid - Beautiful Cards with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredNews.map((article, index) => {
          const tickerColors = getTickerColor(article.Ticker)
          return (
            <div key={index} className="flex flex-col h-full">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transform transition duration-500 hover:scale-105 flex flex-col h-full">
                {/* Gradient Header */}
                <div
                  className="p-4 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${tickerColors.primary}, ${tickerColors.secondary})`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">{article.Ticker}</div>
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      <Clock className="w-3 h-3" />
                      <span>{getRelativeTime(article.Date)}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-black text-lg font-semibold mb-4 line-clamp-3 flex-grow">{article.Title}</div>

                  {/* Footer */}
                  <div className="mt-auto flex justify-between items-center">
                    <Button
                      size="sm"
                      className="bg-slate-500 hover:bg-slate-600 text-white rounded-full px-4 py-2 text-sm font-bold transition duration-300"
                      onClick={() => {
                        if (article.Link.startsWith("http")) {
                          window.open(article.Link, "_blank")
                        } else {
                          window.open(`https://archlinux.tail9023a4.ts.net${article.Link}`, "_blank")
                        }
                      }}
                    >
                      Learn More
                    </Button>
                    <div className="text-gray-600 text-sm text-right">{formatDate(article.Date)}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getPaginationRange().map((pageNumber, index) => (
          <div key={index}>
            {pageNumber === "..." ? (
              <span className="px-2 text-gray-500">...</span>
            ) : (
              <Button
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber as number)}
                className="min-w-[40px]"
              >
                {pageNumber}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* No Results */}
      {filteredNews.length === 0 && !loading && (
        <Card className="h-64">
          <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No news found</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your search terms or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setActiveCategory("all")
                setStockFilter("")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
