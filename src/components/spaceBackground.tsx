"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  glowTimer: number;
  glowDuration: number;
  glowInterval: number;
  baseOpacity: number;
  color: string;
}

const STAR_COLORS = [
  "255,255,255",
  "210,225,255",
  "255,245,210",
  "190,210,255",
];

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 350;
    starsRef.current = Array.from({ length: STAR_COUNT }, () => createStar(canvas));

    let lastTime = 0;

    const animate = (time: number) => {
      const delta = Math.min(time - lastTime, 50); // cap delta
      lastTime = time;

      // Pure black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        updateStar(star, delta, canvas);
        drawStar(ctx, star);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}

function createStar(canvas: HTMLCanvasElement): Star {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * 2.5 + 0.3,
    radius: Math.random() * 1.0 + 0.3,
    glowTimer: Math.random() * 8000,
    glowDuration: Math.random() * 600 + 300,
    glowInterval: Math.random() * 7000 + 4000,
    baseOpacity: Math.random() * 0.4 + 0.5,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  };
}

function updateStar(star: Star, delta: number, canvas: HTMLCanvasElement) {
  const speed = star.z * 0.010;
  star.x -= speed * delta;
  if (star.x < -2) {
    star.x = canvas.width + 2;
    star.y = Math.random() * canvas.height;
  }

  star.glowTimer += delta;
  if (star.glowTimer > star.glowInterval + star.glowDuration) {
    star.glowTimer = 0;
    star.glowInterval = Math.random() * 7000 + 4000;
    star.glowDuration = Math.random() * 600 + 300;
  }
}

function drawStar(ctx: CanvasRenderingContext2D, star: Star) {
  // Glow phase
  let glowFactor = 0;
  if (star.glowTimer >= star.glowInterval) {
    const t = (star.glowTimer - star.glowInterval) / star.glowDuration;
    glowFactor = Math.sin(t * Math.PI); // smooth 0→1→0
  }

  const opacity = star.baseOpacity + glowFactor * 0.5;

  // Draw just the star dot — slightly brighter during glow, no large halo
  const r = star.radius + glowFactor * star.radius * 0.6; // barely grows

  ctx.beginPath();
  ctx.arc(star.x, star.y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${star.color},${Math.min(opacity, 1).toFixed(2)})`;
  ctx.fill();

  // Very tight, tiny glow — just 2x the star radius, very faint
  if (glowFactor > 0.1) {
    const halo = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, r * 2.5);
    halo.addColorStop(0, `rgba(${star.color},${(glowFactor * 0.15).toFixed(2)})`);
    halo.addColorStop(1, `rgba(${star.color},0)`);
    ctx.beginPath();
    ctx.arc(star.x, star.y, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();
  }
}