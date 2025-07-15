// File: app\dashboard\trade\[symbol]\page.tsx
"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import BuySellPage from "../../../../buy-sell-page";
import type { StockData } from "@/types/stock";

export default function TradePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // ✅ This is correct in Client Components

  const symbol = (params?.symbol as string | undefined)?.toUpperCase();

  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [cash, setCash] = useState(50000);

  const handleNavigateToNews = useCallback(
      (stockSymbol?: string) => {
        if (stockSymbol) {
          router.push(`/dashboard/news?filter=${stockSymbol}`);
        } else {
          router.push("/dashboard/news");
        }
      },
      [router]
  );

  const handleUpdateCash = useCallback((newCash: number) => {
    setCash(newCash);
  }, []);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const handleAddToWatchlist = useCallback((stock: StockData) => {
    addToWatchlist(stock);
  }, [addToWatchlist]);

  const handleRemoveFromWatchlist = useCallback((symbol: string) => {
    removeFromWatchlist(symbol);
  }, [removeFromWatchlist]);

  useEffect(() => {
    if (!symbol) return;

    const stockDataParam = searchParams.get("data");

    let stockData: StockData;

    if (stockDataParam) {
      try {
        stockData = JSON.parse(decodeURIComponent(stockDataParam));
      } catch (error) {
        console.error("Error parsing stock data:", error);
        stockData = createFallbackStock(symbol);
      }
    } else {
      stockData = createFallbackStock(symbol);
    }

    setSelectedStock((prevStock) => {
      if (!prevStock || prevStock.symbol !== stockData.symbol) {
        return stockData;
      }
      return prevStock;
    });
  }, [symbol, searchParams]);

  if (!selectedStock) {
    return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
    );
  }

  return (
      <BuySellPage
          selectedStock={selectedStock}
          onNavigateToNews={handleNavigateToNews}
          cash={cash}
          onUpdateCash={handleUpdateCash}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          isInWatchlist={isInWatchlist}
      />
  );
}

function createFallbackStock(symbol: string): StockData {
  return {
    symbol,
    name: `${symbol} Inc.`,
    logo: "/placeholder.svg?height=32&width=32",
    price: 0,
    open: 0,
    high: 0,
    low: 0,
    volume: 0,
    marketCap: 0,
    change: 0,
    changePercent: 0,
    sector: "Technology",
  };
}
