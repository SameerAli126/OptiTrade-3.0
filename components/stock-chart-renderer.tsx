"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface ChartDataPoint {
  x: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface StockChartRendererProps {
  seriesData: ChartDataPoint[]
  stockSymbol: string
  chartType: "line" | "candlestick"
}

// Custom Candlestick component for Recharts
const CustomCandlestick = (props: any) => {
  const { payload, x, y, width, height } = props
  if (!payload) return null

  const { open, high, low, close } = payload
  const isUp = close > open
  const color = isUp ? "#10b981" : "#ef4444"
  const bodyHeight = Math.abs(close - open)
  const bodyY = Math.min(open, close)

  // Scale values to fit the chart area
  const scale = height / (high - low)
  const wickX = x + width / 2
  const highY = y + (high - Math.max(open, close)) * scale
  const lowY = y + (Math.min(open, close) - low) * scale + bodyHeight * scale
  const bodyTop = y + (high - Math.max(open, close)) * scale
  const scaledBodyHeight = bodyHeight * scale

  return (
    <g>
      {/* High-Low wick */}
      <line x1={wickX} y1={highY} x2={wickX} y2={lowY} stroke={color} strokeWidth={1} />
      {/* Open-Close body */}
      <rect
        x={x + width * 0.2}
        y={bodyTop}
        width={width * 0.6}
        height={Math.max(scaledBodyHeight, 1)}
        fill={isUp ? color : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  )
}

export default function StockChartRenderer({ seriesData, stockSymbol, chartType }: StockChartRendererProps) {
  // Process data for charts
  const chartData = useMemo(() => {
    return seriesData.map((point) => ({
      date: new Date(point.x).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      timestamp: point.x,
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
      volume: point.volume,
      // For line chart
      price: point.close,
    }))
  }, [seriesData])

  // Calculate moving averages
  const dataWithIndicators = useMemo(() => {
    const sma20 = []
    const ema26 = []
    const rsi = []

    // Simple Moving Average (20 periods)
    for (let i = 0; i < chartData.length; i++) {
      if (i >= 19) {
        const sum = chartData.slice(i - 19, i + 1).reduce((acc, curr) => acc + curr.close, 0)
        sma20.push(sum / 20)
      } else {
        sma20.push(null)
      }
    }

    // Exponential Moving Average (26 periods)
    const multiplier = 2 / (26 + 1)
    for (let i = 0; i < chartData.length; i++) {
      if (i === 0) {
        ema26.push(chartData[i].close)
      } else {
        ema26.push(chartData[i].close * multiplier + ema26[i - 1] * (1 - multiplier))
      }
    }

    // RSI (14 periods)
    for (let i = 0; i < chartData.length; i++) {
      if (i >= 14) {
        const gains = []
        const losses = []
        for (let j = i - 13; j <= i; j++) {
          const change = chartData[j].close - chartData[j - 1]?.close || 0
          if (change > 0) gains.push(change)
          else losses.push(Math.abs(change))
        }
        const avgGain = gains.reduce((a, b) => a + b, 0) / 14
        const avgLoss = losses.reduce((a, b) => a + b, 0) / 14
        const rs = avgGain / (avgLoss || 1)
        rsi.push(100 - 100 / (1 + rs))
      } else {
        rsi.push(null)
      }
    }

    return chartData.map((item, index) => ({
      ...item,
      sma20: sma20[index],
      ema26: ema26[index],
      rsi: rsi[index],
    }))
  }, [chartData])

  // Custom tooltip for price data
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-sm">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p>Open: ${data.open?.toFixed(2)}</p>
            <p>High: ${data.high?.toFixed(2)}</p>
            <p>Low: ${data.low?.toFixed(2)}</p>
            <p>Close: ${data.close?.toFixed(2)}</p>
            <p>Volume: {data.volume?.toLocaleString()}</p>
            {data.sma20 && <p className="text-yellow-400">SMA(20): ${data.sma20.toFixed(2)}</p>}
            {data.ema26 && <p className="text-green-400">EMA(26): ${data.ema26.toFixed(2)}</p>}
          </div>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for volume
  const VolumeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const volume = payload[0].value
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-sm">
          <p>{label}</p>
          <p>Volume: {volume?.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for RSI
  const RSITooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const rsi = payload[0].value
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 text-white text-sm">
          <p>{label}</p>
          <p>RSI: {rsi?.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
    return value.toString()
  }

  return (
    <div className="w-full bg-gray-900 rounded-lg p-4" style={{ height: "500px" }}>
      <div className="text-white text-lg font-semibold mb-4 text-center">
        {stockSymbol} — {chartType === "candlestick" ? "Candlestick" : "Line"} Chart
      </div>

      <div className="grid grid-rows-4 gap-2 h-full">
        {/* Main Price Chart - 60% height */}
        <div className="row-span-2">
          <ChartContainer
            config={{
              price: { label: "Price", color: "#3b82f6" },
              sma20: { label: "SMA(20)", color: "#fbbf24" },
              ema26: { label: "EMA(26)", color: "#10b981" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={dataWithIndicators} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#d1d5db"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#d1d5db"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sma20"
                    stroke="#fbbf24"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="ema26"
                    stroke="#10b981"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                  />
                </LineChart>
              ) : (
                <LineChart data={dataWithIndicators} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#d1d5db"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#d1d5db"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Candlestick representation using multiple lines */}
                  <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="sma20"
                    stroke="#fbbf24"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="ema26"
                    stroke="#10b981"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* RSI Chart - 20% height */}
        <div className="row-span-1">
          <ChartContainer
            config={{
              rsi: { label: "RSI", color: "#f472b6" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataWithIndicators} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#d1d5db"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#d1d5db"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => value.toString()}
                />
                <Tooltip content={<RSITooltip />} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" />
                <Line type="monotone" dataKey="rsi" stroke="#f472b6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Volume Chart - 20% height */}
        <div className="row-span-1">
          <ChartContainer
            config={{
              volume: { label: "Volume", color: "#6366f1" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataWithIndicators} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#d1d5db"
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#d1d5db" fontSize={8} tickLine={false} axisLine={false} tickFormatter={formatVolume} />
                <Tooltip content={<VolumeTooltip />} />
                <Bar dataKey="volume" fill="#6366f1" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
