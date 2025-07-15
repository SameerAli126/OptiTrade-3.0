"use client"
//
import type React from "react"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"
import SettingsPanel from "./settings-panel"
import { useTheme } from "@/hooks/use-theme"
import type { StockData } from "@/types/stock"

interface DashboardShellProps {
  children: React.ReactNode
  watchlist: StockData[]
  cash: number
  onUpdateCash: (newCash: number) => void
  onAddToWatchlist: (stock: StockData) => void
  onRemoveFromWatchlist: (symbol: string) => void
  isInWatchlist: (symbol: string) => boolean
}

export default function DashboardShell({
  children,
  watchlist,
  cash,
  onUpdateCash,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist,
}: DashboardShellProps) {
  const { isDarkMode, themeColor, colorTarget, toggleTheme, updateThemeColor, updateColorTarget } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: "Home", icon: Home, href: "/dashboard" },
    { name: "Portfolio", icon: Briefcase, href: "/dashboard/portfolio" },
    { name: "Trade", icon: TrendingUp, href: "/dashboard/trade/AAPL" },
    { name: "Screener", icon: Filter, href: "/dashboard/screener" },
    { name: "News", icon: Newspaper, href: "/dashboard/news" },
    { name: "Watchlist", icon: Bookmark, href: "/dashboard/watchlist" },
    { name: "Explore", icon: Edit, href: "/dashboard/explore" },
  ]

  const handleNavClick = (href: string) => {
    router.push(href)
    setSidebarOpen(false)
  }

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
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
          const isWatchlistWithItems = item.name === "Watchlist" && Array.isArray(watchlist) && watchlist?.length > 0
          const isActive = isActiveRoute(item.href)

          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors relative ${
                isActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
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
                    Balance: ${typeof cash === "number" ? cash.toLocaleString() : "N/A"}
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
                    {typeof cash === "number" ? `$${(cash / 1000).toFixed(0)}k` : "N/A"}
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
        <div className="flex-1 p-3 sm:p-6 overflow-auto">{children}</div>
      </div>

      {/* Settings Panel */}
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
