// File: watchlist-page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bookmark, TrendingUp, TrendingDown, Trash2, Eye } from "lucide-react"
import type { StockData } from "./dashboard"

interface WatchlistPageProps {
  watchlist: StockData[]
  onStockSelect: (stock: StockData) => void
  onRemoveFromWatchlist: (symbol: string) => void
}

export default function WatchlistPage({ watchlist, onStockSelect, onRemoveFromWatchlist }: WatchlistPageProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
    return volume.toLocaleString()
  }

  if (watchlist.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Portfolio</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Watchlist</h1>
        </div>

        <Card className="h-64 sm:h-96">
          <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
            <Bookmark className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Your watchlist is empty</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Start adding stocks from the screener to track your favorite investments
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Go to Screener</Button>
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
          <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Portfolio</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Watchlist</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {watchlist.length} {watchlist.length === 1 ? "Stock" : "Stocks"}
          </Badge>
        </div>
      </div>

      {/* Watchlist Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Tracked Stocks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 sm:w-16"></TableHead>
                  <TableHead className="min-w-[80px]">Symbol</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Company</TableHead>
                  <TableHead className="text-right min-w-[80px]">Price</TableHead>
                  <TableHead className="text-right min-w-[100px]">Change</TableHead>
                  <TableHead className="text-right min-w-[70px] hidden md:table-cell">High</TableHead>
                  <TableHead className="text-right min-w-[70px] hidden md:table-cell">Low</TableHead>
                  <TableHead className="text-right min-w-[100px]">Market Cap</TableHead>
                  <TableHead className="min-w-[100px] hidden xl:table-cell">Sector</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlist.map((stock) => (
                  <TableRow key={stock.symbol} className="hover:bg-gray-50">
                    <TableCell className="p-2 sm:p-4">
                      <img
                        src={stock.logo || "/placeholder.svg"}
                        alt={`${stock.name} logo`}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100"
                      />
                    </TableCell>
                    <TableCell className="font-bold text-blue-600 text-xs sm:text-sm p-2 sm:p-4">
                      {stock.symbol}
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm hidden sm:table-cell p-2 sm:p-4">
                      <div className="max-w-[150px] truncate">{stock.name}</div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-xs sm:text-sm p-2 sm:p-4">
                      ${stock.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right p-2 sm:p-4">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          stock.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <div className="text-xs sm:text-sm">
                          <div className="font-semibold">
                            {stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}
                          </div>
                          <div className="text-xs">
                            ({stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-semibold text-xs sm:text-sm hidden md:table-cell p-2 sm:p-4">
                      ${stock.high.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-semibold text-xs sm:text-sm hidden md:table-cell p-2 sm:p-4">
                      ${stock.low.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs sm:text-sm p-2 sm:p-4">
                      {formatNumber(stock.marketCap)}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell p-2 sm:p-4">
                      <Badge variant="secondary" className="text-xs">
                        {stock.sector}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onStockSelect(stock)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => onRemoveFromWatchlist(stock.symbol)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {watchlist.filter((s) => s.change > 0).length}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Gainers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {watchlist.filter((s) => s.change < 0).length}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Losers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {formatNumber(watchlist.reduce((sum, stock) => sum + stock.marketCap, 0))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Total Market Cap</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              ${watchlist.reduce((sum, stock) => sum + stock.price, 0).toFixed(2)}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Total Value</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
