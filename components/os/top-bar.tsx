"use client"

import { useState, useEffect } from "react"
import { Wifi, Battery, Volume2 } from "lucide-react"

export function TopBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute top-0 left-0 right-0 h-7 bg-card/90 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 z-50">
      {/* Left side - Apple logo and menus */}
      <div className="flex items-center gap-4">
        <span className="text-terminal-pink font-bold"></span>
        <span className="text-sm text-foreground font-semibold">MatthiasOS</span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="hover:text-foreground cursor-default">Datei</span>
          <span className="hover:text-foreground cursor-default">Bearbeiten</span>
          <span className="hover:text-foreground cursor-default">Ansicht</span>
          <span className="hover:text-foreground cursor-default">Fenster</span>
          <span className="hover:text-foreground cursor-default">Hilfe</span>
        </div>
      </div>

      {/* Right side - System tray */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1">
          <Wifi className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1">
          <Battery className="w-3.5 h-3.5" />
          <span>100%</span>
        </div>
        <span className="text-foreground">
          {time.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })}
        </span>
        <span className="text-foreground font-medium">
          {time.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  )
}
