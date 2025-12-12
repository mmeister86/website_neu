"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface OSContextType {
  wallpaper: string
  setWallpaper: (wallpaper: string) => void
  availableWallpapers: string[]
}

const OSContext = createContext<OSContextType | undefined>(undefined)

const DEFAULT_WALLPAPER = "/images/wellen-20hintergrund-20wallpaper.jpg"
const AVAILABLE_WALLPAPERS = [
  "/images/Blaues und rosafarbenes Licht.jpg",
  "/images/lake-mountains-rocks-sunrise-daylight-scenery-illustration-3840x2160-3773.jpg",
  "/images/sean-fahrenbruch-g95tsUeCohM-unsplash.jpg",
  "/images/waves-macos-big-sur-colorful-dark-5k-6016x6016-4990.jpg",
  "/images/wellen-20hintergrund-20wallpaper.jpg",
]

// Cookie helper functions
const getWallpaperFromCookie = (): string | null => {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "os-wallpaper") {
      return decodeURIComponent(value)
    }
  }
  return null
}

const setWallpaperCookie = (wallpaper: string) => {
  if (typeof document === "undefined") return

  const maxAge = 60 * 60 * 24 * 365 // 1 year
  document.cookie = `os-wallpaper=${encodeURIComponent(wallpaper)}; max-age=${maxAge}; path=/; SameSite=Lax`
}

// Get initial wallpaper from cookie or fallback to default
const getInitialWallpaper = (): string => {
  const cookieWallpaper = getWallpaperFromCookie()
  if (cookieWallpaper && AVAILABLE_WALLPAPERS.includes(cookieWallpaper)) {
    return cookieWallpaper
  }
  return DEFAULT_WALLPAPER
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [wallpaper, setWallpaperState] = useState<string>(getInitialWallpaper())

  const setWallpaper = (newWallpaper: string) => {
    setWallpaperState(newWallpaper)
    localStorage.setItem("os-wallpaper", newWallpaper)
    setWallpaperCookie(newWallpaper)

    // Update CSS variable immediately to prevent any flash
    if (typeof document !== "undefined") {
      document.body.style.setProperty("--wallpaper-url", `url('${newWallpaper}')`)
    }
  }

  useEffect(() => {
    // Check localStorage for any saved wallpaper that might not be in cookie yet
    const savedWallpaper = localStorage.getItem("os-wallpaper")
    if (savedWallpaper && AVAILABLE_WALLPAPERS.includes(savedWallpaper) && savedWallpaper !== wallpaper) {
      setWallpaperState(savedWallpaper)
      setWallpaperCookie(savedWallpaper)
    }
  }, [wallpaper])

  return (
    <OSContext.Provider
      value={{
        wallpaper,
        setWallpaper,
        availableWallpapers: AVAILABLE_WALLPAPERS,
      }}
    >
      {children}
    </OSContext.Provider>
  )
}

export function useOSContext() {
  const context = useContext(OSContext)
  if (context === undefined) {
    throw new Error("useOSContext must be used within an OSProvider")
  }
  return context
}
