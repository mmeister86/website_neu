"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"

// TypeScript interfaces for game entities
interface Position {
  x: number
  y: number
}

interface Velocity {
  x: number
  y: number
}

interface Player {
  x: number
  y: number
  radius: number
  color: string
  speed: number
  health: number
  superCharge: number
}

interface Projectile {
  x: number
  y: number
  radius: number
  color: string
  velocity: Velocity
  isSuper: boolean
  pierceCount: number
}

interface Enemy {
  x: number
  y: number
  radius: number
  color: string
  velocity: Velocity
  speed: number
  maxHealth: number
  currentHealth: number
}

interface Gem {
  x: number
  y: number
  radius: number
  color: string
  angle: number
}

interface GameState {
  score: number
  health: number
  superCharge: number
  gameActive: boolean
}

export function BrawlGameApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationIdRef = useRef<number | null>(null)
  const enemySpawnerRef = useRef<NodeJS.Timeout | null>(null)
  const gemSpawnerRef = useRef<NodeJS.Timeout | null>(null)

  // Game state refs (for use in game loop without re-renders)
  const playerRef = useRef<Player | null>(null)
  const projectilesRef = useRef<Projectile[]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const gemsRef = useRef<Gem[]>([])
  const keysRef = useRef<Record<string, boolean>>({})
  const mousePosRef = useRef<Position>({ x: 0, y: 0 })
  const gameActiveRef = useRef<boolean>(true)

  // React state for UI updates
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    health: 100,
    superCharge: 0,
    gameActive: true,
  })

  // Initialize player
  const initPlayer = useCallback((canvasWidth: number, canvasHeight: number): Player => {
    return {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      radius: 20,
      color: "#0099ff",
      speed: 5,
      health: 100,
      superCharge: 0,
    }
  }, [])

  // Draw grid background
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "#3d3d3d"
    ctx.lineWidth = 1
    const gridSize = 50
    ctx.beginPath()
    for (let i = 0; i < width; i += gridSize) {
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
    }
    for (let i = 0; i < height; i += gridSize) {
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
    }
    ctx.stroke()
  }, [])

  // Draw player
  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, player: Player) => {
    ctx.beginPath()
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = player.color
    ctx.fill()

    // Target ring
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    ctx.lineWidth = 3
    ctx.stroke()

    // Glow when super is ready
    if (player.superCharge >= 100) {
      ctx.beginPath()
      ctx.arc(player.x, player.y, player.radius + 10, 0, Math.PI * 2, false)
      ctx.strokeStyle = `rgba(255, 215, 0, ${Math.abs(Math.sin(Date.now() / 200))})`
      ctx.lineWidth = 4
      ctx.stroke()
    }
  }, [])

  // Draw projectile
  const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, projectile: Projectile) => {
    ctx.beginPath()
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = projectile.color
    ctx.fill()

    if (projectile.isSuper) {
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [])

  // Draw enemy
  const drawEnemy = useCallback((ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    ctx.beginPath()
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = enemy.color
    ctx.fill()

    // Health bar above enemy
    ctx.fillStyle = "red"
    ctx.fillRect(enemy.x - 15, enemy.y - 30, 30, 5)
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(enemy.x - 15, enemy.y - 30, 30 * (enemy.currentHealth / enemy.maxHealth), 5)
  }, [])

  // Draw gem
  const drawGem = useCallback((ctx: CanvasRenderingContext2D, gem: Gem) => {
    gem.angle += 0.05
    const floatY = gem.y + Math.sin(gem.angle) * 5

    ctx.beginPath()
    ctx.moveTo(gem.x, floatY - gem.radius)
    ctx.lineTo(gem.x + gem.radius, floatY)
    ctx.lineTo(gem.x, floatY + gem.radius)
    ctx.lineTo(gem.x - gem.radius, floatY)
    ctx.fillStyle = gem.color
    ctx.fill()
  }, [])

  // Activate super attack
  const activateSuper = useCallback(() => {
    const player = playerRef.current
    if (!player || player.superCharge < 100) return

    player.superCharge = 0

    const angle = Math.atan2(mousePosRef.current.y - player.y, mousePosRef.current.x - player.x)
    const spreadCount = 5
    const spreadAngle = 0.5

    for (let i = 0; i < spreadCount; i++) {
      const currentSpread = -spreadAngle / 2 + (spreadAngle / (spreadCount - 1)) * i
      const finalAngle = angle + currentSpread

      const velocity: Velocity = {
        x: Math.cos(finalAngle) * 25,
        y: Math.sin(finalAngle) * 25,
      }

      projectilesRef.current.push({
        x: player.x,
        y: player.y,
        radius: 12,
        color: "#ffc107",
        velocity,
        isSuper: true,
        pierceCount: 5,
      })
    }

    setGameState(prev => ({ ...prev, superCharge: 0 }))
  }, [])

  // Shoot projectile
  const shoot = useCallback((targetX: number, targetY: number) => {
    const player = playerRef.current
    if (!player || !gameActiveRef.current) return

    const angle = Math.atan2(targetY - player.y, targetX - player.x)
    const velocity: Velocity = {
      x: Math.cos(angle) * 15,
      y: Math.sin(angle) * 15,
    }

    projectilesRef.current.push({
      x: player.x,
      y: player.y,
      radius: 5,
      color: "cyan",
      velocity,
      isSuper: false,
      pierceCount: 1,
    })
  }, [])

  // Spawn enemy
  const spawnEnemy = useCallback((canvasWidth: number, canvasHeight: number) => {
    if (!gameActiveRef.current) return

    const radius = 20
    let ex: number, ey: number

    if (Math.random() < 0.5) {
      ex = Math.random() < 0.5 ? 0 - radius : canvasWidth + radius
      ey = Math.random() * canvasHeight
    } else {
      ex = Math.random() * canvasWidth
      ey = Math.random() < 0.5 ? 0 - radius : canvasHeight + radius
    }

    enemiesRef.current.push({
      x: ex,
      y: ey,
      radius,
      color: "#ff4444",
      velocity: { x: 0, y: 0 },
      speed: Math.random() * 2 + 1,
      maxHealth: 20,
      currentHealth: 20,
    })
  }, [])

  // Spawn gem
  const spawnGem = useCallback((canvasWidth: number, canvasHeight: number) => {
    if (!gameActiveRef.current) return

    const randX = canvasWidth / 2 + (Math.random() * 300 - 150)
    const randY = canvasHeight / 2 + (Math.random() * 300 - 150)

    gemsRef.current.push({
      x: randX,
      y: randY,
      radius: 8,
      color: "#d630d6",
      angle: 0,
    })
  }, [])

  // End game
  const endGame = useCallback(() => {
    gameActiveRef.current = false
    setGameState(prev => ({ ...prev, gameActive: false }))

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }
    if (enemySpawnerRef.current) {
      clearInterval(enemySpawnerRef.current)
      enemySpawnerRef.current = null
    }
    if (gemSpawnerRef.current) {
      clearInterval(gemSpawnerRef.current)
      gemSpawnerRef.current = null
    }
  }, [])

  // Restart game
  const restartGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Reset player
    playerRef.current = initPlayer(canvas.width, canvas.height)

    // Reset arrays
    projectilesRef.current = []
    enemiesRef.current = []
    gemsRef.current = []
    keysRef.current = {}

    // Reset game state
    gameActiveRef.current = true
    setGameState({
      score: 0,
      health: 100,
      superCharge: 0,
      gameActive: true,
    })

    // Clear existing spawners
    if (enemySpawnerRef.current) clearInterval(enemySpawnerRef.current)
    if (gemSpawnerRef.current) clearInterval(gemSpawnerRef.current)

    // Start spawners
    enemySpawnerRef.current = setInterval(() => spawnEnemy(canvas.width, canvas.height), 1200)
    gemSpawnerRef.current = setInterval(() => spawnGem(canvas.width, canvas.height), 2500)

    // Start game loop
    gameLoop()
  }, [initPlayer, spawnEnemy, spawnGem])

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const player = playerRef.current

    if (!canvas || !ctx || !player) return

    // Clear with trail effect
    ctx.fillStyle = "rgba(43, 43, 43, 0.3)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawGrid(ctx, canvas.width, canvas.height)

    // Update player position
    if (keysRef.current["KeyW"] && player.y - player.radius > 0) player.y -= player.speed
    if (keysRef.current["KeyS"] && player.y + player.radius < canvas.height) player.y += player.speed
    if (keysRef.current["KeyA"] && player.x - player.radius > 0) player.x -= player.speed
    if (keysRef.current["KeyD"] && player.x + player.radius < canvas.width) player.x += player.speed

    drawPlayer(ctx, player)

    // Update and draw projectiles
    projectilesRef.current = projectilesRef.current.filter((projectile) => {
      projectile.x += projectile.velocity.x
      projectile.y += projectile.velocity.y
      drawProjectile(ctx, projectile)

      // Remove if out of bounds
      return !(
        projectile.x < 0 ||
        projectile.x > canvas.width ||
        projectile.y < 0 ||
        projectile.y > canvas.height
      )
    })

    // Update and draw gems
    let scoreChanged = false
    gemsRef.current = gemsRef.current.filter((gem) => {
      drawGem(ctx, gem)
      const dist = Math.hypot(player.x - gem.x, player.y - gem.y)
      if (dist - player.radius - gem.radius < 1) {
        scoreChanged = true
        return false
      }
      return true
    })

    if (scoreChanged) {
      setGameState(prev => ({ ...prev, score: prev.score + 1 }))
    }

    // Update and draw enemies
    let healthChanged = false
    let superChanged = false

    enemiesRef.current = enemiesRef.current.filter((enemy) => {
      // Move toward player
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x)
      enemy.velocity = {
        x: Math.cos(angle) * enemy.speed,
        y: Math.sin(angle) * enemy.speed,
      }
      enemy.x += enemy.velocity.x
      enemy.y += enemy.velocity.y

      drawEnemy(ctx, enemy)

      // Check collision with player
      const distPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y)
      if (distPlayer - enemy.radius - player.radius < 1) {
        player.health -= 2
        if (player.health < 0) player.health = 0
        healthChanged = true
        if (player.health <= 0) {
          endGame()
        }
      }

      // Check collision with projectiles
      projectilesRef.current = projectilesRef.current.filter((projectile) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
        if (dist - enemy.radius - projectile.radius < 1) {
          // Enemy takes damage
          enemy.currentHealth -= projectile.isSuper ? 20 : 10

          // Knockback effect
          enemy.x -= projectile.velocity.x * 0.5
          enemy.y -= projectile.velocity.y * 0.5

          // Charge super
          if (player.superCharge < 100) {
            player.superCharge += 10
            if (player.superCharge > 100) player.superCharge = 100
            superChanged = true
          }

          // Reduce pierce count
          projectile.pierceCount--
          return projectile.pierceCount > 0
        }
        return true
      })

      // Remove dead enemies
      return enemy.currentHealth > 0
    })

    if (healthChanged) {
      setGameState(prev => ({ ...prev, health: Math.floor(playerRef.current?.health || 0) }))
    }
    if (superChanged) {
      setGameState(prev => ({ ...prev, superCharge: playerRef.current?.superCharge || 0 }))
    }

    if (gameActiveRef.current) {
      animationIdRef.current = requestAnimationFrame(gameLoop)
    }
  }, [drawGrid, drawPlayer, drawProjectile, drawGem, drawEnemy, endGame])

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
  }, [])

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set initial canvas size
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    // Initialize player
    playerRef.current = initPlayer(canvas.width, canvas.height)

    // Start spawners
    enemySpawnerRef.current = setInterval(() => spawnEnemy(canvas.width, canvas.height), 1200)
    gemSpawnerRef.current = setInterval(() => spawnGem(canvas.width, canvas.height), 2500)

    // Start game loop
    gameLoop()

    // Handle resize
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (enemySpawnerRef.current) {
        clearInterval(enemySpawnerRef.current)
      }
      if (gemSpawnerRef.current) {
        clearInterval(gemSpawnerRef.current)
      }
      resizeObserver.disconnect()
    }
  }, [initPlayer, spawnEnemy, spawnGem, gameLoop, handleResize])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true
      if (e.code === "Space") {
        e.preventDefault()
        activateSuper()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [activateSuper])

  // Handle mouse events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (!gameActiveRef.current) return
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      shoot(x, y)
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("click", handleClick)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("click", handleClick)
    }
  }, [shoot])

  // Handle keyboard shortcuts for menu actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle menu shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'r':
            e.preventDefault()
            restartGame()
            break
          case 'p':
            e.preventDefault()
            // Toggle pause (not implemented in the game yet)
            break
          case '?':
            e.preventDefault()
            // Show controls (not implemented in the game yet)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [restartGame])

  // Listen for custom events from menu bar
  useEffect(() => {
    const handleGameControl = (e: CustomEvent) => {
      const action = e.detail
      switch (action) {
        case 'restart':
          restartGame()
          break
        case 'pause':
          // Toggle pause (not implemented in the game yet)
          break
        case 'controls':
          // Show controls (not implemented in the game yet)
          alert('Game Controls:\n\nWASD - Move\nMouse Click - Shoot\nSpace - Super Attack')
          break
      }
    }

    // Add event listener with proper typing
    const typedHandler = handleGameControl as EventListener
    document.addEventListener('gameControl', typedHandler)

    return () => {
      document.removeEventListener('gameControl', typedHandler)
    }
  }, [restartGame])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#2b2b2b] select-none">
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10">
        {/* Top Bar */}
        <div
          className="flex justify-between px-6 py-4 text-white font-bold text-xl"
          style={{
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)",
            textShadow: "2px 2px 0 #000",
          }}
        >
          <div className="text-[#d630d6]">💎 {gameState.score}</div>
          <div className="text-[#ff4444]">❤️ {gameState.health}%</div>
        </div>

        {/* Bottom UI - Super Bar */}
        <div className="flex justify-center items-center p-5">
          <div
            className="relative w-75 h-10 rounded-[20px] overflow-hidden"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              border: "2px solid #fff",
            }}
          >
            <div
              className="h-full transition-all duration-200"
              style={{
                width: `${gameState.superCharge}%`,
                background: "linear-gradient(90deg, #ffc107, #ff9800)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm"
              style={{ textShadow: "1px 1px 2px black" }}
            >
              SUPER (SPACE)
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Screen */}
      {!gameState.gameActive && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-[15px] text-center z-20"
          style={{
            boxShadow: "0 0 50px rgba(0, 0, 0, 0.7)",
            border: "5px solid #333",
          }}
        >
          <h1 className="m-0 mb-2 text-[#ff4444] text-3xl font-bold">GAME OVER!</h1>
          <p className="text-lg">
            Gems collected: <span className="font-bold">{gameState.score}</span>
          </p>
          <button
            onClick={restartGame}
            className="mt-5 px-8 py-4 text-lg font-bold text-white rounded-lg cursor-pointer transition-transform active:translate-y-1"
            style={{
              backgroundColor: "#0099ff",
              border: "none",
              boxShadow: "0 4px 0 #005f99",
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
