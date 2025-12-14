"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useSelection } from "@/hooks/use-selection"
import { Dock } from "./dock"
import { Window } from "./window"
import { TopBar } from "./top-bar"
import { OSProvider, useOSContext } from "./os-context"
import { TerminalApp } from "./apps/terminal-app"
import { AboutApp } from "./apps/about-app"
import { ProjectsApp } from "./apps/projects-app"
import { ContactApp } from "./apps/contact-app"
import { SkillsApp } from "./apps/skills-app"
import { FileManagerApp } from "./apps/file-manager-app"
import { SettingsApp } from "./apps/settings-app"

export type AppId = "terminal" | "about" | "projects" | "contact" | "skills" | "files" | "settings"

export interface WindowState {
  id: AppId
  title: string
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface AppConfig {
  title: string
  defaultSize: { width: number; height: number }
  minSize: { width: number; height: number }
  optimalSize: { width: number; height: number }
}

const APP_CONFIG: Record<AppId, AppConfig> = {
  terminal: {
    title: "Terminal",
    defaultSize: { width: 700, height: 600 },
    minSize: { width: 300, height: 200 },
    optimalSize: { width: 800, height: 600 },
  },
  about: {
    title: "Über Mich",
    defaultSize: { width: 500, height: 680 },
    minSize: { width: 300, height: 200 },
    optimalSize: { width: 500, height: 680 }, // Erhöht für vollständigen Inhalt
  },
  projects: {
    title: "Projekte",
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 300, height: 200 },
    optimalSize: { width: 600, height: 550 }, // Etwas erhöht
  },
  contact: {
    title: "Kontakt",
    defaultSize: { width: 400, height: 470 },
    minSize: { width: 300, height: 200 },
    optimalSize: { width: 400, height: 470 }, // Erhöht für alle Kontakte
  },
  skills: {
    title: "Skills.exe",
    defaultSize: { width: 550, height: 480 },
    minSize: { width: 300, height: 200 },
    optimalSize: { width: 550, height: 520 }, // Etwas erhöht
  },
  files: {
    title: "Dateien",
    defaultSize: { width: 600, height: 450 },
    minSize: { width: 300, height: 200 },
    optimalSize: { width: 600, height: 450 },
  },
  settings: {
    title: "Settings",
    defaultSize: { width: 600, height: 500 },
    minSize: { width: 300, height: 200 },
    optimalSize: { width: 600, height: 500 },
  },
}

const APP_COMPONENTS: Record<AppId, React.ComponentType> = {
  terminal: TerminalApp,
  about: AboutApp,
  projects: ProjectsApp,
  contact: ContactApp,
  skills: SkillsApp,
  files: FileManagerApp,
  settings: SettingsApp,
}

/**
 * Berechnet die optimale Fenstergröße, die sicherstellt, dass der Inhalt vollständig sichtbar ist
 * Berücksichtigt Viewport-Grenzen (TopBar: 28px, Dock: ~70px)
 */
function calculateOptimalWindowSize(
  appId: AppId,
  viewportWidth: number = typeof window !== "undefined" ? window.innerWidth : 1920,
  viewportHeight: number = typeof window !== "undefined" ? window.innerHeight : 1080,
): { width: number; height: number } {
  const config = APP_CONFIG[appId]
  const optimalSize = config.optimalSize

  // Viewport-Grenzen: TopBar (28px) + Dock (~70px) + etwas Padding
  const maxHeight = viewportHeight - 28 - 70 - 40 // 40px Padding
  const maxWidth = viewportWidth - 40 // 40px Padding

  // Verwende die optimale Größe, aber respektiere Viewport-Grenzen
  const width = Math.min(optimalSize.width, maxWidth)
  const height = Math.min(optimalSize.height, maxHeight)

  // Stelle sicher, dass die minimale Größe eingehalten wird
  return {
    width: Math.max(width, config.minSize.width),
    height: Math.max(height, config.minSize.height),
  }
}

function DesktopContent() {
  const { wallpaper } = useOSContext()
  const { isSelecting, selectionStyle, handlers: selectionHandlers } = useSelection()
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "terminal",
      title: "Terminal",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1,
      position: { x: 80, y: 60 },
      size: { width: 700, height: 500 },
    },
  ])
  const [maxZIndex, setMaxZIndex] = useState(1)

  const openApp = useCallback(
    (appId: AppId) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === appId)
        if (existing) {
          // If minimized, restore it
          if (existing.isMinimized) {
            return prev.map((w) => (w.id === appId ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w))
          }
          // Otherwise bring to front
          return prev.map((w) => (w.id === appId ? { ...w, zIndex: maxZIndex + 1 } : w))
        }
        // Open new window with optimal size
        const config = APP_CONFIG[appId]
        const optimalSize = calculateOptimalWindowSize(appId)
        const offset = prev.length * 30
        return [
          ...prev,
          {
            id: appId,
            title: config.title,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: maxZIndex + 1,
            position: { x: 100 + offset, y: 80 + offset },
            size: optimalSize,
          },
        ]
      })
      setMaxZIndex((z) => z + 1)
    },
    [maxZIndex],
  )

  const closeApp = useCallback((appId: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== appId))
  }, [])

  const minimizeApp = useCallback((appId: AppId) => {
    setWindows((prev) => prev.map((w) => (w.id === appId ? { ...w, isMinimized: true } : w)))
  }, [])

  const maximizeApp = useCallback((appId: AppId) => {
    setWindows((prev) => prev.map((w) => (w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w)))
  }, [])

  const focusWindow = useCallback(
    (appId: AppId) => {
      setWindows((prev) => prev.map((w) => (w.id === appId ? { ...w, zIndex: maxZIndex + 1 } : w)))
      setMaxZIndex((z) => z + 1)
    },
    [maxZIndex],
  )

  const updateWindowPosition = useCallback((appId: AppId, position: { x: number; y: number }) => {
    setWindows((prev) => prev.map((w) => (w.id === appId ? { ...w, position } : w)))
  }, [])

  const updateWindowSize = useCallback((appId: AppId, size: { width: number; height: number }) => {
    setWindows((prev) => prev.map((w) => (w.id === appId ? { ...w, size } : w)))
  }, [])

  const openWindows = windows.filter((w) => w.isOpen && !w.isMinimized)

  // Get the active (focused) window - the one with highest zIndex
  const activeWindow = openWindows.length > 0
    ? openWindows.reduce((prev, current) => (prev.zIndex > current.zIndex ? prev : current))
    : null

  const activeAppTitle = activeWindow ? APP_CONFIG[activeWindow.id].title : "Finder"

  // Callbacks for TopBar
  const closeActiveWindow = useCallback(() => {
    if (activeWindow) {
      closeApp(activeWindow.id)
    }
  }, [activeWindow, closeApp])

  const minimizeActiveWindow = useCallback(() => {
    if (activeWindow) {
      minimizeApp(activeWindow.id)
    }
  }, [activeWindow, minimizeApp])

  const maximizeActiveWindow = useCallback(() => {
    if (activeWindow) {
      maximizeApp(activeWindow.id)
    }
  }, [activeWindow, maximizeApp])

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative select-none">
      {/* Desktop background - handles selection */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `var(--wallpaper-url, url('${wallpaper}'))`,
        }}
        onMouseDown={selectionHandlers.onMouseDown}
      />

      {/* Selection Rectangle */}
      {isSelecting && selectionStyle && (
        <div
          className="bg-primary/20 border border-primary/60 rounded-sm z-10"
          style={selectionStyle}
        />
      )}

      {/* Top Bar */}
      <TopBar
        onOpenApp={openApp}
        onCloseActiveWindow={closeActiveWindow}
        onMinimizeActiveWindow={minimizeActiveWindow}
        onMaximizeActiveWindow={maximizeActiveWindow}
        activeApp={activeAppTitle}
      />

      {/* Windows */}
      {openWindows.map((window) => {
        const AppComponent = APP_COMPONENTS[window.id]
        return (
          <Window
            key={window.id}
            window={window}
            onClose={() => closeApp(window.id)}
            onMinimize={() => minimizeApp(window.id)}
            onMaximize={() => maximizeApp(window.id)}
            onFocus={() => focusWindow(window.id)}
            onMove={(pos) => updateWindowPosition(window.id, pos)}
            onResize={(size) => updateWindowSize(window.id, size)}
          >
            <AppComponent />
          </Window>
        )
      })}

      {/* Dock */}
      <Dock windows={windows} onOpenApp={openApp} />

      {/* Scanline effect */}
      <div className="pointer-events-none fixed inset-0 z-9999">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1)_0px,rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] opacity-30" />
      </div>
    </div>
  )
}

export function Desktop() {
  return (
    <OSProvider>
      <DesktopContent />
    </OSProvider>
  )
}
