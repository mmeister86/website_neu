"use client";

import { useEffect, useRef, useState } from "react";

interface SpaceInvadersGameProps {
  onExit: () => void;
}

type GameObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
};

type Alien = GameObject & {
  type: 1 | 2 | 3;
};

type Bullet = GameObject & {
  dy: number;
};

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 20;
const ALIEN_WIDTH = 24;
const ALIEN_HEIGHT = 18;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ALIEN_SPEED = 1;
const ALIEN_DROP = 20;

const COLORS = {
  background: "#0f172a", // Dark Blue/Black
  foreground: "#e2e8f0", // Light Blue/White
  green: "#22c55e", // Bright Green
  pink: "#e879f9", // Bright Pink
  cyan: "#22d3ee", // Bright Cyan
  yellow: "#facc15", // Bright Yellow
  dim: "#1e293b", // Dim Blue/Gray
};

export function SpaceInvadersGame({ onExit }: SpaceInvadersGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Game state refs to avoid closure staleness in loop
  const gameState = useRef({
    player: {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - 30,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      active: true,
    },
    bullets: [] as Bullet[],
    aliens: [] as Alien[],
    alienDirection: 1, // 1 for right, -1 for left
    keys: { left: false, right: false, space: false },
    lastShot: 0,
    frameCount: 0,
  });

  useEffect(() => {
    // Initialize aliens
    const aliens: Alien[] = [];
    const rows = 4;
    const cols = 8;
    const startX = 50;
    const startY = 50;
    const gapX = 15;
    const gapY = 15;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        aliens.push({
          x: startX + c * (ALIEN_WIDTH + gapX),
          y: startY + r * (ALIEN_HEIGHT + gapY),
          width: ALIEN_WIDTH,
          height: ALIEN_HEIGHT,
          active: true,
          type: ((r % 3) + 1) as 1 | 2 | 3,
        });
      }
    }
    gameState.current.aliens = aliens;
    setScore(0);
    setGameOver(false);
    setGameWon(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") gameState.current.keys.left = true;
      if (e.key === "ArrowRight") gameState.current.keys.right = true;
      if (e.key === " ") {
        gameState.current.keys.space = true;
        e.preventDefault(); // Prevent scrolling
      }
      if (e.key === "q" || e.key === "Escape") {
        onExit();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") gameState.current.keys.left = false;
      if (e.key === "ArrowRight") gameState.current.keys.right = false;
      if (e.key === " ") gameState.current.keys.space = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let animationFrameId: number;

    const update = () => {
      const state = gameState.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Player Movement
      if (state.keys.left && state.player.x > 0) {
        state.player.x -= PLAYER_SPEED;
      }
      if (
        state.keys.right &&
        state.player.x < CANVAS_WIDTH - state.player.width
      ) {
        state.player.x += PLAYER_SPEED;
      }

      // Shooting
      const now = Date.now();
      if (state.keys.space && now - state.lastShot > 300) {
        state.bullets.push({
          x: state.player.x + state.player.width / 2 - BULLET_WIDTH / 2,
          y: state.player.y,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          dy: -BULLET_SPEED,
          active: true,
        });
        state.lastShot = now;
      }

      // Update Bullets
      state.bullets.forEach((b) => (b.y += b.dy));
      state.bullets = state.bullets.filter((b) => b.y > -20 && b.active);

      // Update Aliens
      let hitWall = false;
      state.aliens.forEach((alien) => {
        if (!alien.active) return;
        if (
          state.alienDirection === 1 &&
          alien.x + alien.width > CANVAS_WIDTH - 10
        )
          hitWall = true;
        if (state.alienDirection === -1 && alien.x < 10) hitWall = true;
      });

      if (hitWall) {
        state.alienDirection *= -1;
        state.aliens.forEach((alien) => (alien.y += ALIEN_DROP));
      }

      state.aliens.forEach((alien) => {
        if (!alien.active) return;
        alien.x += ALIEN_SPEED * state.alienDirection;

        // Game Over Check
        if (alien.y + alien.height >= state.player.y) {
          setGameOver(true);
        }
      });

      // Collision Detection
      state.bullets.forEach((bullet) => {
        if (!bullet.active) return;
        state.aliens.forEach((alien) => {
          if (!alien.active) return;
          if (
            bullet.x < alien.x + alien.width &&
            bullet.x + bullet.width > alien.x &&
            bullet.y < alien.y + alien.height &&
            bullet.y + bullet.height > alien.y
          ) {
            alien.active = false;
            bullet.active = false;
            setScore((prev) => prev + 100);
          }
        });
      });

      // Check Win
      if (state.aliens.every((a) => !a.active)) {
        setGameWon(true);
      }

      // Draw
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear screen with theme background
        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Aliens
        state.aliens.forEach((alien) => {
          if (!alien.active) return;
          // Color based on type
          if (alien.type === 1) ctx.fillStyle = COLORS.pink;
          else if (alien.type === 2) ctx.fillStyle = COLORS.cyan;
          else ctx.fillStyle = COLORS.yellow;

          // Simple alien shape based on type
          if (alien.type === 1) {
            ctx.fillRect(alien.x + 4, alien.y, 16, 18);
            ctx.clearRect(alien.x + 8, alien.y + 4, 8, 4);
          } else if (alien.type === 2) {
            ctx.fillRect(alien.x, alien.y + 4, 24, 10);
            ctx.fillRect(alien.x + 8, alien.y, 8, 4);
            ctx.fillRect(alien.x + 2, alien.y + 14, 4, 4);
            ctx.fillRect(alien.x + 18, alien.y + 14, 4, 4);
          } else {
            ctx.fillRect(alien.x + 2, alien.y + 2, 20, 14);
            ctx.clearRect(alien.x + 6, alien.y + 6, 4, 4);
            ctx.clearRect(alien.x + 14, alien.y + 6, 4, 4);
          }
        });

        // Draw Bullets
        ctx.fillStyle = COLORS.foreground;
        state.bullets.forEach((bullet) => {
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Scanlines effect (subtle overlay)
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        for (let i = 0; i < CANVAS_HEIGHT; i += 2) {
          ctx.fillRect(0, i, CANVAS_WIDTH, 1);
        }

        // Draw Player (AFTER scanlines so it's visible on top)
        ctx.fillStyle = COLORS.green; // Use theme green color
        // Simple tank shape
        ctx.fillRect(
          state.player.x,
          state.player.y + 10,
          state.player.width,
          10
        ); // Base
        ctx.fillRect(state.player.x + 10, state.player.y, 10, 10); // Turret
      }

      if (!gameOver && !gameWon) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    if (!gameOver && !gameWon) {
      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, gameWon, onExit]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background font-mono text-terminal-green p-4 animate-in fade-in duration-300">
      <div className="mb-4 text-center space-y-1">
        <h1 className="text-2xl font-bold text-terminal-pink tracking-wider">
          SPACE INVADERS
        </h1>
        <div className="flex gap-6 justify-center text-sm text-muted-foreground">
          <p>
            SCORE: <span className="text-foreground">{score}</span>
          </p>
          <p>
            CONTROLS: <span className="text-foreground">ARROWS + SPACE</span>
          </p>
          <p>
            QUIT: <span className="text-foreground">Q / ESC</span>
          </p>
        </div>
      </div>

      <div className="relative border-2 border-terminal-dim rounded-sm shadow-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block bg-background"
        />

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px]" />

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 flex-col gap-4 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-destructive animate-pulse">
              GAME OVER
            </h2>
            <p className="text-xl text-foreground">FINAL SCORE: {score}</p>
            <button
              onClick={onExit}
              className="px-6 py-2 border border-terminal-pink text-terminal-pink hover:bg-terminal-pink hover:text-background transition-colors font-bold"
            >
              RETURN TO TERMINAL
            </button>
          </div>
        )}

        {gameWon && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 flex-col gap-4 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-terminal-yellow animate-bounce">
              VICTORY!
            </h2>
            <p className="text-xl text-foreground">SCORE: {score}</p>
            <button
              onClick={onExit}
              className="px-6 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-background transition-colors font-bold"
            >
              RETURN TO TERMINAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
