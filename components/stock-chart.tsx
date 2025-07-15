"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import HighchartsRenderer from "./highcharts-renderer"

interface StockData {
  symbol: string
  name: string
}

interface ChartDataPoint {
  x: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface StockChartProps {
  stock: StockData
}

export default function StockChart({ stock }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<"line" | "candlestick">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("preferredChart") as "line" | "candlestick") || "line"
    }
    return "line"
  })

  // Persist the user's chart preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredChart", chartType)
    }
  }, [chartType])

  // Fetch and process stock data
  useEffect(() => {
    if (!stock?.symbol) return

    const fetchStockData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://archlinux.tail9023a4.ts.net/stocks/${stock.symbol}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (!data || Object.keys(data).length === 0) {
          throw new Error(`No data available for ${stock.symbol}`)
        }

        // Process the data into the format expected by the chart
        const processedData: ChartDataPoint[] = Object.entries(data)
          .map(([date, values]: [string, any]) => ({
            x: new Date(date).getTime(),
            open: Number(values.Open),
            high: Number(values.High),
            low: Number(values.Low),
            close: Number(values.Close),
            volume: Number(values.Volume),
          }))
          .sort((a, b) => a.x - b.x) // Sort by date ascending

        setChartData(processedData)
      } catch (err) {
        console.error("Error fetching stock data:", err)
        setError(err instanceof Error ? err.message : "Failed to load chart data")
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()
  }, [stock?.symbol])

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            {stock?.symbol} Price Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
              <p className="text-sm text-gray-500">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            {stock?.symbol} Price Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
              <p className="text-sm text-red-600 mb-2">Error loading chart</p>
              <p className="text-xs text-gray-500">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            {stock?.symbol} Price Chart
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80 lg:h-96 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-500">No chart data available for {stock?.symbol}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            {stock?.symbol} Price Chart
          </CardTitle>

          {/* Chart Type Toggle */}
          <div className="flex gap-2">
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
              className="text-xs"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Line Chart
            </Button>
            <Button
              variant={chartType === "candlestick" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("candlestick")}
              className="text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Candlestick
            </Button>
          </div>
        </div>

        {/* Chart Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {chartData.length} data points
            </Badge>
          </div>
          <div>Last updated: {new Date(chartData[chartData.length - 1]?.x).toLocaleDateString()}</div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full">
          <HighchartsRenderer
            key={`${stock.symbol}-${chartType}`}
            seriesData={chartData}
            stockSymbol={stock.symbol}
            chartType={chartType}
          />
        </div>
      </CardContent>
    </Card>
  )
}
