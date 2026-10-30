import React from 'react';

interface AyojaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export function AyojaLogo({
  className = '',
  size = 'md',
  showWordmark = true,
  showTagline = false,
  variant = 'auto',
}: AyojaLogoProps) {
  // Dimensions based on size
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[7px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-[12px]',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Precision Vector SVG of Ayoja Mark */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
        aria-label="AYOJA Logo Mark"
      >
        <defs>
          {/* Main Left Petal Gradient (Plum to Vibrant Coral) */}
          <linearGradient id="ayojaLeftGrad" x1="20" y1="90" x2="65" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6C1D4F" />
            <stop offset="55%" stopColor="#C43B68" />
            <stop offset="100%" stopColor="#F0656B" />
          </linearGradient>

          {/* Right Flowing Petal Gradient (Coral to Royal Gold/Plum) */}
          <linearGradient id="ayojaRightGrad" x1="55" y1="25" x2="100" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F0656B" />
            <stop offset="60%" stopColor="#D46A64" />
            <stop offset="100%" stopColor="#D4A753" />
          </linearGradient>

          {/* Star Sparkle Gradient */}
          <linearGradient id="ayojaStarGrad" x1="88" y1="20" x2="108" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F4D068" />
            <stop offset="100%" stopColor="#D4A753" />
          </linearGradient>

          {/* Drop shadow filter for premium depth */}
          <filter id="ayojaGlow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6C1D4F" floodOpacity="0.15" />
          </filter>
        </defs>

        <g filter="url(#ayojaGlow)">
          {/* Left Flowing Ribbon Form ("People") */}
          <path
            d="M 24 88 C 22 75, 29 65, 42 56 C 54 47, 59 36, 62 20 C 62 20, 68 38, 58 58 C 48 78, 38 88, 24 88 Z"
            fill="url(#ayojaLeftGrad)"
          />

          {/* Right Flowing Ribbon Form ("Plans & Moments", forming letter 'A') */}
          <path
            d="M 62 20 C 66 35, 68 52, 75 68 C 82 82, 94 92, 102 96 C 88 95, 78 85, 70 70 C 64 58, 62 38, 62 20 Z"
            fill="url(#ayojaRightGrad)"
          />

          {/* Overlapping connecting bridge to solidify the letter 'A' */}
          <path
            d="M 38 72 C 48 64, 64 64, 76 72 C 67 76, 50 76, 38 72 Z"
            fill="#C43B68"
            opacity="0.85"
          />

          {/* 4-Point Celebratory Star / Sparkle at Top Right ("Celebration & Joy") */}
          <path
            d="M 98 16 Q 98 28 86 28 Q 98 28 98 40 Q 98 28 110 28 Q 98 28 98 16 Z"
            fill="url(#ayojaStarGrad)"
          />
        </g>
      </svg>

      {/* Typography Wordmark & Tagline */}
      {showWordmark && (
        <div className="flex flex-col leading-tight select-none">
          <span
            className={`font-serif font-black tracking-[0.22em] uppercase ${textSizes[size]} bg-gradient-to-r from-[#6C1D4F] via-[#A82D5C] to-[#F0656B] dark:from-[#F0656B] dark:via-[#F9E8E1] dark:to-[#D4A753] bg-clip-text text-transparent`}
            style={{ fontFamily: 'var(--font-serif), Playfair Display, Georgia, serif' }}
          >
            AYOJA
          </span>
          {showTagline && (
            <span
              className={`font-sans tracking-[0.18em] uppercase text-muted-foreground font-semibold ${taglineSizes[size]} mt-0.5`}
            >
              YOUR PLANS. YOUR PEOPLE. YOUR MOMENTS.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

