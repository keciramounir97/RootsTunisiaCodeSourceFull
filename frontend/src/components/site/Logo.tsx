import { Link } from "react-router-dom";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]">
      {/* Red RT Monogram Badge with Gold Accent */}
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#E70013] text-white shadow-md ring-1 ring-[#E70013]/60 transition-all group-hover:shadow-[0_0_12px_rgba(231,0,19,0.5)]">
        <span className="font-display text-sm font-black tracking-tighter text-white drop-shadow-sm">
          RT
        </span>
        {/* Subtle decorative gold crescent / star accent dot */}
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--gold)] border-2 border-[var(--card)]" />
      </span>

      {/* Brand Typography */}
      <span className="leading-[1.05]">
        <span
          className={`block font-display text-lg font-bold tracking-wide transition-colors ${
            light ? "text-white" : "text-[var(--foreground)]"
          }`}
        >
          Roots
        </span>
        <span className="block font-display text-lg font-bold tracking-wide text-[var(--gold)]">
          Tunisia
        </span>
      </span>
    </Link>
  );
}

export default Logo;
