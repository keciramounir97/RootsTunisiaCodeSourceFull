/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Archive,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Compass,
  FileText,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Music,
  Network,
  Newspaper,
  Search,
  Sun,
  X,
  CheckCircle,
  Download,
  HelpCircle,
  Crown,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useThemeStore } from "../store/theme";
import { useAuth } from "../admin/components/AuthContext";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import LanguageMenu from "./LanguageMenu";
import logoSvg from "../assets/logo.svg";

const searchSchema = z.object({
  query: z.string().min(1, "Search cannot be empty"),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface SuggestionItem {
  id: string | number;
  title?: string;
  name?: string;
  tree_title?: string;
}

interface NavItem {
  to: string;
  label: string;
  tooltip?: string;
  icon: ComponentType<{ className?: string }>;
}

export default function Navbar() {
  // @ts-ignore - store is intentionally small
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"gallery" | "explore" | null>(null);
  const [suggestions, setSuggestions] = useState<{
    trees: SuggestionItem[];
    people: SuggestionItem[];
  }>({ trees: [], people: [] });
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState("");
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQueryRef = useRef("");

  const { register, handleSubmit, watch, setValue } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });
  const searchField = register("query");
  const query = watch("query") || "";

  const navLinks: NavItem[] = [{ to: "/", label: t("home", "Home"), icon: Home }];

  /**
   * Secondary destinations live in a dropdown so the desktop row never wraps
   * onto a second line (and never pushes the logout button out of the
   * container) at 100% browser zoom.
   */
  const exploreDropdownItems: NavItem[] = [
    {
      to: "/periods",
      label: t("heritage_timeline", "Timeline"),
      icon: Compass,
    },
    {
      to: "/archives",
      label: t("archives_records", "Archives"),
      icon: Archive,
    },
    {
      to: "/subscriptions",
      label: t("subscriptions", "Subscriptions"),
      icon: Crown,
    },
    {
      to: "/help-center",
      label: t("help_center", "Help Center"),
      icon: HelpCircle,
    },
  ];

  const galleryDropdownItems: NavItem[] = [
    {
      to: "/gallery/trees",
      label: t("trees_short", "Trees"),
      tooltip: t("trees_full_name", "Family Trees"),
      icon: Network,
    },
    { to: "/gallery/audios", label: t("audios", "Audios"), icon: Music },
    { to: "/gallery/images", label: t("images", "Images"), icon: Image },
    {
      to: "/gallery/documents",
      label: t("documents", "Documents"),
      icon: FileText,
    },
    { to: "/gallery/books", label: t("books", "Books"), icon: BookOpen },
    {
      to: "/gallery/articles",
      label: t("articles", "Articles"),
      icon: Newspaper,
    },
  ];

  const navMenus = [
    {
      id: "gallery" as const,
      label: t("gallery", "Gallery"),
      items: galleryDropdownItems,
      active: location.pathname.startsWith("/gallery"),
    },
    {
      id: "explore" as const,
      label: t("explore", "Explore"),
      items: exploreDropdownItems,
      active: exploreDropdownItems.some((item) =>
        location.pathname.startsWith(item.to),
      ),
    },
  ];

  const myRequestsLabel = t("my_download_requests", "My Requests");

  const onSubmit = (data: SearchFormData) => {
    const q = data.query.trim();
    if (!q) return;
    setSuggestOpen(false);
    setSidebarOpen(false);
    navigate(`/gallery?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      const target = event.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const q = String(query || "").trim();
    latestQueryRef.current = q;
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);

    if (q.length < 2) {
      setSuggestions({ trees: [], people: [] });
      setSuggestOpen(false);
      setSuggestLoading(false);
      setSuggestError("");
      return;
    }

    suggestTimerRef.current = setTimeout(async () => {
      setSuggestLoading(true);
      setSuggestError("");
      try {
        const { data } = await api.get(
          `/search/suggest?q=${encodeURIComponent(q)}`,
        );
        if (latestQueryRef.current !== q) return;
        setSuggestions({
          trees: Array.isArray(data?.trees) ? data.trees : [],
          people: Array.isArray(data?.people) ? data.people : [],
        });
        setSuggestOpen(true);
      } catch (err: any) {
        if (latestQueryRef.current !== q) return;
        setSuggestError(
          err.response?.data?.message ||
            t("suggestions_load_failed", "Failed to load suggestions"),
        );
        setSuggestions({ trees: [], people: [] });
      } finally {
        if (latestQueryRef.current === q) setSuggestLoading(false);
      }
    }, 280);

    return () => {
      if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    };
  }, [query, t]);

  const handlePickSuggestion = (value?: string) => {
    if (!value) return;
    setValue("query", value, { shouldValidate: true });
    setSuggestOpen(false);
    setSidebarOpen(false);
    navigate(`/gallery?q=${encodeURIComponent(value)}`);
  };

  const logo = (
    <div className="flex items-center gap-2">
      <img
        src={logoSvg}
        alt="Roots Tunisia"
        className="h-9 w-auto object-contain"
      />
    </div>
  );

  return (
    <>
      <div className="navbar-wrapper">
        <header className="navbar-header">
        <div className="navbar-container">
          <div className="navbar-left">
            <button
              type="button"
              className="navbar-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label={t("menu", "Menu")}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="navbar-logo" aria-label={"Roots Tunisia"}>
              {logo}
            </Link>
          </div>

          <nav
            className="navbar-nav"
            ref={navRef}
            aria-label={t("primary_navigation", "Primary")}
          >
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `navbar-link${isActive ? " active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}

            {navMenus.map(({ id, label, items, active }) => {
              const menuId = `navbar-${id}-menu`;
              const isOpen = openMenu === id;
              return (
                <div className="navbar-dropdown" key={id}>
                  <button
                    type="button"
                    className={`navbar-link navbar-dropdown-trigger${isOpen ? " open" : ""}${active ? " active" : ""}`}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    aria-controls={menuId}
                    onClick={() => setOpenMenu(isOpen ? null : id)}
                  >
                    {label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="navbar-dropdown-menu" id={menuId} role="menu">
                      {items.map(({ to, label: itemLabel, tooltip, icon: Icon }) => (
                        <NavLink
                          key={to}
                          to={to}
                          title={tooltip}
                          role="menuitem"
                          className={({ isActive }) =>
                            `navbar-dropdown-item${isActive ? " active" : ""}`
                          }
                          onClick={() => setOpenMenu(null)}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{itemLabel}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {user ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `navbar-link${isActive ? " active" : ""}`
                }
              >
                {user?.role === 1 || user?.role === 3
                  ? t("admin", "Admin")
                  : t("dashboard", "Dashboard")}
              </NavLink>
            ) : null}
            {/* Icon-only so the nav stays on a single row; label via tooltip */}
            {user ? (
              <NavLink
                to="/my-download-requests"
                title={myRequestsLabel}
                aria-label={myRequestsLabel}
                className={({ isActive }) =>
                  `navbar-link navbar-link--icon${isActive ? " active" : ""}`
                }
              >
                <ClipboardCheck className="w-[18px] h-[18px]" />
              </NavLink>
            ) : null}
          </nav>

          <div className="navbar-right">
            <form className="navbar-search" onSubmit={handleSubmit(onSubmit)}>
              <Search className="navbar-search-icon" />
              <input
                {...searchField}
                type="search"
                placeholder={t(
                  "search_placeholder",
                  "Search names, archives, or communities...",
                )}
                onFocus={() =>
                  String(query || "").trim().length >= 2 && setSuggestOpen(true)
                }
                onBlur={() =>
                  window.setTimeout(() => setSuggestOpen(false), 160)
                }
                aria-label={t("search", "Search")}
                className="navbar-search-input"
              />
              {suggestOpen ? (
                <div className="navbar-suggestions">
                  {suggestLoading ? (
                    <p className="navbar-suggest-item">
                      {t("loading", "Loading...")}
                    </p>
                  ) : suggestError ? (
                    <p className="navbar-suggest-item text-red-500">
                      {suggestError}
                    </p>
                  ) : suggestions.trees.length || suggestions.people.length ? (
                    <>
                      {suggestions.trees.map((item) => (
                        <button
                          key={`tree-${item.id}`}
                          type="button"
                          className="navbar-suggest-item"
                          onMouseDown={() => handlePickSuggestion(item.title)}
                        >
                          <strong>{item.title}</strong>
                          <span>{t("family_trees", "Family Trees")}</span>
                        </button>
                      ))}
                      {suggestions.people.map((item) => (
                        <button
                          key={`person-${item.id}`}
                          type="button"
                          className="navbar-suggest-item"
                          onMouseDown={() =>
                            handlePickSuggestion(item.name || "")
                          }
                        >
                          <strong>
                            {item.name || t("unknown", "Unknown")}
                          </strong>
                          <span>
                            {item.tree_title
                              ? `${t("tree", "Tree")}: ${item.tree_title}`
                              : t("person_record", "Person record")}
                          </span>
                        </button>
                      ))}
                    </>
                  ) : (
                    <p className="navbar-suggest-item">
                      {t("no_results", "No suggestions")}
                    </p>
                  )}
                </div>
              ) : null}
            </form>

            <button
              type="button"
              onClick={toggleTheme}
              className="navbar-icon-btn"
              aria-label={t("toggle_theme", "Toggle theme")}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            {/* Language Menu — code only (EN / FR / AR / HE) */}
            <LanguageMenu
              compact
              className="navbar-lang-wrap"
              buttonClassName="navbar-icon-btn navbar-lang-btn"
            />
            <Link
              to="/contact"
              className="navbar-icon-btn"
              aria-label={t("contact", "Contact")}
              title={t("contact", "Contact")}
            >
              <Mail className="w-5 h-5" />
            </Link>
            <div className="navbar-auth">
              {user ? (
                <div className="navbar-auth-group">
                  <span className="navbar-auth-user">
                    <span className="navbar-auth-name">
                      {user.fullName?.split(" ")[0]}
                    </span>
                    {user.status === "validated" ||
                    user.status === "approved" ? (
                      <CheckCircle
                        className="w-4 h-4 text-green-500 shrink-0"
                        aria-label={t("validated_account", "Validated Account")}
                      />
                    ) : null}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="navbar-logout-btn"
                    title={t("logout", "Logout")}
                    aria-label={t("logout", "Logout")}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="navbar-auth-label">
                      {t("logout", "Logout")}
                    </span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="navbar-login-btn"
                  title={t("login", "Login")}
                  aria-label={t("login", "Login")}
                >
                  <CircleUserRound className="w-4 h-4" />
                  <span className="navbar-auth-label">
                    {t("login", "Login")}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      </div>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        aria-label={t("navigation_sidebar", "Navigation sidebar")}
      >
        <div className="sidebar-header">
          <Link
            to="/"
            className="sidebar-logo"
            onClick={() => setSidebarOpen(false)}
          >
            {logo}
          </Link>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label={t("close", "Close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="sidebar-search" onSubmit={handleSubmit(onSubmit)}>
          <Search className="sidebar-search-icon" />
          <input
            {...searchField}
            type="search"
            placeholder={t(
              "search_placeholder",
              "Search names, archives, or communities...",
            )}
            className="sidebar-search-input"
          />
        </form>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">{t("menu", "Menu")}</div>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="sidebar-link-icon" />
              <span>{label}</span>
              <ChevronRight className="sidebar-link-arrow" />
            </NavLink>
          ))}

          {/* Gallery Section in Sidebar */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">
              {t("gallery", "Gallery")}
            </div>
            {galleryDropdownItems.map(({ to, label, tooltip, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                title={tooltip}
                className={({ isActive }) =>
                  `sidebar-link sidebar-sublink${isActive ? " active" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="sidebar-link-icon" />
                <span>{label}</span>
                <ChevronRight className="sidebar-link-arrow" />
              </NavLink>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">{t("explore", "Explore")}</div>
            {exploreDropdownItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar-link sidebar-sublink${isActive ? " active" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="sidebar-link-icon" />
                <span>{label}</span>
                <ChevronRight className="sidebar-link-arrow" />
              </NavLink>
            ))}
          </div>
          {user ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard className="sidebar-link-icon" />
              <span>
                {user?.role === 1 || user?.role === 3
                  ? t("admin", "Admin Panel")
                  : t("dashboard", "My Dashboard")}
              </span>
              <ChevronRight className="sidebar-link-arrow" />
            </NavLink>
          ) : null}
          {user ? (
            <NavLink
              to="/my-download-requests"
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Download className="sidebar-link-icon" />
              <span>{t("my_download_requests", "My Requests")}</span>
              <ChevronRight className="sidebar-link-arrow" />
            </NavLink>
          ) : null}
        </nav>

        <div className="sidebar-actions">
          <div className="sidebar-nav-label">{t("settings", "Settings")}</div>
          <button
            type="button"
            onClick={toggleTheme}
            className="sidebar-action-btn"
          >
            {theme === "dark" ? (
              <Sun className="sidebar-link-icon" />
            ) : (
              <Moon className="sidebar-link-icon" />
            )}
            <span>
              {theme === "dark"
                ? t("light_mode", "Light Mode")
                : t("dark_mode", "Dark Mode")}
            </span>
          </button>
          <LanguageMenu
            buttonClassName="sidebar-action-btn w-full"
            align="left"
          />
          <Link
            to="/contact"
            className="sidebar-action-btn w-full"
            onClick={() => setSidebarOpen(false)}
          >
            <Mail className="sidebar-link-icon" />
            <span>{t("contact", "Contact")}</span>
          </Link>
        </div>

        <div className="sidebar-footer">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4">
                <span className="text-sm font-medium opacity-80">
                  {user.fullName}
                </span>
                {user.status === "validated" ||
                user.status === "approved" ? (
                  <span title={t("validated_account", "Validated Account")}>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                }}
                className="sidebar-logout"
              >
                <LogOut className="w-5 h-5" />
                <span>{t("logout", "Logout")}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="sidebar-login"
              onClick={() => setSidebarOpen(false)}
            >
              <CircleUserRound className="w-5 h-5" />
              <span>{t("login", "Login")}</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
