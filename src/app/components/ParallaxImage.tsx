import { useEffect, useRef, useState } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** How much slower the image moves vs scroll. 0.3 = 30% of scroll speed (subtle). */
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ParallaxImage — a container whose inner image scrolls at a different rate
 * from the page, creating a depth/parallax illusion.
 * The image blends into a white background using mix-blend-mode + gradient overlays.
 */
export function ParallaxImage({
  src,
  alt,
  speed = 0.28,
  className = '',
  style,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf: number;

    const handleScroll = () => {
      raf = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // distance from viewport centre
        const viewportCentre = window.innerHeight / 2;
        const elementCentre = rect.top + rect.height / 2;
        const distanceFromCentre = elementCentre - viewportCentre;
        setOffset(distanceFromCentre * speed);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Parallax image */}
      <img
        src={src}
        alt={alt}
        style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.05s linear',
          willChange: 'transform',
          // Scale up slightly so parallax movement doesn't reveal empty edges
          width: '100%',
          height: '115%',
          objectFit: 'contain',
          objectPosition: 'center bottom',
          // Blend the white image background into the white page background
          mixBlendMode: 'multiply',
          filter: 'contrast(1.02) brightness(1.01)',
        }}
      />

      {/* Soft radial glow to blend edges into white */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 90% at 50% 50%, transparent 45%, rgba(255,255,255,0.55) 70%, white 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade — smoothly dissolve into the section below */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '38%',
          background: 'linear-gradient(to bottom, transparent, white)',
          pointerEvents: 'none',
        }}
      />

      {/* Top fade */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '10%',
          background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.4))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
