"use client"

import { useOSContext } from "../os-context"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsApp() {
  const { wallpaper, setWallpaper, availableWallpapers } = useOSContext()

  return (
    <div className="h-full w-full p-6 bg-background/95 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6">Desktop Settings</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Wallpaper Selection</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableWallpapers.map((wallpaperPath) => (
            <button
              key={wallpaperPath}
              onClick={() => setWallpaper(wallpaperPath)}
              className={cn(
                "relative group rounded-lg overflow-hidden border-2 transition-all",
                wallpaper === wallpaperPath
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="aspect-video relative">
                <img
                  src={wallpaperPath}
                  alt="Wallpaper option"
                  className="w-full h-full object-cover"
                />
                {wallpaper === wallpaperPath && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
