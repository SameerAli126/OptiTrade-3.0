"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, TrendingUp, TrendingDown, ArrowUpDown, Filter, RefreshCw } from "lucide-react"
import type { StockData } from "@/types/stock"

const mockStocks: StockData[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    logo: "/placeholder.svg?height=32&width=32",
    price: 193.58,
    open: 192.3,
    high: 194.76,
    low: 191.23,
    volume: 45234567,
    marketCap: 3020000000000,
    change: 2.45,
    changePercent: 1.28,
    sector: "Technology",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    logo: "/placeholder.svg?height=32&width=32",
    price: 378.85,
    open: 376.2,
    high: 380.45,
    low: 375.1,
    volume: 23456789,
    marketCap: 2810000000000,
    change: 4.22,
    changePercent: 1.13,
    sector: "Technology",
  },
  // ... rest of mock data
]

interface ScreenerPageProps {
  onStockSelect: (stock: StockData) => void
}

export default function ScreenerPage({ onStockSelect }: ScreenerPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof StockData>("marketCap")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [sectorFilter, setSectorFilter] = useState<string>("all")

  const filteredAndSortedStocks = useMemo(() => {
    let filtered = mockStocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (sectorFilter !== "all") {
      filtered = filtered.filter((stock) => stock.sector === sectorFilter)
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })
  }, [searchTerm, sortField, sortDirection, sectorFilter])

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

  const handleSort = (field: keyof StockData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sectors = Array.from(new Set(mockStocks.map((stock) => stock.sector)))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Markets</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">NASDAQ Screener</h1>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base w-full sm:w-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by symbol or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Stock Data ({filteredAndSortedStocks.length} stocks)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 sm:w-16"></TableHead>
                  <TableHead className="min-w-[80px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("symbol")}
                      className="h-auto p-0 font-semibold text-xs sm:text-sm"
                    >
                      Symbol <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Company</TableHead>
                  <TableHead className="text-right min-w-[80px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("price")}
                      className="h-auto p-0 font-semibold text-xs sm:text-sm"
                    >
                      Price <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">Change</TableHead>
                  <TableHead className="text-right min-w-[70px] hidden md:table-cell">Open</TableHead>
                  <TableHead className="text-right min-w-[70px] hidden md:table-cell">High</TableHead>
                  <TableHead className="text-right min-w-[70px] hidden md:table-cell">Low</TableHead>
                  <TableHead className="text-right min-w-[80px] hidden lg:table-cell">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("volume")}
                      className="h-auto p-0 font-semibold text-xs sm:text-sm"
                    >
                      Volume <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("marketCap")}
                      className="h-auto p-0 font-semibold text-xs sm:text-sm"
                    >
                      Market Cap <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[100px] hidden xl:table-cell">Sector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedStocks.map((stock) => (
                  <TableRow
                    key={stock.symbol}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onStockSelect(stock)}
                  >
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
                    <TableCell className="text-right text-xs sm:text-sm hidden md:table-cell p-2 sm:p-4">
                      ${stock.open.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-semibold text-xs sm:text-sm hidden md:table-cell p-2 sm:p-4">
                      ${stock.high.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-semibold text-xs sm:text-sm hidden md:table-cell p-2 sm:p-4">
                      ${stock.low.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm hidden lg:table-cell p-2 sm:p-4">
                      {formatVolume(stock.volume)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs sm:text-sm p-2 sm:p-4">
                      {formatNumber(stock.marketCap)}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell p-2 sm:p-4">
                      <Badge variant="secondary" className="text-xs">
                        {stock.sector}
                      </Badge>
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
              {filteredAndSortedStocks.filter((s) => s.change > 0).length}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Gainers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {filteredAndSortedStocks.filter((s) => s.change < 0).length}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Losers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {formatNumber(filteredAndSortedStocks.reduce((sum, stock) => sum + stock.marketCap, 0))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Total Market Cap</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {formatVolume(filteredAndSortedStocks.reduce((sum, stock) => sum + stock.volume, 0))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Total Volume</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
