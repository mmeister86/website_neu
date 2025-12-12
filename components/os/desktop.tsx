"use client"

import type React from "react"

import { useState, useCallback } from "react"
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

const APP_CONFIG: Record<AppId, { title: string; defaultSize: { width: number; height: number } }> = {
  terminal: { title: "Terminal", defaultSize: { width: 700, height: 500 } },
  about: { title: "Über Mich", defaultSize: { width: 500, height: 450 } },
  projects: { title: "Projekte", defaultSize: { width: 600, height: 500 } },
  contact: { title: "Kontakt", defaultSize: { width: 400, height: 350 } },
  skills: { title: "Skills.exe", defaultSize: { width: 550, height: 480 } },
  files: { title: "Dateien", defaultSize: { width: 600, height: 450 } },
  settings: { title: "Settings", defaultSize: { width: 600, height: 500 } },
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

function DesktopContent() {
  const { wallpaper } = useOSContext()
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
        // Open new window
        const config = APP_CONFIG[appId]
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
            size: config.defaultSize,
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative select-none">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `var(--wallpaper-url, url('${wallpaper}'))`,
        }}
      />

      {/* Top Bar */}
      <TopBar />

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
