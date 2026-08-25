import { Link } from "react-router-dom";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="grid h-9 w-9 shrink-0 grid-cols-3 grid-rows-3 gap-[2px] rounded-sm p-[3px] ring-1 ring-[var(--gold)]/60 bg-transparent">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className={
              [0, 2, 4, 6, 8].includes(i)
                ? "rounded-[1px] bg-[var(--gold)]"
                : "rounded-[1px] bg-[var(--primary)]/75"
            }
          />
        ))}
      </span>
      <span className="leading-[1.05]">
        <span
          className={`block font-display text-lg font-semibold tracking-wide ${
            light ? "text-[var(--parchment)]" : "text-[var(--foreground)]"
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
