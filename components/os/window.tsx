"use client"

import { useState, useRef, useEffect, type ReactNode, type MouseEvent } from "react"
import { X, Minus, Square } from "lucide-react"
import type { WindowState } from "./desktop"
import { cn } from "@/lib/utils"

interface WindowProps {
  window: WindowState
  children: ReactNode
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  onMove: (position: { x: number; y: number }) => void
  onResize: (size: { width: number; height: number }) => void
}

export function Window({
  window: win,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const MIN_WIDTH = 300
  const MIN_HEIGHT = 200

  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return
    onFocus()
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y,
    })
  }

  const handleResizeStart = (e: MouseEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: win.size.width,
      height: win.size.height,
      posX: win.position.x,
      posY: win.position.y,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        onMove({
          x: Math.max(0, e.clientX - dragOffset.x),
          y: Math.max(28, e.clientY - dragOffset.y),
        })
      }

      if (isResizing && resizeDirection) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y

        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = resizeStart.posX
        let newY = resizeStart.posY

        if (resizeDirection.includes("e")) {
          newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX)
        }
        if (resizeDirection.includes("w")) {
          const potentialWidth = resizeStart.width - deltaX
          if (potentialWidth >= MIN_WIDTH) {
            newWidth = potentialWidth
            newX = resizeStart.posX + deltaX
          }
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY)
        }
        if (resizeDirection.includes("n")) {
          const potentialHeight = resizeStart.height - deltaY
          if (potentialHeight >= MIN_HEIGHT) {
            newHeight = potentialHeight
            newY = resizeStart.posY + deltaY
          }
        }

        onResize({ width: newWidth, height: newHeight })
        if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
          onMove({ x: Math.max(0, newX), y: Math.max(28, newY) })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeDirection, resizeStart, onMove, onResize])

  const ResizeHandle = ({ direction, className }: { direction: string; className: string }) => (
    <div className={cn("absolute z-10", className)} onMouseDown={(e) => handleResizeStart(e, direction)} />
  )

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute rounded-lg overflow-hidden shadow-2xl border border-white/20",
        "backdrop-blur-xl flex flex-col",
        isDragging && "cursor-grabbing",
        win.isMaximized && "rounded-none",
      )}
      style={{
        left: win.isMaximized ? 0 : win.position.x,
        top: win.isMaximized ? 28 : win.position.y,
        width: win.isMaximized ? "100%" : win.size.width,
        height: win.isMaximized ? "calc(100% - 28px - 70px)" : win.size.height,
        zIndex: win.zIndex,
        backgroundColor: "rgba(20, 20, 35, 0.8)",
      }}
      onMouseDown={onFocus}
    >
      {!win.isMaximized && (
        <>
          {/* Edge handles */}
          <ResizeHandle direction="n" className="top-0 left-2 right-2 h-1 cursor-n-resize" />
          <ResizeHandle direction="s" className="bottom-0 left-2 right-2 h-1 cursor-s-resize" />
          <ResizeHandle direction="e" className="right-0 top-2 bottom-2 w-1 cursor-e-resize" />
          <ResizeHandle direction="w" className="left-0 top-2 bottom-2 w-1 cursor-w-resize" />
          {/* Corner handles */}
          <ResizeHandle direction="nw" className="top-0 left-0 w-2 h-2 cursor-nw-resize" />
          <ResizeHandle direction="ne" className="top-0 right-0 w-2 h-2 cursor-ne-resize" />
          <ResizeHandle direction="sw" className="bottom-0 left-0 w-2 h-2 cursor-sw-resize" />
          <ResizeHandle direction="se" className="bottom-0 right-0 w-2 h-2 cursor-se-resize" />
        </>
      )}

      {/* Title bar */}
      <div
        className="h-8 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing shrink-0"
        style={{
          backgroundColor: "rgba(30, 30, 50, 0.7)",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        {/* Window controls */}
        <div className="window-controls flex items-center gap-1.5">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group"
          >
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group"
          >
            <Square className="w-1.5 h-1.5 text-green-900 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        {/* Title */}
        <span className="text-xs text-muted-foreground font-medium absolute left-1/2 -translate-x-1/2">
          {win.title}
        </span>
        <div className="w-14" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
