"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Bot } from "lucide-react"
import NasdaqChart from "../../nasdaq-chart"

export default function DashboardHomePage() {
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
                management. You can also consider adding more stocks to your portfolio to increase diversification. So
                far, your portfolio has a 100% return on investment (ROI) and is in the green.
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
}
