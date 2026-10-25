'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  baseX: number;
  y: number;
  size: number;
  fallSpeed: number; // pixels per second
  windDrift: number; // slow constant horizontal drift
  swingPhase: number; // radians
  swingSpeed: number; // radians per second
  swingAmplitude: number; // pixel amplitude
  flipPhase: number; // radians for 3D tumbling
  flipSpeed: number; // radians per second
  baseAngle: number; // degrees
  maxSwayAngle: number; // degrees
  opacity: number;
  color: string;
  isPetal: boolean; // petal or leaf
}

export default function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setupCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };
    window.addEventListener('resize', handleResize);

    // Pastel Apple Orchard Palette 🍎🌷
    const petalColors = ['#F6B8C6', '#FCE4EC', '#F6D1B5', '#FFF0F5', '#FAD4DE'];
    const leafColors = ['#C9DDB8', '#A8B99A', '#D8E8CC', '#B9CCA9'];
    const count = Math.min(Math.floor((width * height) / 30000), 26);
    const particles: Particle[] = [];

    const createParticle = (initialY?: number): Particle => {
      const isPetal = Math.random() > 0.45; // ~55% blossom petals, 45% pastel leaves
      const palette = isPetal ? petalColors : leafColors;

      return {
        baseX: Math.random() * (width + 100) - 50,
        y: initialY !== undefined ? initialY : Math.random() * (height + 60) - 30,
        size: isPetal ? Math.random() * 5 + 7 : Math.random() * 6 + 8,
        fallSpeed: isPetal ? Math.random() * 20 + 22 : Math.random() * 26 + 28, // gentle drift
        windDrift: (Math.random() - 0.35) * 14, // subtle rightward drift
        swingPhase: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 1.2 + 1.1, // ~1.1 - 2.3 rad/sec
        swingAmplitude: Math.random() * 28 + 20, // 20-48px swing
        flipPhase: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 1.4 + 0.9, // 3D tumble
        baseAngle: (Math.random() - 0.5) * 36, // general tilt
        maxSwayAngle: Math.random() * 18 + 14,
        opacity: Math.random() * 0.3 + 0.35, // dreamy pastel opacity
        color: palette[Math.floor(Math.random() * palette.length)],
        isPetal,
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    let lastTime = 0;

    const render = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth physics with delta time
        p.y += p.fallSpeed * delta;
        p.baseX += p.windDrift * delta;
        p.swingPhase += p.swingSpeed * delta;
        p.flipPhase += p.flipSpeed * delta;

        // Current smooth X position derived harmonically
        const currentX = p.baseX + Math.sin(p.swingPhase) * p.swingAmplitude;

        // Recycle particle when it exits screen bottom
        if (p.y > height + p.size * 2) {
          particles[i] = createParticle(-20);
          continue;
        }

        // Horizontal screen wrap
        if (currentX > width + 60) p.baseX = -50;
        if (currentX < -60) p.baseX = width + 50;

        // Visual orientation: rocks naturally with sway
        const swayTilt = Math.sin(p.swingPhase) * p.maxSwayAngle;
        const totalAngle = ((p.baseAngle + swayTilt) * Math.PI) / 180;
        // 3D tumbling scale
        const flipScale = Math.cos(p.flipPhase) * 0.65 + 0.35;

        ctx.save();
        ctx.translate(currentX, p.y);
        ctx.rotate(totalAngle);
        ctx.scale(flipScale, 1);
        ctx.globalAlpha = p.opacity;

        if (p.isPetal) {
          // Romantic Apple Blossom Petal Shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(
            p.size * 0.9,
            -p.size * 0.6,
            p.size * 0.9,
            p.size * 0.7,
            0,
            p.size
          );
          ctx.bezierCurveTo(
            -p.size * 0.9,
            p.size * 0.7,
            -p.size * 0.9,
            -p.size * 0.6,
            0,
            -p.size
          );
          ctx.fill();

          // Subtle petal highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.arc(0, -p.size * 0.3, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft Pastel Apple Leaf Shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(
            p.size * 0.82,
            -p.size * 0.75,
            p.size * 0.96,
            p.size * 0.36,
            0,
            p.size
          );
          ctx.bezierCurveTo(
            -p.size * 0.88,
            p.size * 0.52,
            -p.size * 0.82,
            -p.size * 0.62,
            0,
            -p.size
          );
          ctx.fill();

          // Delicate leaf central vein
          ctx.strokeStyle = 'rgba(168, 185, 154, 0.45)';
          ctx.lineWidth = Math.max(0.6, p.size * 0.055);
          ctx.beginPath();
          ctx.moveTo(0, p.size * 0.75);
          ctx.lineTo(0, -p.size * 0.7);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85"
      aria-hidden="true"
    />
  );
}
