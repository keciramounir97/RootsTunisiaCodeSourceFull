import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./site/Logo";
import LanguageMenu from "./LanguageMenu";
import { useTranslation } from "../context/TranslationContext";
import { getTunisiaDropdownText } from "../utils/navDropdownTranslations";
import { splitLocaleFromPath } from "../seo/localeRouting";
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
  Phone,
} from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const { path: seoPath } = splitLocaleFromPath(location.pathname);
  const navigate = useNavigate();
  const { t, locale, isRtl } = useTranslation();
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
    "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--gold)] py-1";

  const exploreLinks = [
    {
      to: "/periods",
      label: getTunisiaDropdownText(locale, "nav_periods"),
      hint: getTunisiaDropdownText(locale, "nav_periods_hint"),
    },
    {
      to: "/sources",
      label: getTunisiaDropdownText(locale, "nav_sources"),
      hint: getTunisiaDropdownText(locale, "nav_sources_hint"),
    },
    {
      to: "/archives",
      label: getTunisiaDropdownText(locale, "nav_archives"),
      hint: getTunisiaDropdownText(locale, "nav_archives_hint"),
    },
    {
      to: "/subscriptions",
      label: getTunisiaDropdownText(locale, "nav_subscriptions"),
      hint: getTunisiaDropdownText(locale, "nav_subscriptions_hint"),
    },
  ];

  const galleryLinks = [
    {
      to: "/gallery",
      label: getTunisiaDropdownText(locale, "nav_gallery_hub"),
      hint: getTunisiaDropdownText(locale, "nav_gallery_hub_hint"),
    },
    {
      to: "/gallery/images",
      label: getTunisiaDropdownText(locale, "nav_photo_archives"),
      hint: getTunisiaDropdownText(locale, "nav_photo_archives_hint"),
    },
    {
      to: "/gallery/trees",
      label: getTunisiaDropdownText(locale, "nav_trees"),
      hint: getTunisiaDropdownText(locale, "nav_trees_hint"),
    },
    {
      to: "/library",
      label: getTunisiaDropdownText(locale, "nav_library"),
      hint: getTunisiaDropdownText(locale, "nav_library_hint"),
    },
    {
      to: "/audio",
      label: getTunisiaDropdownText(locale, "nav_audios"),
      hint: getTunisiaDropdownText(locale, "nav_audios_hint"),
    },
    {
      to: "/gallery/documents",
      label: getTunisiaDropdownText(locale, "nav_documents"),
      hint: getTunisiaDropdownText(locale, "nav_documents_hint"),
    },
    {
      to: "/gallery/articles",
      label: getTunisiaDropdownText(locale, "nav_articles"),
      hint: getTunisiaDropdownText(locale, "nav_articles_hint"),
    },
  ];

  const isExploreActive = ["/periods", "/sources", "/archives", "/subscriptions"].includes(
    seoPath
  );
  const isGalleryActive = [
    "/gallery",
    "/gallery/trees",
    "/gallery/images",
    "/gallery/articles",
    "/gallery/documents",
    "/articles",
    "/library",
    "/audio",
  ].some((path) => seoPath.startsWith(path));

  return (
    <header
      dir={isRtl ? "rtl" : "ltr"}
      className="sticky top-0 z-40 px-4 pt-3.5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-[var(--content-max)] items-center gap-3 sm:gap-6 lg:gap-8 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 px-3.5 py-3 sm:px-7 shadow-xl backdrop-blur-md">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 lg:gap-9 ms-2 lg:ms-4 md:flex">
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navClass} ${isActive ? "!text-[var(--gold)]" : ""}`
            }
          >
            {t("nav_home")}
          </NavLink>

          {/* Explore Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button
              className={`${navClass} flex items-center gap-1.5 cursor-pointer ${
                isExploreActive ? "!text-[var(--gold)]" : ""
              }`}
            >
              <span>{getTunisiaDropdownText(locale, "nav_explore")}</span>
              <ChevronDown className="h-3 w-3 shrink-0" />
            </button>
            {exploreOpen && (
              <div className="absolute start-0 top-full w-56 pt-2 z-50 text-start">
                <div className="surface-card overflow-hidden p-1.5 shadow-xl border border-[var(--gold)]/40 rounded-sm">
                  {exploreLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setExploreOpen(false)}
                      className="block rounded-sm px-3 py-2 text-xs font-semibold tracking-wide text-[var(--foreground)] text-start transition-colors hover:bg-[var(--gold)]/15 hover:text-[var(--gold)]"
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
              className={`${navClass} flex items-center gap-1.5 cursor-pointer ${
                isGalleryActive ? "!text-[var(--gold)]" : ""
              }`}
            >
              <span>{getTunisiaDropdownText(locale, "nav_gallery")}</span>
              <ChevronDown className="h-3 w-3 shrink-0" />
            </button>
            {galleryOpen && (
              <div className="absolute start-0 top-full w-72 pt-2 z-50 text-start">
                <div className="surface-card overflow-hidden p-1.5 shadow-xl border border-[var(--gold)]/40 rounded-sm">
                  {galleryLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setGalleryOpen(false)}
                      className="block rounded-sm px-3 py-2.5 text-start transition-colors hover:bg-[var(--gold)]/15 hover:text-[var(--gold)]"
                    >
                      <span className="block text-xs font-semibold tracking-wide text-[var(--foreground)]">
                        {l.label}
                      </span>
                      {"hint" in l && l.hint ? (
                        <span className="mt-0.5 block text-[0.65rem] font-normal text-[var(--muted-foreground)]">
                          {l.hint}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${navClass} ${isActive ? "!text-[var(--gold)]" : ""}`
            }
          >
            {t("nav_about")}
          </NavLink>
        </nav>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2.5">
          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden items-center gap-2 rounded-sm border border-[var(--border)] bg-[var(--background)]/70 px-3.5 py-1.5 lg:flex h-[34px]"
          >
            <Search className="h-3.5 w-3.5 text-[var(--muted-foreground)] shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav_search_placeholder")}
              className="w-36 bg-transparent text-xs text-[var(--foreground)] text-start outline-none placeholder:text-[var(--muted-foreground)] focus:w-48 transition-all"
            />
          </form>

          {/* Contact Icon Button */}
          <NavLink
            to="/contact"
            aria-label={t("nav_contact")}
            title={t("nav_contact")}
            className={({ isActive }) =>
              `h-[34px] w-[34px] rounded-sm border flex items-center justify-center transition-colors cursor-pointer ${
                isActive
                  ? "border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)]"
                  : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/15 hover:text-[var(--gold)]"
              }`
            }
          >
            <Phone className="h-4 w-4" />
          </NavLink>

          {/* Language Switcher */}
          <LanguageMenu />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={t("toggle_theme")}
            title={t("toggle_theme")}
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
                className="h-[34px] flex items-center gap-1.5 rounded-sm bg-[#b81428] !text-white px-2.5 sm:px-3.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline max-w-[90px] truncate">{user.fullName || t("nav_account")}</span>
                <ChevronDown className="h-3 w-3 shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute end-0 top-full mt-2 w-48 surface-card p-1.5 shadow-2xl border border-[var(--gold)]/40 z-50 rounded-sm">
                  <div className="px-3 py-2 border-b border-[var(--gold)]/20 mb-1">
                    <p className="text-xs font-bold text-[var(--foreground)] truncate">{user.fullName}</p>
                    <p className="text-[0.65rem] text-[var(--muted-foreground)] truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--gold)]/15 hover:text-[var(--gold)]"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[var(--gold)]" />
                    {user.role === 1 || user.role === 3 ? t("nav_admin") : t("nav_dashboard")}
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
                    {t("nav_signout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              aria-label={t("nav_login")}
              title={t("nav_login")}
              className="h-[34px] flex items-center gap-1.5 rounded-sm bg-[#b81428] !text-white px-2.5 sm:px-3.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] hover:opacity-90 transition-opacity shadow-sm"
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{t("nav_login")}</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            aria-label={t("toggle_menu")}
            onClick={() => setOpen((v) => !v)}
            className="h-[34px] w-[34px] flex items-center justify-center rounded-sm border border-[var(--border)] text-[var(--foreground)] md:hidden cursor-pointer"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="mx-auto mt-2 w-full max-w-[var(--content-max)] rounded-lg border border-[var(--gold)]/30 bg-[var(--card)] p-4 text-start shadow-xl backdrop-blur-md md:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-3 flex items-center gap-2 border border-[var(--border)] bg-[var(--background)] px-3 py-2 rounded-sm">
            <Search className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav_search_placeholder")}
              className="w-full bg-transparent text-xs text-[var(--foreground)] text-start outline-none"
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
              {t("nav_home")}
            </NavLink>

            <div className="py-1">
              <p className="px-3 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--gold)]">
                {getTunisiaDropdownText(locale, "nav_explore")}
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
                {getTunisiaDropdownText(locale, "nav_gallery")}
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
              to="/about"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-sm px-3 py-2 text-xs font-semibold ${
                  isActive
                    ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                    : "text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                }`
              }
            >
              {t("nav_about")}
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-semibold ${
                  isActive
                    ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                    : "text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                }`
              }
            >
              <Phone className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
              <span>{t("nav_contact")}</span>
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
