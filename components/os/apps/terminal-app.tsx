"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"

type OutputLine = {
  type: "command" | "response" | "error" | "ascii" | "system"
  content: string
  colored?: { text: string; color: string }[]
}

const NEOFETCH_APPLE = [
  { text: "                    .:'", color: "text-green-400" },
  { text: "                .OMMMM'", color: "text-green-400" },
  { text: "              .OMMMMMM", color: "text-green-400" },
  { text: "             OMMMMMMMMM", color: "text-yellow-400" },
  { text: "            'MMMMMMMMMML", color: "text-yellow-400" },
  { text: "            MMMMMMMMMMM.", color: "text-orange-400" },
  { text: "            MMMMMMMMMMM'", color: "text-orange-400" },
  { text: "            'MMMMMMMMMM", color: "text-red-400" },
  { text: "             MMMMMMMMM'", color: "text-red-400" },
  { text: "              'MMMMMMM", color: "text-fuchsia-400" },
  { text: "               'MMMMM'", color: "text-fuchsia-400" },
  { text: "                 MMM'", color: "text-blue-400" },
  { text: "                  V", color: "text-cyan-400" },
]

const NEOFETCH_INFO = [
  { label: "", value: "matthias@chaos.quest", labelColor: "text-terminal-cyan", valueColor: "text-foreground" },
  { label: "", value: "─────────────────────", labelColor: "", valueColor: "text-muted-foreground" },
  { label: "OS", value: "MatthiasOS (macOS-basiert)", labelColor: "text-terminal-pink", valueColor: "text-foreground" },
  { label: "Host", value: "Deutschland", labelColor: "text-terminal-pink", valueColor: "text-foreground" },
  { label: "Kernel", value: "Kaffee 5.15.0-generic", labelColor: "text-terminal-pink", valueColor: "text-foreground" },
  { label: "Uptime", value: "~40 Jahre", labelColor: "text-terminal-pink", valueColor: "text-foreground" },
  { label: "Shell", value: "zsh 5.9 + oh-my-zsh", labelColor: "text-terminal-pink", valueColor: "text-foreground" },
  { label: "IDE", value: "VS Code / Neovim", labelColor: "text-terminal-pink", valueColor: "text-foreground" },
  { label: "Terminal", value: "MatthiasOS Terminal", labelColor: "text-terminal-pink", valueColor: "text-foreground" },
  {
    label: "CPU",
    value: "Brain @ ~3GHz (Kaffee-boosted)",
    labelColor: "text-terminal-pink",
    valueColor: "text-foreground",
  },
  { label: "Memory", value: "16GB / 32GB (50%)", labelColor: "text-terminal-pink", valueColor: "text-foreground" },
]

const INITIAL_OUTPUT: OutputLine[] = [
  { type: "system", content: "MatthiasOS Terminal v2.0" },
  { type: "system", content: "Tippe 'hilfe' für verfügbare Befehle." },
  { type: "system", content: "" },
]

const COMMANDS: Record<string, () => OutputLine[]> = {
  hilfe: () => [
    { type: "response", content: "" },
    { type: "response", content: "  VERFÜGBARE BEFEHLE:" },
    { type: "response", content: "  ─────────────────────────────────────" },
    { type: "response", content: "  neofetch    System-Info anzeigen" },
    { type: "response", content: "  whoami      Kurze Bio" },
    { type: "response", content: "  ls          Dateien auflisten" },
    { type: "response", content: "  cat         Datei lesen" },
    { type: "response", content: "  clear       Terminal leeren" },
    { type: "response", content: "  chaos       ???" },
    { type: "response", content: "" },
  ],
  help: () => COMMANDS.hilfe(),
  neofetch: () => {
    const lines: OutputLine[] = [{ type: "response", content: "" }]
    NEOFETCH_APPLE.forEach((appleLine, i) => {
      const info = NEOFETCH_INFO[i]
      if (info) {
        lines.push({
          type: "response",
          content: "",
          colored: [
            { text: appleLine.text.padEnd(28), color: appleLine.color },
            { text: info.label ? `${info.label}: ` : "", color: info.labelColor },
            { text: info.value, color: info.valueColor },
          ],
        })
      } else {
        lines.push({
          type: "response",
          content: "",
          colored: [{ text: appleLine.text, color: appleLine.color }],
        })
      }
    })
    lines.push({ type: "response", content: "" })
    return lines
  },
  whoami: () => [
    { type: "response", content: "" },
    { type: "response", content: "  Matthias - Software Engineer & Digital Chaos Architect" },
    { type: "response", content: "  Baut Dinge die (meistens) funktionieren." },
    { type: "response", content: "" },
  ],
  ls: () => [
    { type: "response", content: "  drwxr-xr-x  projekte/" },
    { type: "response", content: "  drwxr-xr-x  skills/" },
    { type: "response", content: "  -rw-r--r--  README.md" },
    { type: "response", content: "  -rw-r--r--  .secrets (Permission denied)" },
  ],
  cat: () => [
    { type: "response", content: "" },
    { type: "response", content: "        /\\_/\\  " },
    { type: "response", content: "       ( o.o ) " },
    { type: "response", content: "        > ^ <  Miau!" },
    { type: "response", content: "" },
  ],
  clear: () => [],
  chaos: () => [
    { type: "error", content: "  ⚠ CHAOS MODUS AKTIVIERT" },
    { type: "response", content: "" },
    { type: "response", content: '  "In einer Welt voller Bugs, sei ein Feature."' },
    { type: "response", content: "                              - Matthias" },
    { type: "response", content: "" },
  ],
  sudo: () => [{ type: "error", content: "  Netter Versuch. Du bist nicht im sudoers file." }],
  pwd: () => [{ type: "response", content: "  /home/matthias" }],
  date: () => [{ type: "response", content: `  ${new Date().toLocaleString("de-DE")}` }],
}

export function TerminalApp() {
  const [output, setOutput] = useState<OutputLine[]>(INITIAL_OUTPUT)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [output])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    setHistory((h) => [...h, trimmed])
    setHistoryIndex(-1)

    const commandOutput: OutputLine = { type: "command", content: cmd }

    if (trimmed === "clear") {
      setOutput([])
      setInput("")
      return
    }

    const cmdFn = COMMANDS[trimmed.split(" ")[0]]
    if (cmdFn) {
      setOutput((prev) => [...prev, commandOutput, ...cmdFn()])
    } else {
      setOutput((prev) => [...prev, commandOutput, { type: "error", content: `  Befehl nicht gefunden: ${trimmed}` }])
    }
    setInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[history.length - 1 - newIndex])
      } else {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  return (
    <div
      className="h-full bg-background p-3 font-mono text-sm overflow-y-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
      ref={scrollRef}
    >
      {output.map((line, i) => (
        <div key={i} className="leading-relaxed">
          {line.type === "command" ? (
            <div className="flex gap-2">
              <span>
                <span className="text-terminal-cyan">matthias</span>
                <span className="text-muted-foreground">@</span>
                <span className="text-terminal-pink">os</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-terminal-yellow">~</span>
                <span className="text-muted-foreground">$</span>
              </span>
              <span className="text-foreground">{line.content}</span>
            </div>
          ) : line.colored ? (
            <pre className="whitespace-pre">
              {line.colored.map((seg, j) => (
                <span key={j} className={seg.color}>
                  {seg.text}
                </span>
              ))}
            </pre>
          ) : (
            <pre
              className={
                line.type === "error"
                  ? "text-terminal-pink whitespace-pre-wrap"
                  : line.type === "system"
                    ? "text-terminal-dim whitespace-pre-wrap"
                    : "text-foreground whitespace-pre-wrap"
              }
            >
              {line.content}
            </pre>
          )}
        </div>
      ))}

      {/* Input line */}
      <div className="flex gap-2 items-center">
        <span>
          <span className="text-terminal-cyan">matthias</span>
          <span className="text-muted-foreground">@</span>
          <span className="text-terminal-pink">os</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-terminal-yellow">~</span>
          <span className="text-muted-foreground">$</span>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-foreground caret-terminal-pink"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
