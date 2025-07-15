"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, Palette } from "lucide-react"

interface SettingsPanelProps {
  isDarkMode: boolean
  onThemeToggle: () => void
  themeColor: string
  onColorChange: (color: string) => void
  colorTarget: "main" | "sidebar"
  onColorTargetChange: (target: "main" | "sidebar") => void
}

export default function SettingsPanel({
  isDarkMode,
  onThemeToggle,
  themeColor,
  onColorChange,
  colorTarget,
  onColorTargetChange,
}: SettingsPanelProps) {
  const [tempColor, setTempColor] = useState(themeColor)
  const [isOpen, setIsOpen] = useState(false)

  const handleApplyColor = () => {
    onColorChange(tempColor)
  }

  const presetColors = [
    "#0391d8", // Blue (default)
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg z-50"
        >
          <Settings className="w-4 h-4 sm:w-6 sm:h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4 mb-4" side="top" align="end" sideOffset={10}>
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Mode Toggle */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Theme Mode</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
                <div className="relative">
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={onThemeToggle}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`w-4 h-4 rounded-full transition-all duration-200 ${
                        isDarkMode ? "bg-blue-600 transform translate-x-2" : "bg-yellow-400 transform -translate-x-2"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Color Target Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Customize Color For</Label>
              <RadioGroup
                value={colorTarget}
                onValueChange={(value: "main" | "sidebar") => onColorTargetChange(value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="main" id="main" />
                  <Label htmlFor="main" className="text-sm">
                    Main Theme
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sidebar" id="sidebar" />
                  <Label htmlFor="sidebar" className="text-sm">
                    Sidebar
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Color Picker */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Set Theme Color</Label>
              <div className="flex gap-2">
                <div
                  className="w-12 h-10 rounded border-2 border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: tempColor }}
                />
                <Input
                  type="text"
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  placeholder="#0391d8"
                  className="flex-1"
                />
              </div>

              {/* Preset Colors */}
              <div className="grid grid-cols-8 gap-2 mt-3">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => setTempColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <Button onClick={handleApplyColor} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Apply Custom Color
            </Button>

            {/* Current Theme Display */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Current Theme Color:</span>
              <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: themeColor }} />
              <span className="font-mono">{themeColor}</span>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
