"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { TerminalHeader } from "./terminal-header"
import { TerminalOutput } from "./terminal-output"
import { TerminalInput } from "./terminal-input"

export type OutputLine = {
  type: "command" | "response" | "error" | "ascii" | "system"
  content: string
  timestamp?: string
}

const INITIAL_OUTPUT: OutputLine[] = [
  { type: "system", content: "Verbindung hergestellt zu matthias.lol..." },
  { type: "system", content: "Authentifizierung: ÖFFENTLICH" },
  { type: "system", content: "" },
  {
    type: "ascii",
    content: `
███╗   ███╗ █████╗ ████████╗████████╗██╗  ██╗██╗ █████╗ ███████╗
████╗ ████║██╔══██╗╚══██╔══╝╚══██╔══╝██║  ██║██║██╔══██╗██╔════╝
██╔████╔██║███████║   ██║      ██║   ███████║██║███████║███████╗
██║╚██╔╝██║██╔══██║   ██║      ██║   ██╔══██║██║██╔══██║╚════██║
██║ ╚═╝ ██║██║  ██║   ██║      ██║   ██║  ██║██║██║  ██║███████║
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝`,
  },
  { type: "system", content: "" },
  { type: "system", content: "                    ╔══════════════════════════════╗" },
  { type: "system", content: "                    ║       CHAOS QUEST v2.0       ║" },
  { type: "system", content: "                    ║    Software Engineer Shell   ║" },
  { type: "system", content: "                    ╚══════════════════════════════╝" },
  { type: "system", content: "" },
  { type: "response", content: "Willkommen, Fremder. Du hast mein Terminal gefunden." },
  { type: "response", content: "Tippe 'hilfe' für verfügbare Befehle oder erkunde selbst." },
  { type: "system", content: "" },
]

const COMMANDS: Record<string, () => OutputLine[]> = {
  hilfe: () => [
    { type: "response", content: "╔════════════════════════════════════════════════════════════╗" },
    { type: "response", content: "║  VERFÜGBARE BEFEHLE                                        ║" },
    { type: "response", content: "╠════════════════════════════════════════════════════════════╣" },
    { type: "response", content: "║  whoami      → Wer ist dieser Matthias überhaupt?          ║" },
    { type: "response", content: "║  skills      → Technische Fähigkeiten auflisten            ║" },
    { type: "response", content: "║  projekte    → Ausgewählte Arbeiten anzeigen               ║" },
    { type: "response", content: "║  erfahrung   → Beruflicher Werdegang                       ║" },
    { type: "response", content: "║  kontakt     → Kommunikationskanäle                        ║" },
    { type: "response", content: "║  neofetch    → System-Info im Hacker-Style                 ║" },
    { type: "response", content: "║  clear       → Terminal leeren                             ║" },
    { type: "response", content: "║  chaos       → ???                                         ║" },
    { type: "response", content: "╚════════════════════════════════════════════════════════════╝" },
  ],
  help: () => COMMANDS.hilfe(),

  whoami: () => [
    { type: "response", content: "" },
    { type: "response", content: "  ┌─────────────────────────────────────────────────────────┐" },
    { type: "response", content: "  │  MATTHIAS                                               │" },
    { type: "response", content: "  │  Software Engineer · Digitaler Chaosarchitekt           │" },
    { type: "response", content: "  └─────────────────────────────────────────────────────────┘" },
    { type: "response", content: "" },
    { type: "response", content: "  Ich baue Dinge, die manchmal funktionieren." },
    { type: "response", content: "  Meistens sogar beim ersten Mal. (Lüge)" },
    { type: "response", content: "" },
    { type: "response", content: "  Tagsüber: Code schreiben, Bugs jagen, Kaffee trinken" },
    { type: "response", content: "  Nachts: Mehr Code schreiben, mehr Bugs erschaffen" },
    { type: "response", content: "" },
    { type: "response", content: '  Philosophie: "Es kompiliert? Ship it."' },
    { type: "response", content: "" },
  ],

  skills: () => [
    { type: "response", content: "" },
    { type: "response", content: "  ╭──────────────────────────────────────────────────────────╮" },
    { type: "response", content: "  │  TECHNISCHE FÄHIGKEITEN                                  │" },
    { type: "response", content: "  ╰──────────────────────────────────────────────────────────╯" },
    { type: "response", content: "" },
    { type: "response", content: "  SPRACHEN" },
    { type: "response", content: "  ─────────────────────────────────────────────────────────" },
    { type: "response", content: "  TypeScript  ████████████████████████░░  95%  (Lieblingssprache)" },
    { type: "response", content: "  JavaScript  ████████████████████████░░  92%  (Der Ursprung)" },
    { type: "response", content: "  Python      ██████████████████░░░░░░░░  75%  (Für Skripte)" },
    { type: "response", content: "  Rust        ████████████░░░░░░░░░░░░░░  50%  (Lerne noch)" },
    { type: "response", content: "  Go          ██████████░░░░░░░░░░░░░░░░  42%  (Gopher-Phase)" },
    { type: "response", content: "" },
    { type: "response", content: "  FRAMEWORKS & TOOLS" },
    { type: "response", content: "  ─────────────────────────────────────────────────────────" },
    { type: "response", content: "  React/Next.js   ████████████████████████  (Im Schlaf)" },
    { type: "response", content: "  Node.js         ████████████████████████  (Serverseitig)" },
    { type: "response", content: "  PostgreSQL      ██████████████████░░░░░░  (Relationale Liebe)" },
    { type: "response", content: "  Docker          ██████████████████░░░░░░  (Container-Magie)" },
    { type: "response", content: "  Linux           ██████████████████████░░  (BTW I use Arch)" },
    { type: "response", content: "" },
  ],

  projekte: () => [
    { type: "response", content: "" },
    { type: "response", content: "  ╔══════════════════════════════════════════════════════════╗" },
    { type: "response", content: "  ║  AUSGEWÄHLTE PROJEKTE                                    ║" },
    { type: "response", content: "  ╚══════════════════════════════════════════════════════════╝" },
    { type: "response", content: "" },
    { type: "response", content: "  [01] CHAOS QUEST" },
    { type: "response", content: "       ├─ Diese Website hier. Meta, oder?" },
    { type: "response", content: "       ├─ Stack: Next.js, TypeScript, Tailwind" },
    { type: "response", content: "       └─ Status: Du benutzt es gerade" },
    { type: "response", content: "" },
    { type: "response", content: "  [02] GEHEIMES PROJEKT X" },
    { type: "response", content: "       ├─ Kann ich nicht drüber reden" },
    { type: "response", content: "       ├─ Stack: [ZENSIERT]" },
    { type: "response", content: "       └─ Status: In Entwicklung (ewig)" },
    { type: "response", content: "" },
    { type: "response", content: "  [03] OPEN SOURCE BEITRÄGE" },
    { type: "response", content: "       ├─ Diverse PRs hier und da" },
    { type: "response", content: "       ├─ Meistens Typo-Fixes (auch wichtig!)" },
    { type: "response", content: "       └─ Status: Kontinuierlich" },
    { type: "response", content: "" },
    { type: "response", content: "  → Mehr auf GitHub: github.com/matthias" },
    { type: "response", content: "" },
  ],

  erfahrung: () => [
    { type: "response", content: "" },
    { type: "response", content: "  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓" },
    { type: "response", content: "  ┃  BERUFLICHE TIMELINE                                   ┃" },
    { type: "response", content: "  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛" },
    { type: "response", content: "" },
    { type: "response", content: "  2024 - JETZT" },
    { type: "response", content: "  ══════════════════════════════════════════════════════" },
    { type: "response", content: "  Senior Software Engineer @ [Coole Firma]" },
    { type: "response", content: "  → Architektur von Microservices" },
    { type: "response", content: "  → Team-Lead für Frontend-Entwicklung" },
    { type: "response", content: "  → Zu viele Meetings" },
    { type: "response", content: "" },
    { type: "response", content: "  2021 - 2024" },
    { type: "response", content: "  ══════════════════════════════════════════════════════" },
    { type: "response", content: "  Software Engineer @ [Startup]" },
    { type: "response", content: "  → Full-Stack Development" },
    { type: "response", content: "  → Von 0 auf MVP in 3 Monaten" },
    { type: "response", content: "  → Viel Pizza gegessen" },
    { type: "response", content: "" },
    { type: "response", content: "  2019 - 2021" },
    { type: "response", content: "  ══════════════════════════════════════════════════════" },
    { type: "response", content: "  Junior Developer @ [Erste Firma]" },
    { type: "response", content: "  → Hier fing alles an" },
    { type: "response", content: "  → Gelernt, dass Prod anders ist als Dev" },
    { type: "response", content: "" },
  ],

  kontakt: () => [
    { type: "response", content: "" },
    { type: "response", content: "  ╔════════════════════════════════════════════════════════╗" },
    { type: "response", content: "  ║  KOMMUNIKATIONSKANÄLE                                  ║" },
    { type: "response", content: "  ╚════════════════════════════════════════════════════════╝" },
    { type: "response", content: "" },
    { type: "response", content: "  📧  E-MAIL" },
    { type: "response", content: "      └─ hallo@matthias.lol" },
    { type: "response", content: "" },
    { type: "response", content: "  🐙  GITHUB" },
    { type: "response", content: "      └─ github.com/matthias" },
    { type: "response", content: "" },
    { type: "response", content: "  💼  LINKEDIN" },
    { type: "response", content: "      └─ linkedin.com/in/matthias" },
    { type: "response", content: "" },
    { type: "response", content: "  🐦  X/TWITTER" },
    { type: "response", content: "      └─ @matthias" },
    { type: "response", content: "" },
    { type: "response", content: "  ⚡ Antwortzeit: Meist innerhalb 24-48 Stunden" },
    { type: "response", content: "     (außer ich debugge gerade, dann nie)" },
    { type: "response", content: "" },
  ],

  neofetch: () => [
    { type: "response", content: "" },
    { type: "response", content: "                    .:'          matthias@chaos.quest" },
    { type: "response", content: "                __ :'__         ─────────────────────" },
    { type: "response", content: "             .'`__`-'__``.      OS: macOS (Human Edition)" },
    { type: "response", content: "            :__________.-'      Host: Deutschland" },
    { type: "response", content: "            :_________:         Kernel: Kaffee-basiert" },
    { type: "response", content: "             :_________`-;      Uptime: ~40 Jahre" },
    { type: "response", content: "              `.__.-.__.'       Packages: zu viele node_modules" },
    { type: "response", content: "                                Shell: zsh + oh-my-zsh" },
    { type: "response", content: "                                IDE: VS Code (manchmal Vim)" },
    { type: "response", content: "                                Terminal: Wezterm" },
    { type: "response", content: "                                CPU: Gehirn @ ~3GHz" },
    { type: "response", content: "                                Memory: 32GB RAM (nie genug)" },
    { type: "response", content: "                                Disk: Stack Overflow Cache" },
    { type: "response", content: "" },
  ],

  chaos: () => [
    { type: "response", content: "" },
    { type: "error", content: "  ⚠️  WARNUNG: CHAOS-MODUS AKTIVIERT ⚠️" },
    { type: "response", content: "" },
    { type: "response", content: "  Du hast das Easter Egg gefunden! 🎉" },
    { type: "response", content: "" },
    { type: "response", content: "  Fun Facts über mich:" },
    { type: "response", content: "  • Mein erster Code war in BASIC auf einem C64" },
    { type: "response", content: "  • Ich debugge am besten um 3 Uhr nachts" },
    { type: "response", content: "  • Tabs > Spaces (fight me)" },
    { type: "response", content: "  • Meine .vimrc ist älter als manche Praktikanten" },
    { type: "response", content: "  • Ich habe mal einen Bug 6 Monate gesucht - " },
    { type: "response", content: "    es war ein fehlender Semikolon (╯°□°)╯︵ ┻━┻" },
    { type: "response", content: "" },
    {
      type: "ascii",
      content: `
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║   "In einer Welt voller Bugs,                     ║
    ║    sei ein Feature."                              ║
    ║                                                   ║
    ║                            - Matthias, vermutlich ║
    ╚═══════════════════════════════════════════════════╝`,
    },
    { type: "response", content: "" },
  ],

  clear: () => [],

  sudo: () => [
    { type: "error", content: "  Netter Versuch. 😏" },
    { type: "response", content: "  Du bist nicht im sudoers File. Dieser Vorfall wird gemeldet." },
  ],

  rm: () => [
    { type: "error", content: "  HALT STOP! Das geht zu weit!" },
    { type: "response", content: "  (Keine Sorge, hier kann nichts kaputt gehen)" },
  ],

  exit: () => [
    { type: "response", content: "  Logout? Wohin willst du denn gehen?" },
    { type: "response", content: "  Das Internet ist überall. Es gibt kein Entkommen. 👁️" },
  ],

  ls: () => [
    { type: "response", content: "  drwxr-xr-x  chaos/      - Der Quellcode des Universums" },
    { type: "response", content: "  -rw-r--r--  .secrets    - Nice try" },
    { type: "response", content: "  drwxr-xr-x  projekte/   - Siehe 'projekte'" },
    { type: "response", content: "  -rw-r--r--  README.md   - TODO: README schreiben" },
  ],

  cat: () => [
    { type: "response", content: "" },
    { type: "response", content: "        /\\_/\\  " },
    { type: "response", content: "       ( o.o ) " },
    { type: "response", content: "        > ^ <  Miau?" },
    { type: "response", content: "" },
    { type: "response", content: "  (Falsche cat. Aber hier ist trotzdem eine Katze.)" },
  ],

  cd: () => [{ type: "response", content: "  Du bist schon da, wo du sein sollst. 🏠" }],

  pwd: () => [{ type: "response", content: "  /home/matthias/chaos-quest" }],

  date: () => [
    {
      type: "response",
      content: `  ${new Date().toLocaleString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`,
    },
  ],

  ping: () => [
    { type: "response", content: "  PING matthias.lol (127.0.0.1): 56 data bytes" },
    { type: "response", content: "  64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms" },
    { type: "response", content: "  64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.069 ms" },
    { type: "response", content: "  64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.420 ms (nice)" },
    { type: "response", content: "" },
    { type: "response", content: "  --- matthias.lol ping statistics ---" },
    { type: "response", content: "  3 packets transmitted, 3 packets received, 0.0% packet loss" },
  ],

  coffee: () => [
    { type: "response", content: "" },
    { type: "response", content: "     ( (" },
    { type: "response", content: "      ) )" },
    { type: "response", content: "    ........" },
    { type: "response", content: "    |      |]" },
    { type: "response", content: "    \\      /" },
    { type: "response", content: "     `----'" },
    { type: "response", content: "" },
    { type: "response", content: "  ☕ Kaffee wird gebrüht... FEHLER: Tasse leer" },
    { type: "response", content: "  → Bitte physische Kaffeemaschine verwenden" },
  ],

  matrix: () => [
    { type: "response", content: "" },
    { type: "response", content: "  Wake up, Neo..." },
    { type: "response", content: "  The Matrix has you..." },
    { type: "response", content: "" },
    { type: "response", content: "  Follow the white rabbit. 🐇" },
    { type: "response", content: "" },
    { type: "response", content: "  (Oder tippe einfach 'hilfe' für echte Befehle)" },
  ],
}

export function Terminal() {
  const [output, setOutput] = useState<OutputLine[]>(INITIAL_OUTPUT)
  const [currentCommand, setCurrentCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    if (!trimmedCmd) return

    // Add command to history
    setCommandHistory((prev) => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    // Add the command to output
    const commandOutput: OutputLine = {
      type: "command",
      content: cmd,
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    }

    if (trimmedCmd === "clear") {
      setOutput([])
      setCurrentCommand("")
      return
    }

    const commandFn = COMMANDS[trimmedCmd.split(" ")[0]]

    if (commandFn) {
      setOutput((prev) => [...prev, commandOutput, ...commandFn()])
    } else {
      setOutput((prev) => [
        ...prev,
        commandOutput,
        { type: "error", content: `  Befehl nicht gefunden: ${trimmedCmd}` },
        { type: "response", content: "  Tippe 'hilfe' für eine Liste der verfügbaren Befehle." },
      ])
    }

    setCurrentCommand("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(currentCommand)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || "")
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentCommand("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion
      const availableCommands = Object.keys(COMMANDS)
      const matches = availableCommands.filter((c) => c.startsWith(currentCommand.toLowerCase()))
      if (matches.length === 1) {
        setCurrentCommand(matches[0])
      }
    }
  }

  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto p-2 sm:p-4">
      <TerminalHeader />
      <div
        ref={terminalRef}
        onClick={handleTerminalClick}
        className="flex-1 overflow-y-auto bg-card border border-border rounded-b-md p-4 cursor-text"
      >
        <TerminalOutput output={output} />
        <TerminalInput ref={inputRef} value={currentCommand} onChange={setCurrentCommand} onKeyDown={handleKeyDown} />
      </div>
    </div>
  )
}
