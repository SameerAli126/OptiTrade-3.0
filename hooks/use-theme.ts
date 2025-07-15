"use client"

import { useState, useEffect } from "react"

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [themeColor, setThemeColor] = useState("#0391d8")
  const [colorTarget, setColorTarget] = useState<"main" | "sidebar">("main")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme")
    const savedColor = localStorage.getItem("themeColor")
    const savedColorTarget = localStorage.getItem("colorTarget")

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }
    if (savedColor) {
      setThemeColor(savedColor)
    }
    if (savedColorTarget) {
      setColorTarget(savedColorTarget as "main" | "sidebar")
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  useEffect(() => {
    // Apply custom color to CSS variables
    const root = document.documentElement

    if (colorTarget === "main") {
      root.style.setProperty("--primary", themeColor)
      root.style.setProperty("--primary-foreground", "#ffffff")
    } else {
      // Apply to sidebar colors
      root.style.setProperty("--sidebar-primary", themeColor)
    }

    localStorage.setItem("themeColor", themeColor)
    localStorage.setItem("colorTarget", colorTarget)
  }, [themeColor, colorTarget])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const updateThemeColor = (color: string) => {
    setThemeColor(color)
  }

  const updateColorTarget = (target: "main" | "sidebar") => {
    setColorTarget(target)
  }

  return {
    isDarkMode,
    themeColor,
    colorTarget,
    toggleTheme,
    updateThemeColor,
    updateColorTarget,
  }
}
