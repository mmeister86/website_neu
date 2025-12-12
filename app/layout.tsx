import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const AVAILABLE_WALLPAPERS = [
  "/images/Blaues und rosafarbenes Licht.jpg",
  "/images/lake-mountains-rocks-sunrise-daylight-scenery-illustration-3840x2160-3773.jpg",
  "/images/sean-fahrenbruch-g95tsUeCohM-unsplash.jpg",
  "/images/waves-macos-big-sur-colorful-dark-5k-6016x6016-4990.jpg",
  "/images/wellen-20hintergrund-20wallpaper.jpg",
]

const DEFAULT_WALLPAPER = "/images/wellen-20hintergrund-20wallpaper.jpg"

function getWallpaperFromCookie(cookieHeader: string | null): string {
  if (!cookieHeader) return DEFAULT_WALLPAPER

  const cookies = cookieHeader.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "os-wallpaper") {
      const decodedValue = decodeURIComponent(value)
      if (AVAILABLE_WALLPAPERS.includes(decodedValue)) {
        return decodedValue
      }
    }
  }
  return DEFAULT_WALLPAPER
}

export const metadata: Metadata = {
  title: "matthias.lol | Software Engineer",
  description: "Chaos Quest - Terminal Portfolio von Matthias",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body
        className={`${jetbrainsMono.className} antialiased`}
        style={{
          // Set CSS variable for wallpaper that will be updated by client-side script
          "--wallpaper-url": `url('${DEFAULT_WALLPAPER}')`,
        } as React.CSSProperties}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const DEFAULT_WALLPAPER = "${DEFAULT_WALLPAPER}";
                const AVAILABLE_WALLPAPERS = ${JSON.stringify(AVAILABLE_WALLPAPERS)};

                function getWallpaperFromCookie() {
                  const cookies = document.cookie.split(";");
                  for (const cookie of cookies) {
                    const [name, value] = cookie.trim().split("=");
                    if (name === "os-wallpaper") {
                      const decodedValue = decodeURIComponent(value);
                      if (AVAILABLE_WALLPAPERS.includes(decodedValue)) {
                        return decodedValue;
                      }
                    }
                  }
                  return DEFAULT_WALLPAPER;
                }

                // Set the wallpaper immediately to prevent flash
                const wallpaper = getWallpaperFromCookie();
                document.body.style.setProperty("--wallpaper-url", \`url('\${wallpaper}')\`);
              })();
            `,
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
