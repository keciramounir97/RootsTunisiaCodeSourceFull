/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-finally */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Archive,
  BookOpen,
  Image,
  Music,
  Network,
  Plus,
  RefreshCcw,
  Search,
  Shield,
  UserRound,
  Users,
  Gauge,
  Crown,
  Power,
  ListChecks,
  StickyNote,
  MessageSquare,
} from "lucide-react";
import { fetchStats, fetchRecentActivity } from "../utils/api";
import { formatDate } from "../utils/helpers";
import { useThemeStore } from "../../store/theme";
import { useTranslation } from "../../context/TranslationContext";
import { useAuth } from "../components/AuthContext";
import { api } from "../../api/client";

/* -------------------- STAT CARD -------------------- */
function StatCard({ title, value, helper, Icon, tone }: any) {
  return (
    <article className="easy-stat-card interactive-card">
      <div className={`easy-stat-icon ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p>{title}</p>
        <strong>{value}</strong>
        {helper ? <span>{helper}</span> : null}
      </div>
    </article>
  );
}

/* -------------------- QUICK ACTION -------------------- */
function QuickAction({ to, title, desc, Icon }: any) {
  return (
    <Link to={to} className="easy-action-card interactive-card">
      <Icon className="w-5 h-5 text-accent-gold" />
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
    </Link>
  );
}

/* -------------------- DASHBOARD -------------------- */
export default function Dashboard() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const roleId = Number(user?.role ?? (user as any)?.role_id ?? (user as any)?.roleId ?? 0);
  const roleName = String((user as any)?.roleName ?? (user as any)?.role_name ?? "").toLowerCase().trim();
  const isAdmin = roleId === 1 || roleId === 3 || roleName === "admin" || roleName === "super_admin";
  const isSuperAdmin = roleId === 3 || roleName === "super_admin";

  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    trees: 0,
    people: 0,
    gallery: 0,
    myTrees: 0,
    myPeople: 0,
    myGallery: 0,
    publicTrees: 0,
    publicBooks: 0,
    events: 0,
  });
  const [quotas, setQuotas] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [togglingLog, setTogglingLog] = useState(false);

  useEffect(() => {
    api.get("/my/activity-settings").then((res) => {
      setLoggingEnabled(res.data?.enabled !== false);
    }).catch(() => {});
  }, []);

  const handleToggleLogging = async () => {
    setTogglingLog(true);
    const nextState = !loggingEnabled;
    try {
      await api.patch("/my/activity-settings", { enabled: nextState });
      setLoggingEnabled(nextState);
    } catch {
      // ignore
    } finally {
      setTogglingLog(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        api.get("/my/quotas").then((res) => {
          if (mounted) setQuotas(res.data?.data || res.data);
        }).catch(() => {});

        if (isAdmin) {
          const [statsRes, activityRes] = await Promise.allSettled([
            fetchStats(),
            fetchRecentActivity(),
          ]);

          if (!mounted) return;

          const s = statsRes.status === "fulfilled" ? statsRes.value : null;
          const a = activityRes.status === "fulfilled" ? activityRes.value : [];

          setStats((prev) => ({
            ...prev,
            users: Number(s?.users ?? 0),
            trees: Number(s?.trees ?? 0),
            people: Number(s?.people ?? 0),
            gallery: Number(s?.gallery ?? 0),
            books: Number(s?.books ?? s?.libraryItems ?? 0),
            events: Number(s?.events ?? s?.activity ?? 0),
            publicTrees: Number(s?.publicTrees ?? s?.trees ?? 0),
            myTrees: Number(s?.trees ?? 0),
            myPeople: Number(s?.people ?? 0),
            myGallery: Number(s?.gallery ?? 0),
            publicBooks: Number(s?.books ?? s?.libraryItems ?? 0),
          }));
          setActivity(Array.isArray(a) ? a : []);
        } else {
          // Regular User: Attempt high-performance real-time /my/stats
          let userStatsData: any = null;
          try {
            const { data } = await api.get("/my/stats");
            userStatsData = data;
          } catch {
            // fallback below
          }

          if (userStatsData) {
            if (!mounted) return;
            setStats((prev) => ({
              ...prev,
              myTrees: Number(userStatsData.myTrees ?? 0),
              myPeople: Number(userStatsData.myPeople ?? 0),
              myGallery: Number(userStatsData.myGallery ?? 0),
              publicTrees: Number(userStatsData.publicTrees ?? 0),
              publicBooks: Number(userStatsData.publicBooks ?? userStatsData.libraryItems ?? 0),
              events: Number(userStatsData.events ?? 0),
            }));

            try {
              const { data: myAct } = await api.get("/my/activity", { params: { limit: 50 } });
              if (mounted) {
                if (Array.isArray(myAct) && myAct.length > 0) {
                  setActivity(myAct);
                } else {
                  const { data: pubAct } = await api.get("/activity", { params: { limit: 50 } });
                  if (mounted && Array.isArray(pubAct)) setActivity(pubAct);
                }
              }
            } catch {
              try {
                const { data: pubAct } = await api.get("/activity", { params: { limit: 50 } });
                if (mounted && Array.isArray(pubAct)) setActivity(pubAct);
              } catch {}
            }
          } else {
            const [myTreesRes, publicTreesRes, publicBooksRes, myActRes] = await Promise.allSettled([
              api.get("/my/trees"),
              api.get("/trees"),
              api.get("/books"),
              api.get("/activity", { params: { limit: 50 } }),
            ]);

            if (!mounted) return;

            const myTrees = myTreesRes.status === "fulfilled" && Array.isArray(myTreesRes.value?.data) ? myTreesRes.value.data.length : 0;
            const publicTrees = publicTreesRes.status === "fulfilled" && Array.isArray(publicTreesRes.value?.data) ? publicTreesRes.value.data.length : 0;
            const publicBooks = publicBooksRes.status === "fulfilled" && Array.isArray(publicBooksRes.value?.data) ? publicBooksRes.value.data.length : 0;
            const myAct = myActRes.status === "fulfilled" && Array.isArray(myActRes.value?.data) ? myActRes.value.data : [];

            setStats((prev) => ({
              ...prev,
              myTrees,
              publicTrees,
              publicBooks,
              events: myAct.length,
            }));
            setActivity(myAct);
          }
        }
      } catch (err: any) {
        if (!mounted) return;
        console.error("Dashboard error:", err);
        setError(t("dashboard_load_failed", "Failed to load dashboard data."));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAdmin, t]);

  const cards = useMemo(
    () =>
      isAdmin
        ? [
            { title: t("total_users", "Members"), value: stats.users, helper: t("registered_users", "registered users"), Icon: Users, tone: "brown" },
            { title: t("family_trees", "Family Trees"), value: stats.trees, helper: t("lineage_workspaces", "lineage workspaces"), Icon: Network, tone: "olive" },
            { title: t("total_people", "People"), value: stats.people, helper: t("indexed_relatives", "indexed relatives"), Icon: UserRound, tone: "gold" },
            { title: t("curate_collections", "Gallery"), value: stats.gallery, helper: t("gallery_photos", "heritage photos & scans"), Icon: Image, tone: "olive" },
            { title: t("total_books", "Library Items"), value: stats.books, helper: t("books_and_records", "books and records"), Icon: BookOpen, tone: "brown" },
            { title: t("my_activity", "Activity"), value: stats.events, helper: t("platform_events", "recorded platform updates"), Icon: Activity, tone: "gold" },
          ]
        : [
            { title: t("my_trees", "My Trees"), value: stats.myTrees, helper: t("private_workspace", "your workspace"), Icon: Network, tone: "brown" },
            { title: t("total_people", "People"), value: stats.myPeople, helper: t("indexed_relatives", "relatives in your trees"), Icon: UserRound, tone: "gold" },
            { title: t("public_trees", "Public Trees"), value: stats.publicTrees, helper: t("shared_lineages", "shared lineages"), Icon: Users, tone: "olive" },
            { title: t("public_books", "Library Items"), value: stats.publicBooks, helper: t("research_materials", "research materials"), Icon: BookOpen, tone: "gold" },
            { title: t("curate_collections", "Gallery"), value: stats.myGallery, helper: t("uploaded_media", "your uploaded photos"), Icon: Image, tone: "olive" },
            { title: t("my_activity", "Activity"), value: stats.events, helper: t("recent_updates", "recent updates"), Icon: Activity, tone: "brown" },
          ],
    [stats, t, isAdmin]
  );

  const quickActions = [
    {
      to: "/admin/trees",
      title: t("manage_family_trees", "Family Trees"),
      desc: t("manage_family_trees_desc", "Create, edit, and import GEDCOM lineage files."),
      Icon: Network,
    },
    {
      to: "/admin/gallery",
      title: t("curate_collections", "Gallery"),
      desc: t("curate_collections_desc", "Manage family photos and archive scans."),
      Icon: Image,
    },
    {
      to: "/admin/books",
      title: t("library_records", "Library"),
      desc: t("library_records_desc", "Publish books and research materials."),
      Icon: BookOpen,
    },
    {
      to: "/admin/audios",
      title: t("audio_records", "Audio"),
      desc: t("audio_records_desc", "Upload and manage oral history recordings."),
      Icon: Music,
    },
    {
      to: "/admin/notes",
      title: t("research_notes", "Research Notes"),
      desc: t("research_notes_desc", "Private notes attached to people, trees & historical events."),
      Icon: StickyNote,
    },
    {
      to: "/admin/tasks",
      title: t("research_tasks", "Research Tasks"),
      desc: t("research_tasks_desc", "Track tasks e.g. 'Find birth record', 'verify marriage'."),
      Icon: ListChecks,
    },
    {
      to: "/admin/sources-archives",
      title: t("my_sources_archives", "My Sources & Archives"),
      desc: t("my_sources_desc", "Saved reference sources with custom links & uploaded icons."),
      Icon: Archive,
    },
    {
      to: "/admin/social-comments",
      title: t("social_comments_moderation", "Commentaires & Interactions"),
      desc: t("social_comments_desc", "Superviser les mentions J'aime et modérer les commentaires en temps réel."),
      Icon: MessageSquare,
    },
    {
      to: "/admin/users",
      title: t("users", "Users"),
      desc: t("manage_users_desc", "Manage members and their permissions."),
      Icon: Shield,
    },
  ];

  return (
    <div className={`easy-panel ${isDark ? "is-dark" : ""}`}>
      <section className="easy-hero-panel">
        <div>
          <p className="roots-eyebrow">
            <Shield className="w-4 h-4" />
            {t("tunisia_control_panel", "Roots Tunisia Control Panel")}
          </p>
          <h1>
            {t("easy_panel_title", "Your Tunisia heritage, organized")}
          </h1>
          <p>
            {isAdmin
              ? (isSuperAdmin
                  ? "Super Admin Workspace — Full control over lineages, archives, media assets, platform statistics, and users."
                  : t("easy_panel_admin_desc", "Manage the community, curate family records, and keep North African lineage data organized from one clear panel."))
              : t("easy_panel_user_desc", "Build your family tree, collect archive sources, and preserve your Tunisia family history.")}
          </p>
        </div>
        <div className="easy-hero-actions">
          <Link to="/admin/trees" className="roots-cta admin-new-tree-cta">
            <Plus className="w-4 h-4" />
            {t("new_tree", "New Tree")}
          </Link>
          <Link to="/library" className="roots-cta-secondary">
            <Search className="w-4 h-4" />
            {t("browse_library", "Browse Library")}
          </Link>
        </div>
      </section>

      <section className="easy-grid">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      {/* Quotas & Tier Usage Summary Widget */}
      {quotas && (
        <section className="p-5 rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#d9a441]/15 text-[#d9a441]">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">
                  {t("account_quotas", "Account Quotas")} ({quotas.tierName || (isAdmin ? "Super Admin" : "Basic")} {t("plan", "Plan")})
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("trees", "Trees")}: <b>{quotas.limits?.trees?.used ?? stats.myTrees ?? 0} / {quotas.limits?.trees?.max === -1 ? "∞" : (quotas.limits?.trees?.max ?? "∞")}</b> ·{" "}
                {t("individuals", "Individuals")}: <b>{quotas.limits?.individuals?.used ?? (isAdmin ? stats.people : stats.myPeople) ?? 0} / {quotas.limits?.individuals?.max === -1 ? "∞" : (quotas.limits?.individuals?.max ?? "∞")}</b> ·{" "}
                {t("gallery", "Gallery")}: <b>{quotas.limits?.gallery?.used ?? (isAdmin ? stats.gallery : stats.myGallery) ?? 0} / {quotas.limits?.gallery?.max === -1 ? "∞" : (quotas.limits?.gallery?.max ?? "∞")}</b>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/usage"
              className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t("view_full_quotas", "View Full Quotas")}
            </Link>
            <Link
              to="/admin/user-upgrade"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs flex items-center gap-1 shadow hover:shadow-md transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{t("upgrade", "Upgrade")}</span>
            </Link>
          </div>
        </section>
      )}

      <section className="easy-two-column">
        <div className="easy-panel-card">
          <div className="easy-card-header">
            <div>
              <p className="roots-eyebrow">{t("quick_actions", "Quick Actions")}</p>
              <h2>{t("keep_work_moving", "Manage Content")}</h2>
            </div>
          </div>
          <div className="easy-actions-grid">
            {quickActions.map((action) => (
              <QuickAction key={action.to} {...action} />
            ))}
          </div>
        </div>

        <div className="easy-panel-card">
          <div className="easy-card-header flex items-center justify-between">
            <div>
              <p className="roots-eyebrow">{t("recent_activity", "Recent Activity")}</p>
              <h2>{t("latest_updates", "آخر التحديثات وسجل النشاط")}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleLogging}
                disabled={togglingLog}
                type="button"
                className={`px-3 py-1.5 rounded-xl text-[0.7rem] font-extrabold transition-all flex items-center gap-1.5 border shadow-sm ${
                  loggingEnabled
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700"
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{t("log_status", "Log:")} {loggingEnabled ? t("on_status", "ON") : t("off_status", "OFF")}</span>
              </button>
              <button
                className="easy-icon-button"
                onClick={() => window.location.reload()}
                type="button"
                aria-label={t("refresh", "Refresh")}
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!loggingEnabled ? (
            <div className="easy-empty text-xs text-gray-500 py-8">
              {t("activity_logging_off_notice", "Activity logging is currently turned OFF for your account. Turn it ON to resume tracking.")}
            </div>
          ) : loading ? (
            <div className="easy-empty">{t("loading", "Loading...")}</div>
          ) : error ? (
            <div className="easy-empty text-red-500">{error}</div>
          ) : activity.length === 0 ? (
            <div className="easy-empty">
              {t("no_activity_yet", "No activity yet.")}
            </div>
          ) : (
            <div className="easy-activity-list">
              {activity.slice(0, 8).map((row, index) => (
                <div key={`${row.type}-${index}`} className="easy-activity-row">
                  <Activity className="w-4 h-4 text-accent-gold" />
                  <div>
                    <strong>{row.description || row.type}</strong>
                    <span>
                      {row.actor?.full_name || row.actor?.email || row.user || t("system", "System")} · {formatDate(row.date || row.created_at || row.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
