"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock Nasdaq weekly data for the past 12 weeks
const nasdaqWeeklyData = [
  { week: "Week 1", value: 14200, date: "Jan 1" },
  { week: "Week 2", value: 14350, date: "Jan 8" },
  { week: "Week 3", value: 14180, date: "Jan 15" },
  { week: "Week 4", value: 14420, date: "Jan 22" },
  { week: "Week 5", value: 14580, date: "Jan 29" },
  { week: "Week 6", value: 14720, date: "Feb 5" },
  { week: "Week 7", value: 14650, date: "Feb 12" },
  { week: "Week 8", value: 14890, date: "Feb 19" },
  { week: "Week 9", value: 15020, date: "Feb 26" },
  { week: "Week 10", value: 14950, date: "Mar 5" },
  { week: "Week 11", value: 15180, date: "Mar 12" },
  { week: "Week 12", value: 15340, date: "Mar 19" },
]

export default function NasdaqChart() {
  const currentValue = nasdaqWeeklyData[nasdaqWeeklyData.length - 1].value
  const previousValue = nasdaqWeeklyData[nasdaqWeeklyData.length - 2].value
  const change = currentValue - previousValue
  const changePercent = (change / previousValue) * 100

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Chart Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">NASDAQ Composite</h3>
            <p className="text-sm text-gray-300">Weekly Performance</p>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-white">{currentValue.toLocaleString()}</div>
            <div className={`text-sm ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(0)} ({changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4 sm:p-6 overflow-hidden">
        <ChartContainer
          config={{
            value: {
              label: "NASDAQ",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-full w-full min-h-0"
        >
          <div className="w-full h-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nasdaqWeeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  )
}
