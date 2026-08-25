import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";

const galleryLinks = [
  { to: "/genealogy-gallery", label: "Family Trees" },
  { to: "/gallery", label: "Photo Gallery" },
  { to: "/library", label: "Library" },
  { to: "/audio", label: "Oral Histories" },
  { to: "/articles", label: "Articles" },
];

const mainLinks = [
  { to: "/periods", label: "Periods" },
  { to: "/sources", label: "Sources" },
  { to: "/archives", label: "Archives" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/contact", label: "Contact" },
];

const navClass =
  "text-[0.7rem] font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-gold";

export function Header() {
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-md border border-gold/40 bg-card/95 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur">
        <Logo />

        <nav className="ml-6 hidden items-center gap-6 lg:flex">
          <Link to="/" className={navClass} activeProps={{ className: "text-gold" }}>
            Home
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setGalleryOpen(true)}
            onMouseLeave={() => setGalleryOpen(false)}
          >
            <button className={`${navClass} flex items-center gap-1`}>
              Gallery <ChevronDown className="h-3 w-3" />
            </button>
            {galleryOpen && (
              <div className="absolute left-0 top-full w-56 pt-3">
                <div className="surface-card overflow-hidden p-1.5">
                  {galleryLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="block rounded-sm px-3 py-2 text-xs font-semibold tracking-wide text-foreground transition-colors hover:bg-gold/15 hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {mainLinks.map((l) => (
            <Link key={l.to} to={l.to} className={navClass} activeProps={{ className: "text-gold" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <label className="hidden items-center gap-2 rounded-sm border border-border bg-background/60 px-3 py-2 xl:flex">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search records…"
              className="w-32 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <span className="hidden rounded-sm border border-border px-2.5 py-2 text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground sm:inline-block">
            EN
          </span>
          <Link to="/login" className="btn-base btn-red px-4 py-2 text-[0.65rem]">
            <User className="h-3.5 w-3.5" /> Login
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-sm border border-border p-2 text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-md border border-gold/40 bg-card p-3 lg:hidden">
          <div className="grid gap-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="rounded-sm px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground hover:bg-gold/15"
            >
              Home
            </Link>
            {[...galleryLinks, ...mainLinks].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-foreground hover:bg-gold/15"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="btn-base btn-gold mt-2"
            >
              Join Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
