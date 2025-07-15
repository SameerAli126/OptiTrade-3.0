"use client"

import { useRouter } from "next/navigation"
import { useWatchlist } from "@/contexts/WatchlistContext"
import WatchlistPage from "../../../watchlist-page"
import type { StockData } from "@/types/stock"

export default function WatchlistPageRoute() {
  const router = useRouter()
  const { watchlist, removeFromWatchlist } = useWatchlist()

  const handleStockSelect = (stock: StockData) => {
    router.push(`/dashboard/trade/${stock.symbol}?data=${encodeURIComponent(JSON.stringify(stock))}`)
  }

  const handleRemoveFromWatchlist = async (symbol: string) => {
    await removeFromWatchlist(symbol)
  }

  return (
    <WatchlistPage 
      watchlist={watchlist} 
      onStockSelect={handleStockSelect} 
      onRemoveFromWatchlist={handleRemoveFromWatchlist} 
    />
  )
}
