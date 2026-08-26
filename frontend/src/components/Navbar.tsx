import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./site/Logo";
import LanguageMenu from "./LanguageMenu";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../admin/components/AuthContext";
import {
  Menu,
  X,
  Sun,
  Moon,
  Search,
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gallery?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const navClass =
    "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--gold)]";

  const exploreLinks = [
    { to: "/periods", label: t("nav_periods", "Historical Periods") },
    { to: "/sources", label: t("nav_sources", "Primary Sources") },
    { to: "/archives", label: t("nav_archives", "National Archives") },
    { to: "/subscriptions", label: t("nav_subscriptions", "Plans & Pricing") },
  ];

  const galleryLinks = [
    { to: "/gallery/trees", label: t("nav_trees", "Family Trees & Pedigrees") },
    { to: "/gallery", label: t("nav_photos", "Photo & Visual Gallery") },
    { to: "/library", label: t("nav_library", "Manuscripts & Books") },
    { to: "/audio", label: t("nav_audios", "Oral Histories & Audio") },
    { to: "/articles", label: t("nav_articles", "Genealogical Articles") },
  ];

  const isExploreActive = ["/periods", "/sources", "/archives", "/subscriptions"].includes(
    location.pathname
  );
  const isGalleryActive = [
    "/gallery",
    "/gallery/trees",
    "/gallery/images",
    "/library",
    "/audio",
    "/articles",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-lg border border-[var(--gold)]/30 bg-[var(--card)]/90 px-4 py-2.5 shadow-xl backdrop-blur-md">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 md:flex">
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navClass} ${isActive ? "!text-[var(--gold)]" : ""}`
            }
          >
            {t("nav_home", "Home")}
          </NavLink>

          {/* Explore Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button
              className={`${navClass} flex items-center gap-1 py-1 cursor-pointer ${
                isExploreActive ? "!text-[var(--gold)]" : ""
              }`}
            >
              {t("nav_explore", "Explore")} <ChevronDown className="h-3 w-3" />
            </button>
            {exploreOpen && (
              <div className="absolute start-0 top-full w-56 pt-2 z-50">
                <div className="surface-card overflow-hidden p-1.5 shadow-xl border border-[var(--gold)]/40 rounded-sm">
                  {exploreLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setExploreOpen(false)}
                      className="block rounded-sm px-3 py-2 text-xs font-semibold tracking-wide text-[var(--foreground)] transition-colors hover:bg-[var(--gold)]/15 hover:text-[var(--gold)]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gallery Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setGalleryOpen(true)}
            onMouseLeave={() => setGalleryOpen(false)}
          >
            <button
              className={`${navClass} flex items-center gap-1 py-1 cursor-pointer ${
                isGalleryActive ? "!text-[var(--gold)]" : ""
              }`}
            >
              {t("nav_gallery", "Gallery")} <ChevronDown className="h-3 w-3" />
            </button>
            {galleryOpen && (
              <div className="absolute start-0 top-full w-56 pt-2 z-50">
                <div className="surface-card overflow-hidden p-1.5 shadow-xl border border-[var(--gold)]/40 rounded-sm">
                  {galleryLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setGalleryOpen(false)}
                      className="block rounded-sm px-3 py-2 text-xs font-semibold tracking-wide text-[var(--foreground)] transition-colors hover:bg-[var(--gold)]/15 hover:text-[var(--gold)]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${navClass} ${isActive ? "!text-[var(--gold)]" : ""}`
            }
          >
            {t("nav_contact", "Contact")}
          </NavLink>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden items-center gap-2 rounded-sm border border-[var(--border)] bg-[var(--background)]/60 px-3 py-1.5 xl:flex h-[34px]"
          >
            <Search className="h-3.5 w-3.5 text-[var(--muted-foreground)] shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav_search_placeholder", "Search records…")}
              className="w-32 bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:w-44 transition-all"
            />
          </form>

          {/* Language Switcher */}
          <LanguageMenu />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className="h-[34px] w-[34px] rounded-sm border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--gold)]/15 transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-[var(--gold)]" />
            ) : (
              <Moon className="h-4 w-4 text-[var(--muted-foreground)]" />
            )}
          </button>

          {/* Auth State Button (Identical Height to Theme Toggle) */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-[34px] flex items-center gap-1.5 rounded-sm bg-[var(--primary)] text-white px-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                <User className="h-3.5 w-3.5" />
                <span className="max-w-[90px] truncate">{user.name || t("nav_account", "Account")}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {userMenuOpen && (
                <div className="absolute end-0 top-full mt-2 w-48 surface-card p-1.5 shadow-2xl border border-[var(--gold)]/40 z-50 rounded-sm">
                  <div className="px-3 py-2 border-b border-[var(--gold)]/20 mb-1">
                    <p className="text-xs font-bold text-[var(--foreground)] truncate">{user.name}</p>
                    <p className="text-[0.65rem] text-[var(--muted-foreground)] truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--gold)]/15 hover:text-[var(--gold)]"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[var(--gold)]" />
                    {user.role === 1 || user.role === 3 ? t("nav_admin", "Admin Portal") : t("nav_dashboard", "Dashboard")}
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 text-start cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {t("nav_signout", "Sign Out")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="h-[34px] flex items-center gap-1.5 rounded-sm bg-[var(--primary)] text-white px-3.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] hover:opacity-90 transition-opacity shadow-sm"
            >
              <User className="h-3.5 w-3.5" /> {t("nav_login", "Sign In")}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="h-[34px] w-[34px] flex items-center justify-center rounded-sm border border-[var(--border)] text-[var(--foreground)] lg:hidden cursor-pointer"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-lg border border-[var(--gold)]/30 bg-[var(--card)] p-4 shadow-xl backdrop-blur-md md:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-3 flex items-center gap-2 border border-[var(--border)] bg-[var(--background)] px-3 py-2 rounded-sm">
            <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav_search_placeholder", "Search records…")}
              className="w-full bg-transparent text-xs text-[var(--foreground)] outline-none"
            />
          </form>

          <nav className="grid gap-2">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-sm px-3 py-2 text-xs font-semibold ${
                  isActive
                    ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                    : "text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                }`
              }
            >
              {t("nav_home", "Home")}
            </NavLink>

            <div className="py-1">
              <p className="px-3 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--gold)]">
                {t("nav_explore", "Explore")}
              </p>
              {exploreLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm px-3 py-1.5 text-xs ${
                      isActive
                        ? "bg-[var(--gold)]/20 text-[var(--gold)] font-bold"
                        : "text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="py-1">
              <p className="px-3 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--gold)]">
                {t("nav_gallery", "Heritage Collections")}
              </p>
              {galleryLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm px-3 py-1.5 text-xs ${
                      isActive
                        ? "bg-[var(--gold)]/20 text-[var(--gold)] font-bold"
                        : "text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-sm px-3 py-2 text-xs font-semibold ${
                  isActive
                    ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                    : "text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                }`
              }
            >
              {t("nav_contact", "Contact")}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
