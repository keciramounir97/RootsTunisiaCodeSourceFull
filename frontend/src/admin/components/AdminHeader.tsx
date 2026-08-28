import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, User, LogOut, ExternalLink, PanelLeft, PanelLeftClose } from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";
import { useAuth } from "./AuthContext";
import LanguageMenu from "../../components/LanguageMenu";

export default function AdminHeader({
  sidebarOpen,
  onToggleSidebar,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/gallery?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className={`fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-[var(--gold)]/30 bg-[var(--card)]/95 px-4 backdrop-blur shadow-sm transition-all duration-300 sm:px-6 ${sidebarOpen ? "lg:left-64" : "left-0"}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          title={sidebarOpen ? t("close_sidebar", "Close Sidebar") : t("open_sidebar", "Open Sidebar")}
          className="rounded p-2 text-[var(--foreground)] hover:bg-[var(--gold)]/15 transition-colors cursor-pointer"
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5 text-[var(--gold)]" /> : <PanelLeft className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 max-w-md mx-2 sm:mx-6 flex justify-center">
        <form onSubmit={handleSearch} className="w-full max-w-sm flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--background)]/60 px-3 py-1.5 focus-within:border-[var(--gold)] transition-colors">
          <Search className="h-3.5 w-3.5 text-[var(--muted-foreground)] shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("nav_search_placeholder", "Search records or trees…")}
            className="w-full bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline"
        >
          <span>{t("view_public_site", "View Public Site")}</span>
          <ExternalLink className="h-3 w-3" />
        </Link>

        <LanguageMenu />

        <div className="flex items-center gap-2 pl-2 border-l border-[var(--gold)]/25">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white uppercase">
            {user?.name ? user.name.charAt(0) : "U"}
          </div>
          <button
            onClick={() => logout()}
            title={t("nav_signout", "Sign Out")}
            className="p-1.5 text-[var(--muted-foreground)] hover:text-red-500 rounded hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
