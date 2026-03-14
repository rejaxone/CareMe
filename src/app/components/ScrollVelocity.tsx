/**
 * ScrollVelocity — infinite auto-scrolling marquee
 *
 * Architecture (2-copy seamless loop):
 *  ┌──────────────────────────────────────────────────────────┐
 *  │  [copy A]  [copy B]                                      │
 *  └──────────────────────────────────────────────────────────┘
 *   ← x moves left continuously at baseVelocity px/s
 *   When x <= -copyWidth  →  instant jump: x += copyWidth
 *   (invisible, because copy A and copy B are identical)
 *
 * Scroll boost: useVelocity(scrollY) is mapped to a speed multiplier
 * via useSpring so the acceleration / deceleration feels smooth.
 */
import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from 'motion/react';

/* ── types ─────────────────────────────────────────────────── */

interface VelocityRowProps {
  items: string[];
  /** Constant speed px/s (always running, regardless of scroll) */
  baseVelocity: number;
  damping: number;
  stiffness: number;
  velocityMapping: { input: [number, number]; output: [number, number] };
}

/* ── single row ─────────────────────────────────────────────── */

function VelocityRow({
  items,
  baseVelocity,
  damping,
  stiffness,
  velocityMapping,
}: VelocityRowProps) {
  /* Ref on EXACTLY ONE copy so we can measure its rendered width */
  const copyRef = useRef<HTMLDivElement>(null);

  /* Raw pixel position — we update this every frame */
  const rawX = useRef(0);

  /* Motion value that drives the CSS transform */
  const x = useMotionValue(0);

  /* Scroll-velocity boost ------------------------------------ */
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  /* Maps scroll velocity → extra speed multiplier (additive) */
  const extraFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false },
  );

  /* Reduced-motion preference -------------------------------- */
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const cb = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  }, []);

  /* Animation loop ------------------------------------------- */
  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const copyWidth = copyRef.current?.offsetWidth ?? 0;
    if (copyWidth === 0) return;

    /* Always move + boost from scroll velocity */
    const boost = 1 + Math.abs(extraFactor.get());
    rawX.current -= baseVelocity * boost * (delta / 1000);

    /* Seamless wrap: jump forward by exactly one copy width */
    if (rawX.current <= -copyWidth) {
      rawX.current += copyWidth;
    }

    x.set(rawX.current);
  });

  /* Render: exactly 2 copies --------------------------------- */
  const itemRow = (
    <>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center flex-shrink-0">
          <span
            className="
              text-[1.75rem] sm:text-[2.5rem] lg:text-[3.5rem]
              font-bold text-slate-300 opacity-70 tracking-tight
              px-5 sm:px-7 select-none whitespace-nowrap
            "
          >
            {item}
          </span>
          <span
            className="
              text-[1.25rem] sm:text-[1.75rem] lg:text-[2.25rem]
              font-bold select-none opacity-30 flex-shrink-0
            "
            style={{ color: '#2E8BFF' }}
          >
            ✦
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden w-full" aria-hidden="true">
      <motion.div
        style={{ x }}
        className="flex whitespace-nowrap will-change-transform"
      >
        {/* Copy A — measured */}
        <div ref={copyRef} className="flex whitespace-nowrap flex-shrink-0">
          {itemRow}
        </div>
        {/* Copy B — seamless continuation */}
        <div className="flex whitespace-nowrap flex-shrink-0">
          {itemRow}
        </div>
      </motion.div>
    </div>
  );
}

/* ── public API ─────────────────────────────────────────────── */

export interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  damping?: number;
  stiffness?: number;
  velocityMapping?: { input: [number, number]; output: [number, number] };
  /** Render a second row scrolling in the opposite direction */
  doubleRow?: boolean;
  className?: string;
}

export function ScrollVelocity({
  texts,
  velocity = 100,
  damping = 50,
  stiffness = 400,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  doubleRow = false,
  className = '',
}: ScrollVelocityProps) {
  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      <VelocityRow
        items={texts}
        baseVelocity={velocity}
        damping={damping}
        stiffness={stiffness}
        velocityMapping={velocityMapping}
      />
      {doubleRow && (
        <VelocityRow
          items={[...texts].reverse()}
          baseVelocity={velocity * 0.75} /* slightly slower for visual depth */
          damping={damping}
          stiffness={stiffness}
          velocityMapping={velocityMapping}
        />
      )}
    </div>
  );
}
