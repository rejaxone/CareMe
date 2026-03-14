import { useEffect, useRef } from 'react';

export interface FloatingLinesProps {
  enabledWaves?: ('top' | 'middle' | 'bottom')[];
  lineCount?: number;
  lineDistance?: number;
  bendRadius?: number;
  bendStrength?: number;
  interactive?: boolean;
  parallax?: boolean;
  color?: string;
  className?: string;
}

export function FloatingLines({
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = 5,
  lineDistance = 5,
  bendRadius = 5,
  bendStrength = -0.5,
  interactive = true,
  parallax = true,
  color = '#2E8BFF',
  className = '',
}: FloatingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const mouseTargetRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let time = 0;

    // Parse hex color to rgb components
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Wave vertical position ratios
    const wavePositions: Record<string, number> = {
      top: 0.22,
      middle: 0.50,
      bottom: 0.78,
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseTargetRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseTargetRef.current = { x: 0.5, y: 0.5 };
    };

    const handleScroll = () => {
      if (!parallax) return;
      scrollRef.current = window.scrollY;
    };

    /**
     * Draws a single wave group at a given vertical ratio.
     * waveIndex: 0,1,2 for top, middle, bottom — used to offset phases.
     */
    const drawWaveGroup = (baseYRatio: number, waveIndex: number) => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseTargetRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseTargetRef.current.y - mouseRef.current.y) * 0.08;

      const mx = mouseRef.current.x * W;
      const sigma = W * 0.28; // gaussian spread

      for (let i = 0; i < lineCount; i++) {
        const lineOffset = (i - (lineCount - 1) / 2) * lineDistance;
        const baseY = H * baseYRatio + lineOffset;

        // Parallax: wave groups shift slightly on scroll
        const parallaxOffset = parallax
          ? scrollRef.current * 0.05 * (baseYRatio - 0.5) * -1
          : 0;

        // Build smooth path using many sample points
        const numPts = 120;
        const pts: [number, number][] = [];

        for (let p = 0; p <= numPts; p++) {
          const x = (p / numPts) * W;
          const xNorm = x / W;

          // Layered sine waves for organic feel
          const amp1 = H * 0.038 * Math.abs(bendStrength) * 2.2;
          const amp2 = H * 0.022 * Math.abs(bendStrength) * 2.2;
          const amp3 = H * 0.014 * Math.abs(bendStrength) * 2.2;

          const wave1 = amp1 * Math.sin(xNorm * Math.PI * 3.5 + time * 0.7 + waveIndex * 1.4 + i * 0.5);
          const wave2 = amp2 * Math.sin(xNorm * Math.PI * 2.1 + time * 0.45 + waveIndex * 0.9 + i * 0.8);
          const wave3 = amp3 * Math.cos(xNorm * Math.PI * 5.8 + time * 1.1 + waveIndex * 0.5 + i * 0.3);

          // Gaussian mouse distortion
          const g = Math.exp(-Math.pow(x - mx, 2) / (2 * sigma * sigma));
          const distortion = interactive
            ? g * (mouseRef.current.y - 0.5) * H * bendStrength * 1.8
            : 0;

          const y = baseY + parallaxOffset + wave1 + wave2 + wave3 + distortion;
          pts.push([x, y]);
        }

        // Draw smooth catmull-rom style path via quadratic beziers
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let p = 1; p < pts.length - 1; p++) {
          const cx = (pts[p][0] + pts[p + 1][0]) / 2;
          const cy = (pts[p][1] + pts[p + 1][1]) / 2;
          ctx.quadraticCurveTo(pts[p][0], pts[p][1], cx, cy);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last[0], last[1]);

        // Opacity gradient: center line most visible, outer lines fade
        const distFromCenter = Math.abs(i - (lineCount - 1) / 2) / ((lineCount - 1) / 2);
        const opacity = 0.38 - distFromCenter * 0.22;
        const lineWidth = 1.4 - distFromCenter * 0.35;

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      time += 0.007;

      enabledWaves.forEach((wave, idx) => {
        const yPos = wavePositions[wave] ?? 0.5;
        drawWaveGroup(yPos, idx);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }
    if (parallax) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (parallax) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [enabledWaves, lineCount, lineDistance, bendRadius, bendStrength, interactive, parallax, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  );
}
