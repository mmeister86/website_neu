"use client"

import { useState, useCallback, useEffect } from "react"

interface SelectionBox {
  startX: number
  startY: number
  currentX: number
  currentY: number
}

interface UseSelectionReturn {
  isSelecting: boolean
  selectionBox: SelectionBox | null
  selectionStyle: React.CSSProperties | null
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void
  }
}

export function useSelection(): UseSelectionReturn {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start selection if clicking directly on the target element
    if (e.target !== e.currentTarget) return

    // Only react to left mouse button
    if (e.button !== 0) return

    const startX = e.clientX
    const startY = e.clientY

    setIsSelecting(true)
    setSelectionBox({
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    })
  }, [])

  useEffect(() => {
    if (!isSelecting) return

    const handleMouseMove = (e: MouseEvent) => {
      setSelectionBox((prev) => {
        if (!prev) return null
        return {
          ...prev,
          currentX: e.clientX,
          currentY: e.clientY,
        }
      })
    }

    const handleMouseUp = () => {
      setIsSelecting(false)
      setSelectionBox(null)
    }

    // Add listeners to window to catch events even outside the element
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isSelecting])

  // Calculate the selection rectangle style
  const selectionStyle: React.CSSProperties | null = selectionBox
    ? {
        position: "fixed",
        left: Math.min(selectionBox.startX, selectionBox.currentX),
        top: Math.min(selectionBox.startY, selectionBox.currentY),
        width: Math.abs(selectionBox.currentX - selectionBox.startX),
        height: Math.abs(selectionBox.currentY - selectionBox.startY),
        pointerEvents: "none",
      }
    : null

  return {
    isSelecting,
    selectionBox,
    selectionStyle,
    handlers: {
      onMouseDown,
    },
  }
}
