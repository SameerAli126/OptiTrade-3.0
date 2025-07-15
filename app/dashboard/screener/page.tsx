"use client"

import { useRouter } from "next/navigation"
import ScreenerPage from "@/components/screener-page"
import type { StockData } from "@/types/stock"

export default function ScreenerPageRoute() {
  const router = useRouter()

  const handleStockSelect = (stock: StockData) => {
    // Navigate to trading page with stock symbol
    router.push(`/dashboard/trade/${stock.symbol}?data=${encodeURIComponent(JSON.stringify(stock))}`)
  }

  return <ScreenerPage onStockSelect={handleStockSelect} />
}
