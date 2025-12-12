"use client"

import { forwardRef, type KeyboardEvent } from "react"

interface TerminalInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(({ value, onChange, onKeyDown }, ref) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-terminal-green shrink-0">
        <span className="text-terminal-cyan">matthias</span>
        <span className="text-muted-foreground">@</span>
        <span className="text-terminal-pink">chaos</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-terminal-yellow">~</span>
        <span className="text-muted-foreground">$</span>
      </span>
      <div className="flex-1 relative">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent border-none outline-none text-foreground font-mono text-sm caret-terminal-pink"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Terminal-Eingabe"
        />
        {!value && <span className="absolute left-0 top-0 text-terminal-pink cursor-blink">▋</span>}
      </div>
    </div>
  )
})

TerminalInput.displayName = "TerminalInput"
