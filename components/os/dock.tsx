"use client"

import type React from "react"

import { Terminal, User, FolderKanban, Mail, Code2, FolderOpen } from "lucide-react"
import type { AppId, WindowState } from "./desktop"
import { cn } from "@/lib/utils"

interface DockProps {
  windows: WindowState[]
  onOpenApp: (appId: AppId) => void
}

const DOCK_ITEMS: { id: AppId; icon: React.ElementType; label: string }[] = [
  { id: "terminal", icon: Terminal, label: "Terminal" },
  { id: "about", icon: User, label: "Über Mich" },
  { id: "skills", icon: Code2, label: "Skills" },
  { id: "projects", icon: FolderKanban, label: "Projekte" },
  { id: "files", icon: FolderOpen, label: "Dateien" },
  { id: "contact", icon: Mail, label: "Kontakt" },
]

export function Dock({ windows, onOpenApp }: DockProps) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-1 px-2 py-1.5 bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-2xl">
        {DOCK_ITEMS.map((item) => {
          const isOpen = windows.some((w) => w.id === item.id && w.isOpen)
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onOpenApp(item.id)}
              className={cn(
                "group relative flex flex-col items-center p-2 rounded-xl transition-all duration-200",
                "hover:bg-white/10 hover:scale-125 hover:-translate-y-2",
                "active:scale-110",
              )}
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
                  "bg-gradient-to-br shadow-lg",
                  item.id === "terminal"
                    ? "from-gray-700 to-gray-900"
                    : item.id === "about"
                      ? "from-terminal-pink/80 to-terminal-pink"
                      : item.id === "skills"
                        ? "from-terminal-green/80 to-terminal-green"
                        : item.id === "projects"
                          ? "from-terminal-yellow/80 to-terminal-yellow"
                          : item.id === "files"
                            ? "from-terminal-cyan/80 to-terminal-cyan"
                            : "from-purple-500/80 to-purple-600",
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              {/* Tooltip */}
              <span className="absolute -top-8 px-2 py-1 bg-card rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border">
                {item.label}
              </span>
              {/* Open indicator */}
              {isOpen && <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-white/70" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
