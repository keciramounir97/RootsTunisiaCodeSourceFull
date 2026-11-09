import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import {
  ChevronDown,
  Image as ImageIcon,
  FileText,
  Music,
  BookOpen,
  Search,
  X,
  ExternalLink,
  Check,
} from "lucide-react";

export type MediaOptionType = "image" | "document" | "audio" | "book" | "other";

export interface MediaOption {
  value: string;
  label: string;
  sublabel?: string;
  type?: MediaOptionType;
  previewUrl?: string;
  badge?: string;
  details?: string;
  category?: string;
}

interface MediaSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: MediaOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function MediaSelect({
  value,
  onChange,
  options,
  placeholder = "Sélectionner un élément…",
  label,
  className = "",
  disabled = false,
}: MediaSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hoveredOption, setHoveredOption] = useState<MediaOption | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionListRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHoveredOption(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options
  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q)) ||
        (opt.badge && opt.badge.toLowerCase().includes(q)) ||
        (opt.category && opt.category.toLowerCase().includes(q)) ||
        opt.value.toLowerCase().includes(q),
    );
  }, [options, search]);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || null,
    [options, value],
  );

  const handleOptionHover = (opt: MediaOption, e: React.MouseEvent<HTMLDivElement>) => {
    const targetRect = e.currentTarget.getBoundingClientRect();
    const dropdownRect = dropdownRef.current?.getBoundingClientRect();

    if (dropdownRect) {
      // Determine if tooltip should appear to the left or right of dropdown
      const spaceRight = window.innerWidth - dropdownRect.right;
      const left = spaceRight > 320 ? dropdownRect.right + 10 : dropdownRect.left - 310;
      const top = Math.max(10, Math.min(targetRect.top - 20, window.innerHeight - 280));
      setTooltipPos({ top, left: Math.max(10, left) });
    }
    setHoveredOption(opt);
  };

  const renderIcon = (type?: MediaOptionType) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4 shrink-0 text-[var(--gold)]" />;
      case "document":
        return <FileText className="h-4 w-4 shrink-0 text-[var(--gold)]" />;
      case "audio":
        return <Music className="h-4 w-4 shrink-0 text-[var(--gold)]" />;
      case "book":
        return <BookOpen className="h-4 w-4 shrink-0 text-[var(--gold)]" />;
      default:
        return <FileText className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative text-start ${className}`}>
      {label ? (
        <label className="block text-[0.7rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
          {label}
        </label>
      ) : null}

      {/* Select Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--gold)] focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 disabled:opacity-50 cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption?.previewUrl ? (
            <img
              src={selectedOption.previewUrl}
              alt=""
              className="h-6 w-6 rounded object-cover border border-[var(--gold)]/40 shrink-0"
            />
          ) : (
            renderIcon(selectedOption?.type)
          )}
          <span className="truncate text-xs sm:text-sm font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge ? (
            <span className="rounded bg-[var(--gold)]/15 border border-[var(--gold)]/35 px-1.5 py-0.5 text-[0.62rem] font-bold text-[var(--gold)] shrink-0">
              {selectedOption.badge}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="Effacer"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setHoveredOption(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                  setHoveredOption(null);
                }
              }}
              className="p-1 rounded hover:bg-[var(--gold)]/20 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
            >
              <X className="h-3 w-3" />
            </span>
          ) : null}
          <ChevronDown
            className={`h-4 w-4 text-[var(--muted-foreground)] transition-transform duration-200 ${
              open ? "rotate-180 text-[var(--gold)]" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {open ? (
        <div
          ref={dropdownRef}
          className="absolute start-0 top-full z-50 mt-1.5 w-full min-w-[280px] sm:min-w-[340px] rounded-xl border border-[var(--gold)]/40 bg-[var(--card)]/98 p-2 shadow-2xl backdrop-blur-md animate-fade-in"
        >
          {/* Quick Search */}
          {options.length > 5 ? (
            <div className="relative mb-2">
              <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher parmi les options…"
                className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] ps-8 pe-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>
          ) : null}

          {/* Options List */}
          <div
            ref={optionListRef}
            className="max-h-64 overflow-y-auto space-y-1 pe-1 scrollbar-thin"
            onMouseLeave={() => setHoveredOption(null)}
          >
            {filteredOptions.length === 0 ? (
              <p className="p-3 text-center text-xs text-[var(--muted-foreground)]">
                Aucun élément correspondant.
              </p>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setHoveredOption(null);
                    }}
                    onMouseEnter={(e) => handleOptionHover(opt, e)}
                    className={`flex items-center justify-between gap-2.5 rounded-lg p-2 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[var(--gold)]/20 text-[var(--foreground)] font-bold border border-[var(--gold)]/40"
                        : "hover:bg-[var(--gold)]/10 text-[var(--foreground)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {opt.previewUrl ? (
                        <img
                          src={opt.previewUrl}
                          alt=""
                          className="h-8 w-8 rounded object-cover border border-[var(--gold)]/30 shrink-0 bg-black/10"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 shrink-0">
                          {renderIcon(opt.type)}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="truncate font-semibold">{opt.label}</p>
                        {opt.sublabel ? (
                          <p className="truncate text-[0.65rem] text-[var(--muted-foreground)]">
                            {opt.sublabel}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    {opt.badge ? (
                      <span className="rounded bg-[var(--background)] border border-[var(--border)] px-1.5 py-0.5 text-[0.62rem] font-bold text-[var(--muted-foreground)] shrink-0">
                        {opt.badge}
                      </span>
                    ) : null}
                    {isSelected ? (
                      <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}

      {/* Floating Hover Tooltip Preview */}
      {open && hoveredOption ? (
        <div
          style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}
          className="fixed z-[9999] pointer-events-none w-72 rounded-xl border-2 border-[var(--gold)]/60 bg-[var(--card)]/98 p-3.5 shadow-2xl backdrop-blur-md animate-fade-in text-start hidden sm:block"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-[var(--gold)]/25 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                {renderIcon(hoveredOption.type)}
              </span>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--gold)]">
                Aperçu {hoveredOption.type || "Média"}
              </span>
            </div>
            {hoveredOption.badge ? (
              <span className="rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 px-2 py-0.5 text-[0.62rem] font-extrabold text-[var(--gold)]">
                {hoveredOption.badge}
              </span>
            ) : null}
          </div>

          {/* Visual Thumbnail */}
          {hoveredOption.previewUrl ? (
            <div className="aspect-[16/10] overflow-hidden rounded-lg border border-[var(--gold)]/35 bg-black/10 mb-2.5">
              <img
                src={hoveredOption.previewUrl}
                alt={hoveredOption.label}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-[var(--gold)]/20 bg-[var(--gold)]/5 text-[var(--gold)] mb-2.5">
              {renderIcon(hoveredOption.type)}
            </div>
          )}

          {/* Metadata */}
          <h4 className="font-display font-bold text-sm text-[var(--foreground)] line-clamp-2">
            {hoveredOption.label}
          </h4>

          {hoveredOption.sublabel ? (
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-1">
              {hoveredOption.sublabel}
            </p>
          ) : null}

          {hoveredOption.details ? (
            <p className="text-[0.68rem] text-[var(--foreground)]/80 mt-2 p-2 rounded bg-[var(--background)]/80 border border-[var(--border)] leading-relaxed">
              {hoveredOption.details}
            </p>
          ) : null}

          <p className="mt-2 text-[0.6rem] font-mono text-[var(--muted-foreground)] truncate">
            {hoveredOption.value}
          </p>
        </div>
      ) : null}
    </div>
  );
}
