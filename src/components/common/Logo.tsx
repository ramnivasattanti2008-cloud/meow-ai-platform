import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 20,
  showWordmark = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Precision Geometric Vector Mark (Non-AI, Bauhaus Geometric Monogram) */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-lg bg-zinc-950 border border-white/15 p-1 transition-colors group-hover:border-white/30"
        style={{ width: size + 8, height: size + 8 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          {/* Left Isometric Facet */}
          <path
            d="M5 12L16 17V28L5 21V12Z"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {/* Right Isometric Facet */}
          <path
            d="M27 12L16 17V28L27 21V12Z"
            fill="currentColor"
            fillOpacity="0.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {/* Top Architectural Aperture Facet */}
          <path
            d="M10 4L16 9L22 4L27 12L16 17L5 12L10 4Z"
            fill="currentColor"
            fillOpacity="0.95"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          {/* Center Precision Axis */}
          <path
            d="M16 9V17"
            stroke="#000000"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-semibold text-[15px] tracking-tight text-white font-sans">
            MeowBox
          </span>
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10 tracking-wider">
            AI
          </span>
        </div>
      )}
    </div>
  );
};
