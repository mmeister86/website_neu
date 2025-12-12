"use client"

import type React from "react"

import { useState } from "react"
import { Folder, FileText, FileCode, ImageIcon, ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

type FileItem = {
  name: string
  type: "folder" | "file"
  icon?: React.ElementType
  content?: string
  children?: FileItem[]
}

const FILE_SYSTEM: FileItem[] = [
  {
    name: "projekte",
    type: "folder",
    children: [
      {
        name: "chaos-quest",
        type: "folder",
        children: [
          { name: "README.md", type: "file", icon: FileText, content: "# Chaos Quest\n\nDiese Website." },
          { name: "package.json", type: "file", icon: FileCode, content: '{\n  "name": "chaos-quest"\n}' },
        ],
      },
      {
        name: "secret-project",
        type: "folder",
        children: [{ name: ".gitignore", type: "file", icon: FileText, content: "node_modules/\n.env" }],
      },
    ],
  },
  {
    name: "bilder",
    type: "folder",
    children: [
      { name: "avatar.png", type: "file", icon: ImageIcon, content: "[Bild]" },
      { name: "screenshot.png", type: "file", icon: ImageIcon, content: "[Bild]" },
    ],
  },
  { name: "README.md", type: "file", icon: FileText, content: "# Home\n\nWillkommen im Home-Verzeichnis." },
  { name: ".zshrc", type: "file", icon: FileCode, content: 'export ZSH="$HOME/.oh-my-zsh"\nZSH_THEME="agnoster"' },
  { name: ".secrets", type: "file", icon: FileText, content: "Nice try! 😏" },
]

export function FileManagerApp() {
  const [path, setPath] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const getCurrentItems = () => {
    let items = FILE_SYSTEM
    for (const p of path) {
      const folder = items.find((i) => i.name === p && i.type === "folder")
      if (folder?.children) {
        items = folder.children
      }
    }
    return items
  }

  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      setPath([...path, item.name])
      setSelectedFile(null)
    } else {
      setSelectedFile(item)
    }
  }

  const goHome = () => {
    setPath([])
    setSelectedFile(null)
  }

  const goToPath = (index: number) => {
    setPath(path.slice(0, index + 1))
    setSelectedFile(null)
  }

  const items = getCurrentItems()

  return (
    <div className="h-full bg-transparent flex flex-col">
      {/* Toolbar */}
      <div className="p-2 border-b border-border flex items-center gap-2 bg-card/50">
        <button onClick={goHome} className="p-1.5 hover:bg-secondary rounded transition-colors">
          <Home className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-1 text-sm">
          <button onClick={goHome} className="text-muted-foreground hover:text-foreground">
            ~
          </button>
          {path.map((p, i) => (
            <div key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-terminal-dim" />
              <button onClick={() => goToPath(i)} className="text-muted-foreground hover:text-foreground">
                {p}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File list */}
        <div className="flex-1 p-2 overflow-y-auto">
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => {
              const Icon = item.type === "folder" ? Folder : item.icon || FileText
              return (
                <button
                  key={item.name}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-secondary/50 transition-colors",
                    selectedFile?.name === item.name && "bg-terminal-pink/20",
                  )}
                >
                  <Icon
                    className={cn("w-8 h-8", item.type === "folder" ? "text-terminal-cyan" : "text-terminal-dim")}
                  />
                  <span className="text-xs text-foreground truncate max-w-full">{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Preview panel */}
        {selectedFile && (
          <div className="w-48 border-l border-border p-3 bg-card/30">
            <h3 className="text-sm font-medium text-foreground mb-2 truncate">{selectedFile.name}</h3>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">{selectedFile.content}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
