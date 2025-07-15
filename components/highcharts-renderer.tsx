"use client"

import { useEffect, useRef } from "react"

interface ChartDataPoint {
  x: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface HighchartsRendererProps {
  seriesData: ChartDataPoint[]
  stockSymbol: string
  chartType: "line" | "candlestick"
}

export default function HighchartsRenderer({ seriesData, stockSymbol, chartType }: HighchartsRendererProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    // Load Highcharts using CDN approach to avoid module loading issues
    const loadChart = async () => {
      if (typeof window === "undefined") return

      try {
        // Check if Highcharts is already loaded
        if (!(window as any).Highcharts) {
          // Load Highcharts from CDN
          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://code.highcharts.com/stock/highstock.js"
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })

          // Load additional modules
          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://code.highcharts.com/stock/indicators/indicators.js"
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })

          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://code.highcharts.com/stock/indicators/ema.js"
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })

          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://code.highcharts.com/stock/indicators/rsi.js"
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        const Highcharts = (window as any).Highcharts

        const fmt = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        })

        // Prepare data based on chart type
        const priceData =
          chartType === "candlestick"
            ? seriesData.map((d) => ({
                x: d.x,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
                volume: d.volume,
              }))
            : seriesData.map((d) => ({
                x: d.x,
                y: d.close,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
                volume: d.volume,
              }))

        const volumeData = seriesData.map((d) => [d.x, d.volume])

        const options = {
          chart: {
            backgroundColor: "#1f2937",
            style: { fontFamily: "inherit" },
            height: 500,
          },
          title: {
            text: `${stockSymbol} — ${chartType === "candlestick" ? "Candlestick" : "Line"}`,
            style: { color: "#f9fafb" },
          },
          rangeSelector: {
            selected: 1,
            inputStyle: { color: "#d1d5db" },
            labelStyle: { color: "#d1d5db" },
            buttons: [
              {
                type: "month",
                count: 1,
                text: "1M",
              },
              {
                type: "month",
                count: 3,
                text: "3M",
              },
              {
                type: "month",
                count: 6,
                text: "6M",
              },
              {
                type: "year",
                count: 1,
                text: "1Y",
              },
              {
                type: "all",
                text: "All",
              },
            ],
          },
          xAxis: {
            type: "datetime",
            labels: { style: { color: "#d1d5db" } },
            lineColor: "#374151",
            gridLineColor: "#374151",
          },
          yAxis: [
            {
              // Price Y-Axis
              title: { text: "Price", style: { color: "#d1d5db" } },
              labels: {
                formatter: function () {
                  return fmt.format(this.value)
                },
                style: { color: "#d1d5db" },
              },
              gridLineColor: "#374151",
              height: "60%",
              lineWidth: 1,
              lineColor: "#6b7280",
            },
            {
              // RSI Y-Axis
              title: { text: "RSI", style: { color: "#d1d5db" } },
              labels: {
                style: { color: "#d1d5db" },
                align: "right",
                x: -3,
              },
              gridLineColor: "#374151",
              top: "62%",
              height: "18%",
              offset: 0,
              lineWidth: 1,
              lineColor: "#6b7280",
              min: 0,
              max: 100,
            },
            {
              // Volume Y-Axis
              title: { text: "Volume", style: { color: "#d1d5db" } },
              labels: {
                formatter: function () {
                  if (this.value >= 1e9) return (this.value / 1e9).toFixed(1) + "B"
                  if (this.value >= 1e6) return (this.value / 1e6).toFixed(1) + "M"
                  if (this.value >= 1e3) return (this.value / 1e3).toFixed(1) + "K"
                  return this.value.toLocaleString()
                },
                style: { color: "#d1d5db" },
              },
              top: "82%",
              height: "18%",
              offset: 0,
              opposite: true,
              gridLineColor: "#374151",
              lineWidth: 1,
              lineColor: "#6b7280",
            },
          ],
          tooltip: {
            shared: true,
            backgroundColor: "#374151",
            borderColor: "#4b5563",
            style: { color: "#f9fafb" },
            formatter: function () {
              const dateStr = new Date(this.x).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
              let s = `<b>${dateStr}</b><br/>`

              // Price data
              const pricePt = this.points.find((p) => p.series.type !== "column")
              if (pricePt) {
                const p = pricePt.point
                s += `O: ${fmt.format(p.open)} H: ${fmt.format(p.high)}<br/>`
                s += `L: ${fmt.format(p.low)} C: ${fmt.format(p.close)}<br/>`
              }

              // Volume data
              const volPt = this.points.find((p) => p.series.type === "column")
              if (volPt) {
                s += `Vol: ${volPt.point.y.toLocaleString()}`
              }

              return s
            },
          },
          series: [
            {
              // Main Price Series
              type: chartType,
              id: `${stockSymbol}-price`,
              name: `${stockSymbol} Price`,
              data: priceData,
              upColor: chartType === "candlestick" ? "#10b981" : undefined,
              color: chartType === "candlestick" ? "#ef4444" : "#3b82f6",
              lineColor: chartType === "candlestick" ? "#ef4444" : undefined,
              upLineColor: chartType === "candlestick" ? "#10b981" : undefined,
              marker: chartType === "line" ? { enabled: false } : undefined,
              lineWidth: chartType === "line" ? 2 : undefined,
              yAxis: 0,
            },
            {
              // Volume Series
              type: "column",
              id: `${stockSymbol}-volume`,
              name: "Volume",
              data: volumeData,
              yAxis: 2,
              color: "#6366f1",
              opacity: 0.7,
            },
            {
              // Simple Moving Average
              type: "sma",
              linkedTo: `${stockSymbol}-price`,
              zIndex: 1,
              marker: { enabled: false },
              params: { period: 20 },
              color: "#fbbf24",
              lineWidth: 1,
              name: "SMA (20)",
            },
            {
              // Exponential Moving Average
              type: "ema",
              linkedTo: `${stockSymbol}-price`,
              zIndex: 1,
              marker: { enabled: false },
              params: { period: 50 },
              color: "#34d399",
              lineWidth: 1,
              name: "EMA (50)",
            },
            {
              // RSI
              type: "rsi",
              linkedTo: `${stockSymbol}-price`,
              yAxis: 1,
              color: "#f472b6",
              lineWidth: 2,
              marker: { enabled: false },
              params: { period: 14 },
              name: "RSI (14)",
            },
          ],
          navigator: {
            adaptToUpdatedData: true,
            series: {
              type: "line",
              data: seriesData.map((d) => [d.x, d.close]),
              color: "#3b82f6",
            },
          },
          credits: { enabled: false },
          plotOptions: {
            series: { animation: { duration: 300 } },
            candlestick: { lineColor: "#ef4444" },
            column: { borderRadius: 1, pointPadding: 0.1, groupPadding: 0.1 },
          },
          scrollbar: {
            barBackgroundColor: "#374151",
            buttonBackgroundColor: "#374151",
            trackBackgroundColor: "#1f2937",
            rifleColor: "#d1d5db",
          },
          responsive: {
            rules: [
              {
                condition: { maxWidth: 768 },
                chartOptions: {
                  chart: { height: 400 },
                  rangeSelector: { inputEnabled: false },
                },
              },
            ],
          },
        }

        // Create the chart
        if (chartRef.current) {
          chartInstance.current = Highcharts.stockChart(chartRef.current, options)
        }
      } catch (error) {
        console.error("Error loading chart:", error)
        // Fallback: show error message in the chart container
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 500px; color: #ef4444; text-align: center;">
              <div>
                <div style="font-size: 18px; margin-bottom: 8px;">Chart Loading Error</div>
                <div style="font-size: 14px; color: #6b7280;">Unable to load Highcharts. Please refresh the page.</div>
              </div>
            </div>
          `
        }
      }
    }

    loadChart()

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
    }
  }, [seriesData, stockSymbol, chartType])

  return <div ref={chartRef} className="w-full" style={{ height: "500px" }} />
}
