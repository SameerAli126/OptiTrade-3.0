// File: buy-sell-page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Heart,
  HeartOff,
  ArrowLeft,
  DollarSign,
  Activity,
  BarChart3,
  Volume2,
} from "lucide-react"
import type { StockData } from "./dashboard"
import StockNewsWidget from "./components/stock-news-widget"
import StockChart from "./components/stock-chart"

interface BuySellPageProps {
  selectedStock: StockData | null
  onAddToWatchlist: (stock: StockData) => void
  onRemoveFromWatchlist: (symbol: string) => void
  isInWatchlist: (symbol: string) => boolean
  cash: number
  onUpdateCash: (newCash: number) => void
  onNavigateToNews: (stockSymbol?: string) => void
}

export default function BuySellPage({
  selectedStock,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist,
  cash,
  onUpdateCash,
  onNavigateToNews,
}: BuySellPageProps) {
  const [orderType, setOrderType] = useState("market")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")

  if (!selectedStock) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Trading</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Buy & Sell</h1>
        </div>

        <Card className="h-64 sm:h-96">
          <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
            <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No stock selected</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">Select a stock from the screener to start trading</p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Go to Screener</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  const handleWatchlistToggle = () => {
    if (isInWatchlist(selectedStock.symbol)) {
      onRemoveFromWatchlist(selectedStock.symbol)
    } else {
      onAddToWatchlist(selectedStock)
    }
  }

  const calculateTotal = () => {
    const qty = Number.parseFloat(quantity) || 0
    const stockPrice = orderType === "limit" ? Number.parseFloat(price) || 0 : selectedStock.price
    return qty * stockPrice
  }

  const handleBuyOrder = () => {
    const total = calculateTotal()
    if (total > cash) {
      alert(`Insufficient funds. You need $${total.toFixed(2)} but only have $${cash.toFixed(2)}`)
      return
    }

    if (!quantity || Number.parseFloat(quantity) <= 0) {
      alert("Please enter a valid quantity")
      return
    }

    // Execute buy order
    onUpdateCash(cash - total)
    alert(`Successfully bought ${quantity} shares of ${selectedStock.symbol} for $${total.toFixed(2)}`)
    setQuantity("")
    setPrice("")
  }

  const handleSellOrder = () => {
    const total = calculateTotal()

    if (!quantity || Number.parseFloat(quantity) <= 0) {
      alert("Please enter a valid quantity")
      return
    }

    // Execute sell order (add cash)
    onUpdateCash(cash + total)
    alert(`Successfully sold ${quantity} shares of ${selectedStock.symbol} for $${total.toFixed(2)}`)
    setQuantity("")
    setPrice("")
  }

  const handleViewAllNews = (stockSymbol: string) => {
    onNavigateToNews(stockSymbol)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm mb-1">Trading</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {selectedStock.symbol} - {selectedStock.name}
            </h1>
          </div>
        </div>
        <Button
          variant={isInWatchlist(selectedStock.symbol) ? "default" : "outline"}
          onClick={handleWatchlistToggle}
          className="w-full sm:w-auto"
        >
          {isInWatchlist(selectedStock.symbol) ? (
            <>
              <Heart className="w-4 h-4 mr-2 fill-current" />
              In Watchlist
            </>
          ) : (
            <>
              <HeartOff className="w-4 h-4 mr-2" />
              Add to Watchlist
            </>
          )}
        </Button>
      </div>

      {/* Stock Info Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <span className="text-xs sm:text-sm text-gray-600">Current Price</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">${selectedStock.price.toFixed(2)}</div>
            <div
              className={`flex items-center gap-1 text-sm ${
                selectedStock.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {selectedStock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>
                {selectedStock.change >= 0 ? "+" : ""}${selectedStock.change.toFixed(2)}(
                {selectedStock.changePercent >= 0 ? "+" : ""}
                {selectedStock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-xs sm:text-sm text-gray-600">Day High</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">${selectedStock.high.toFixed(2)}</div>
            <div className="text-xs sm:text-sm text-gray-500">Low: ${selectedStock.low.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-purple-500" />
              <span className="text-xs sm:text-sm text-gray-600">Volume</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold">{formatVolume(selectedStock.volume)}</div>
            <div className="text-xs sm:text-sm text-gray-500">Open: ${selectedStock.open.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              <span className="text-xs sm:text-sm text-gray-600">Market Cap</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold">{formatNumber(selectedStock.marketCap)}</div>
            <Badge variant="secondary" className="text-xs mt-1">
              {selectedStock.sector}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Trading Section */}
      {/* Chart Section - Full Width */}
      <div className="w-full">
        <StockChart stock={{ symbol: selectedStock.symbol, name: selectedStock.name }} />
      </div>

      {/* Trading Panel - Full Width Below Chart */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Trading Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Trade {selectedStock.symbol}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" className="text-green-600">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="text-red-600">
                      Sell
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="order-type" className="text-sm">
                          Order Type
                        </Label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market Order</SelectItem>
                            <SelectItem value="limit">Limit Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="quantity" className="text-sm">
                          Quantity
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="Enter shares"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="text-sm"
                        />
                      </div>

                      {orderType === "limit" && (
                        <div>
                          <Label htmlFor="price" className="text-sm">
                            Limit Price
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      )}

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Estimated Total:</span>
                          <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>Available Cash:</span>
                          <span className="font-semibold">${cash.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Commission:</span>
                          <span>$0.00</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleBuyOrder}
                        disabled={calculateTotal() > cash || !quantity}
                      >
                        Buy {selectedStock.symbol}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="sell-order-type" className="text-sm">
                          Order Type
                        </Label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">Market Order</SelectItem>
                            <SelectItem value="limit">Limit Order</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="sell-quantity" className="text-sm">
                          Quantity
                        </Label>
                        <Input
                          id="sell-quantity"
                          type="number"
                          placeholder="Enter shares"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="text-sm"
                        />
                      </div>

                      {orderType === "limit" && (
                        <div>
                          <Label htmlFor="sell-price" className="text-sm">
                            Limit Price
                          </Label>
                          <Input
                            id="sell-price"
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      )}

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Estimated Total:</span>
                          <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>Available Cash:</span>
                          <span className="font-semibold">${cash.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Commission:</span>
                          <span>$0.00</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleSellOrder}
                        disabled={!quantity}
                      >
                        Sell {selectedStock.symbol}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Set Price Alert
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm bg-transparent"
                  onClick={() => handleViewAllNews(selectedStock.symbol)}
                >
                  View Company News
                </Button>
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Technical Analysis
                </Button>
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Options Chain
                </Button>
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Analyst Ratings
                </Button>
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Financial Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Impact */}
          <div className="lg:col-span-1 xl:col-span-1">
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Portfolio Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Current Holdings:</span>
                    <span className="font-semibold">0 shares</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Average Cost:</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Portfolio Weight:</span>
                    <span className="font-semibold">0.00%</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Sector Allocation:</span>
                    <span className="font-semibold">{selectedStock.sector}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Risk Level:</span>
                    <span className="font-semibold text-yellow-600">Medium</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* News Section - Full Width Below Chart and Trading */}
      <div className="w-full">
        <StockNewsWidget
          stockSymbol={selectedStock.symbol}
          stockName={selectedStock.name}
          onViewAllNews={handleViewAllNews}
        />
      </div>
    </div>
  )
}
