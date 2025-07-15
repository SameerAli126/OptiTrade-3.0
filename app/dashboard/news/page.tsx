"use client"

import { useSearchParams } from "next/navigation"
import NewsPage from "../../../news-page"

export default function NewsPageRoute() {
  const searchParams = useSearchParams()
  const stockFilter = searchParams.get("filter") || undefined

  return <NewsPage initialStockFilter={stockFilter} />
}
