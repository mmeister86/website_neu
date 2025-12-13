"use client"

import { useState, useEffect } from "react"
import { Wifi, Battery, Volume2, Apple } from "lucide-react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar"
import type { AppId } from "./desktop"

interface TopBarProps {
  onOpenApp?: (appId: AppId) => void
  onCloseActiveWindow?: () => void
  onMinimizeActiveWindow?: () => void
  onMaximizeActiveWindow?: () => void
  activeApp?: string
}

export function TopBar({
  onOpenApp,
  onCloseActiveWindow,
  onMinimizeActiveWindow,
  onMaximizeActiveWindow,
  activeApp = "Finder",
}: TopBarProps) {
  const [time, setTime] = useState(new Date())
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute top-0 left-0 right-0 h-7 bg-card/90 backdrop-blur-sm border-b border-border flex items-center justify-between px-2 z-50">
      {/* Left side - Menubar */}
      <Menubar className="border-none bg-transparent shadow-none h-7 p-0 gap-0 rounded-none">
        {/* Apple/MatthiasOS Menu */}
        <MenubarMenu>
          <MenubarTrigger className="text-sm px-2 py-0.5 h-6 font-bold text-terminal-pink data-[state=open]:bg-primary/20 rounded-sm">

          </MenubarTrigger>
          <MenubarContent className="bg-card/95 backdrop-blur-md border-border min-w-[200px]">
            <MenubarItem onClick={() => onOpenApp?.("about")}>
              Über MatthiasOS
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => onOpenApp?.("settings")}>
              Systemeinstellungen...
              <MenubarShortcut>⌘,</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Ruhezustand
            </MenubarItem>
            <MenubarItem disabled>
              Neustart...
            </MenubarItem>
            <MenubarItem disabled>
              Ausschalten...
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Active App Name (bold) */}
        <MenubarMenu>
          <MenubarTrigger className="text-xs px-2 py-0.5 h-6 font-semibold text-foreground data-[state=open]:bg-primary/20 rounded-sm">
            {activeApp}
          </MenubarTrigger>
          <MenubarContent className="bg-card/95 backdrop-blur-md border-border">
            <MenubarItem onClick={() => onOpenApp?.("about")}>
              Über {activeApp}
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              {activeApp} ausblenden
              <MenubarShortcut>⌘H</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Andere ausblenden
              <MenubarShortcut>⌥⌘H</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Alle einblenden
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={onCloseActiveWindow} variant="destructive">
              {activeApp} beenden
              <MenubarShortcut>⌘Q</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Datei Menu */}
        <MenubarMenu>
          <MenubarTrigger className="text-xs px-2 py-0.5 h-6 text-muted-foreground data-[state=open]:bg-primary/20 data-[state=open]:text-foreground hover:text-foreground rounded-sm">
            Datei
          </MenubarTrigger>
          <MenubarContent className="bg-card/95 backdrop-blur-md border-border">
            <MenubarItem onClick={() => onOpenApp?.("terminal")}>
              Neues Terminal
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => onOpenApp?.("files")}>
              Neues Finder-Fenster
              <MenubarShortcut>⇧⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Öffnen</MenubarSubTrigger>
              <MenubarSubContent className="bg-card/95 backdrop-blur-md border-border">
                <MenubarItem onClick={() => onOpenApp?.("terminal")}>
                  Terminal
                </MenubarItem>
                <MenubarItem onClick={() => onOpenApp?.("files")}>
                  Dateien
                </MenubarItem>
                <MenubarItem onClick={() => onOpenApp?.("projects")}>
                  Projekte
                </MenubarItem>
                <MenubarItem onClick={() => onOpenApp?.("skills")}>
                  Skills
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem onClick={onCloseActiveWindow}>
              Fenster schließen
              <MenubarShortcut>⌘W</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Bearbeiten Menu */}
        <MenubarMenu>
          <MenubarTrigger className="text-xs px-2 py-0.5 h-6 text-muted-foreground data-[state=open]:bg-primary/20 data-[state=open]:text-foreground hover:text-foreground rounded-sm">
            Bearbeiten
          </MenubarTrigger>
          <MenubarContent className="bg-card/95 backdrop-blur-md border-border">
            <MenubarItem disabled>
              Widerrufen
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Wiederholen
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Ausschneiden
              <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Kopieren
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Einfügen
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              Alles auswählen
              <MenubarShortcut>⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Suchen</MenubarSubTrigger>
              <MenubarSubContent className="bg-card/95 backdrop-blur-md border-border">
                <MenubarItem disabled>
                  Suchen...
                  <MenubarShortcut>⌘F</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>
                  Weitersuchen
                  <MenubarShortcut>⌘G</MenubarShortcut>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>

        {/* Ansicht Menu */}
        <MenubarMenu>
          <MenubarTrigger className="text-xs px-2 py-0.5 h-6 text-muted-foreground data-[state=open]:bg-primary/20 data-[state=open]:text-foreground hover:text-foreground rounded-sm">
            Ansicht
          </MenubarTrigger>
          <MenubarContent className="bg-card/95 backdrop-blur-md border-border">
            <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
              Seitenleiste anzeigen
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Vollbild
              <MenubarShortcut>⌃⌘F</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Zoom</MenubarSubTrigger>
              <MenubarSubContent className="bg-card/95 backdrop-blur-md border-border">
                <MenubarItem disabled>
                  Vergrößern
                  <MenubarShortcut>⌘+</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>
                  Verkleinern
                  <MenubarShortcut>⌘-</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>
                  Tatsächliche Größe
                  <MenubarShortcut>⌘0</MenubarShortcut>
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>

        {/* Fenster Menu */}
        <MenubarMenu>
          <MenubarTrigger className="text-xs px-2 py-0.5 h-6 text-muted-foreground data-[state=open]:bg-primary/20 data-[state=open]:text-foreground hover:text-foreground rounded-sm">
            Fenster
          </MenubarTrigger>
          <MenubarContent className="bg-card/95 backdrop-blur-md border-border">
            <MenubarItem onClick={onMinimizeActiveWindow}>
              Minimieren
              <MenubarShortcut>⌘M</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onMaximizeActiveWindow}>
              Maximieren
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              Alle nach vorne bringen
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Fenster anordnen</MenubarSubTrigger>
              <MenubarSubContent className="bg-card/95 backdrop-blur-md border-border">
                <MenubarItem disabled>
                  Links
                </MenubarItem>
                <MenubarItem disabled>
                  Rechts
                </MenubarItem>
                <MenubarItem disabled>
                  Kacheln
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>

        {/* Hilfe Menu */}
        <MenubarMenu>
          <MenubarTrigger className="text-xs px-2 py-0.5 h-6 text-muted-foreground data-[state=open]:bg-primary/20 data-[state=open]:text-foreground hover:text-foreground rounded-sm">
            Hilfe
          </MenubarTrigger>
          <MenubarContent className="bg-card/95 backdrop-blur-md border-border">
            <MenubarItem onClick={() => onOpenApp?.("terminal")}>
              Terminal-Hilfe
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => onOpenApp?.("contact")}>
              Kontakt aufnehmen
            </MenubarItem>
            <MenubarItem onClick={() => onOpenApp?.("about")}>
              Über den Entwickler
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Right side - System tray */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1 hover:text-foreground cursor-default">
          <Volume2 className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1 hover:text-foreground cursor-default">
          <Wifi className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1 hover:text-foreground cursor-default">
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
