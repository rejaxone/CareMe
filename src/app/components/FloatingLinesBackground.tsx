import { ReactNode } from 'react';
import { FloatingLines, FloatingLinesProps } from './FloatingLines';

interface FloatingLinesBackgroundProps extends FloatingLinesProps {
  children: ReactNode;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Opacity of the background canvas layer (0–1) */
  backgroundOpacity?: number;
}

/**
 * Reusable wrapper that places an animated FloatingLines canvas as a
 * decorative absolute background behind whatever children you put inside.
 *
 * Usage:
 *   <FloatingLinesBackground enabledWaves={['top','middle','bottom']} ...>
 *     <YourHeroContent />
 *   </FloatingLinesBackground>
 */
export function FloatingLinesBackground({
  children,
  className = '',
  backgroundOpacity = 0.7,
  // FloatingLines props
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = 5,
  lineDistance = 5,
  bendRadius = 5,
  bendStrength = -0.5,
  interactive = true,
  parallax = true,
  color = '#2E8BFF',
}: FloatingLinesBackgroundProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Decorative animated background layer — aria-hidden, pointer-events-none */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: backgroundOpacity }}
        aria-hidden="true"
      >
        <FloatingLines
          enabledWaves={enabledWaves}
          lineCount={lineCount}
          lineDistance={lineDistance}
          bendRadius={bendRadius}
          bendStrength={bendStrength}
          interactive={interactive}
          parallax={parallax}
          color={color}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Content layer — sits above the animated background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
