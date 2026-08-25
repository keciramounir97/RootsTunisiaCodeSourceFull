import { memo } from "react";

/**
 * Tunisian Heritage Logo Mark — Features the iconic Golden Crescent & Star
 * harmoniously intertwined with the Genealogical Tree of Life roots.
 */
export const TunisianLogoMark = memo(function TunisianLogoMark({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tn-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="tn-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="50%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <filter id="tn-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Circular Emblem Base with Subtle Gold Rim */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="url(#tn-red-grad)"
        stroke="url(#tn-gold-grad)"
        strokeWidth="2.5"
        filter="url(#tn-shadow)"
      />

      {/* Inner White Sun / Heritage Disk */}
      <circle cx="50" cy="50" r="32" fill="#FFFFFF" opacity="0.96" />

      {/* Stylized Red Crescent of Tunisia */}
      <path
        d="M 54 26 A 24 24 0 1 0 54 74 A 19 19 0 1 1 54 26 Z"
        fill="url(#tn-red-grad)"
      />

      {/* 5-Pointed Star of Tunisia */}
      <polygon
        points="57,38 60,46 68,46 62,51 64,59 57,54 50,59 52,51 46,46 54,46"
        fill="url(#tn-red-grad)"
      />

      {/* Tree of Life Roots Accent in Gold */}
      <path
        d="M 36 68 Q 44 60 50 63 Q 56 60 64 68 M 50 63 L 50 72 M 42 65 Q 38 72 34 75 M 58 65 Q 62 72 66 75"
        stroke="url(#tn-gold-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export default TunisianLogoMark;
