"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Briefcase,
  TrendingUp,
  Filter,
  Newspaper,
  Bookmark,
  Edit,
  Search,
  Bell,
  ChevronDown,
  Menu,
  Bot,
} from "lucide-react"
import ScreenerPage from "./screener-page"
import WatchlistPage from "./watchlist-page"
import BuySellPage from "./buy-sell-page"
import NasdaqChart from "./nasdaq-chart"
import SettingsPanel from "./components/settings-panel"
import { useTheme } from "./hooks/use-theme"
import NewsPage from "./news-page"

export interface StockData {
  symbol: string
  name: string
  logo: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  marketCap: number
  change: number
  changePercent: number
  sector: string
}

export default function Component() {
  const { isDarkMode, themeColor, colorTarget, toggleTheme, updateThemeColor, updateColorTarget } = useTheme()
  const [activeNav, setActiveNav] = useState("Home")
  const [currentPage, setCurrentPage] = useState("Home")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null)
  const [watchlist, setWatchlist] = useState<StockData[]>([])
  const [cash, setCash] = useState(50000) // $50k starting cash
  const [newsStockFilter, setNewsStockFilter] = useState<string | undefined>(undefined)

  const navItems = [
    { name: "Home", icon: Home },
    { name: "Portfolio", icon: Briefcase },
    { name: "Buy-Sell", icon: TrendingUp },
    { name: "Screener", icon: Filter },
    { name: "News", icon: Newspaper },
    { name: "Watchlist", icon: Bookmark },
    { name: "Explore", icon: Edit },
  ]

  const handleNavClick = (itemName: string) => {
    setActiveNav(itemName)
    setCurrentPage(itemName)
    setSidebarOpen(false) // Close mobile sidebar when navigating

    // Clear news filter when navigating away from news
    if (itemName !== "News") {
      setNewsStockFilter(undefined)
    }
  }

  const handleStockSelect = (stock: StockData) => {
    setSelectedStock(stock)
    setCurrentPage("Buy-Sell")
    setActiveNav("Buy-Sell")
  }

  const handleNavigateToNews = (stockSymbol?: string) => {
    setNewsStockFilter(stockSymbol)
    setCurrentPage("News")
    setActiveNav("News")
  }

  const addToWatchlist = (stock: StockData) => {
    setWatchlist((prev) => {
      const exists = prev.find((item) => item.symbol === stock.symbol)
      if (exists) {
        return prev // Already in watchlist
      }
      return [...prev, stock]
    })
  }

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol))
  }

  const isInWatchlist = (symbol: string) => {
    return watchlist.some((item) => item.symbol === symbol)
  }

  // Sidebar content component for reuse
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-blue-300/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
            <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold">OptiTrade</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 sm:p-4 space-y-1 sm:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isWatchlistWithItems = item.name === "Watchlist" && watchlist.length > 0
          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.name)}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors relative ${
                activeNav === item.name ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">{item.name}</span>
              {isWatchlistWithItems && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </>
  )

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "Home":
        return (
          <>
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">Overview</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Home</h1>
            </div>
            {/* Dashboard content with responsive grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Chart Area */}
              <div className="xl:col-span-2">
                <Card className="h-64 sm:h-80 lg:h-96">
                  <CardContent className="p-0 h-full">
                    <div className="w-full h-full bg-gray-800 rounded-lg">
                      <NasdaqChart />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Portfolio Summary */}
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      My Portfolio Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                      <div>
                        <p className="text-gray-600 text-xs sm:text-sm">Total Value</p>
                        <p className="text-xl sm:text-2xl font-bold">$5,498.28</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-gray-600 text-xs sm:text-sm">{"Today's P&L"}</p>
                        <p className="text-green-600 font-semibold text-sm sm:text-base">+$75.50 (+1.38%)</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm">Overall Return</p>
                      <p className="text-green-600 font-semibold text-base sm:text-lg">+$498.28 (+10.0%)</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      AI Portfolio Tip:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      AI suggests your portfolio is tech-heavy. Consider diversifying into other sectors for better risk
                      management. You can also consider adding more stocks to your portfolio to increase
                      diversification. So far, your portfolio has a 100% return on investment (ROI) and is in the green.
                      You can also see your
                      {"portfolio's"} performance in the AI Portfolio Overview card. If you want to see more details,
                      click the AI Portfolio Overview card.
                    </p>
                  </CardContent>
                </Card>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base">
                  View Full Portfolio
                </Button>
              </div>
            </div>
          </>
        )
      case "Screener":
        return <ScreenerPage onStockSelect={handleStockSelect} />
      case "Watchlist":
        return (
          <WatchlistPage
            watchlist={watchlist}
            onStockSelect={handleStockSelect}
            onRemoveFromWatchlist={removeFromWatchlist}
          />
        )
      case "Buy-Sell":
        return (
          <BuySellPage
            selectedStock={selectedStock}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
            isInWatchlist={isInWatchlist}
            cash={cash}
            onUpdateCash={setCash}
            onNavigateToNews={handleNavigateToNews}
          />
        )
      case "News":
        return <NewsPage initialStockFilter={newsStockFilter} />
      default:
        return (
          <div className="flex items-center justify-center h-64 sm:h-96">
            <p className="text-gray-500 text-base sm:text-lg">Page under construction</p>
          </div>
        )
    }
  }

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 xl:w-72 bg-gradient-to-b from-blue-400 to-blue-600 text-white flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-blue-400 to-blue-600 text-white border-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {/* Mobile menu button */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              {/* Desktop menu button */}
              <Button variant="ghost" size="icon" className="hidden lg:flex flex-shrink-0">
                <Menu className="w-5 h-5" />
              </Button>

              {/* Search */}
              <div className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search stocks..."
                  className="w-full pl-10 bg-gray-900 text-white placeholder:text-gray-400 border-gray-700 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Balance - Hidden on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white hidden sm:flex text-sm">
                    Balance: ${cash.toLocaleString()}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View Balance</DropdownMenuItem>
                  <DropdownMenuItem>Add Funds</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Balance */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white sm:hidden text-xs px-2">
                    ${(cash / 1000).toFixed(0)}k
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View Balance</DropdownMenuItem>
                  <DropdownMenuItem>Add Funds</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative flex-shrink-0">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2">
                    <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-xs">SK</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-600 hidden md:block text-sm">Hi, Sameer Khan</span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-6 overflow-auto">{renderCurrentPage()}</div>
      </div>

      {/* Settings Panel - Responsive positioning */}
      <SettingsPanel
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
        themeColor={themeColor}
        onColorChange={updateThemeColor}
        colorTarget={colorTarget}
        onColorTargetChange={updateColorTarget}
      />
    </div>
  )
}
