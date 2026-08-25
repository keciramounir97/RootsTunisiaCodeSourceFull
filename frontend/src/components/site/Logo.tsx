import { Link } from "react-router-dom";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]">
      {/* Authentic Roots Tunisia 9-tile geometric mosaic emblem */}
      <span className="grid h-9 w-9 shrink-0 grid-cols-3 grid-rows-3 gap-[2px] rounded-sm p-[3px] ring-1 ring-[var(--gold)]/60 bg-[var(--card)] shadow-sm">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={
              [0, 2, 4, 6, 8].includes(i)
                ? "rounded-[1px] bg-[var(--gold)]"
                : "rounded-[1px] bg-[#E70013]/80"
            }
          />
        ))}
      </span>
      <span className="leading-[1.05]">
        <span
          className={`block font-display text-lg font-semibold tracking-wide ${
            light ? "text-white" : "text-[var(--foreground)]"
          }`}
        >
          Roots
        </span>
        <span className="block font-display text-lg font-semibold tracking-wide text-[var(--gold)]">
          Tunisia
        </span>
      </span>
    </Link>
  );
}

export default Logo;
