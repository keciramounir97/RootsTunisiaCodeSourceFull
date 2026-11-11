/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Search,
  MessageSquare,
  Heart,
  Trash2,
  RefreshCw,
  User,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Flame,
  Award,
  Sparkles,
  Network,
  Image as ImageIcon,
  BookOpen,
  FileText,
  Music,
  Newspaper,
  ShieldAlert,
} from "lucide-react";
import { useThemeStore } from "../../store/theme";
import Toast from "../../components/Toast";

interface SocialComment {
  id: number;
  media_key: string;
  entity_type?: string;
  entity_id?: number;
  user_id: number;
  user_name: string;
  user_email?: string;
  content: string;
  is_approved: boolean | number;
  created_at: string;
  updated_at?: string;
  item_title?: string;
}

interface SocialLike {
  id: number;
  media_key: string;
  entity_type?: string;
  entity_id?: number;
  user_id: number;
  user_name: string;
  user_email?: string;
  created_at: string;
  item_title?: string;
}

interface SocialStats {
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  totalLikes: number;
  uniqueLikedItems: number;
  topLikedItems: Array<{
    media_key: string;
    entity_type: string;
    entity_id: number;
    likes_count: number;
    comments_count: number;
    last_liked_at?: string;
    item_title?: string;
  }>;
}

export default function SocialComments() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const { t, isRtl } = useTranslation();

  // Active Tab: 'comments' | 'likes' | 'ranking'
  const [activeTab, setActiveTab] = useState<"comments" | "likes" | "ranking">("comments");

  // Statistics
  const [stats, setStats] = useState<SocialStats>({
    totalComments: 0,
    approvedComments: 0,
    pendingComments: 0,
    totalLikes: 0,
    uniqueLikedItems: 0,
    topLikedItems: [],
  });

  // Comments State
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentPage, setCommentPage] = useState(1);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentSearch, setCommentSearch] = useState("");
  const [commentStatusFilter, setCommentStatusFilter] = useState<string>("all");
  const [commentTypeFilter, setCommentTypeFilter] = useState<string>("all");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  // Likes State
  const [likes, setLikes] = useState<SocialLike[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [likePage, setLikePage] = useState(1);
  const [likesLoading, setLikesLoading] = useState(false);
  const [likeSearch, setLikeSearch] = useState("");
  const [likeTypeFilter, setLikeTypeFilter] = useState<string>("all");
  const [deletingLikeId, setDeletingLikeId] = useState<number | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState("");
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  // Styling helpers
  const pageBg = isDark ? "bg-[#071827]" : "bg-[#f7f5f0]";
  const text = isDark ? "text-gray-100" : "text-[#162238]";
  const cardBg = isDark ? "bg-[#0f1f33]" : "bg-white";
  const border = isDark ? "border-[#1e3852]" : "border-[#e5dfd5]";
  const hoverRow = isDark ? "hover:bg-white/[0.03]" : "hover:bg-[#fbf9f5]";
  const inputBg = isDark ? "bg-[#0b1726]" : "bg-white";
  const inputText = isDark ? "text-white" : "text-gray-900";

  // Fetch overall statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/social/admin/stats");
      const raw = res.data?.data ?? res.data;
      if (raw) {
        setStats({
          totalComments: Number(raw.totalComments || 0),
          approvedComments: Number(raw.approvedComments || 0),
          pendingComments: Number(raw.pendingComments || 0),
          totalLikes: Number(raw.totalLikes || 0),
          uniqueLikedItems: Number(raw.uniqueLikedItems || 0),
          topLikedItems: Array.isArray(raw.topLikedItems) ? raw.topLikedItems : [],
        });
      }
    } catch (err: any) {
      console.warn("Could not load social stats", err?.message);
    }
  }, []);

  // Fetch comments
  const fetchComments = useCallback(
    async (page = 1) => {
      try {
        setCommentsLoading(true);
        const res = await api.get("/social/admin/comments", {
          params: {
            page,
            limit: 25,
            search: commentSearch.trim() || undefined,
            status: commentStatusFilter !== "all" ? commentStatusFilter : undefined,
            entityType: commentTypeFilter !== "all" ? commentTypeFilter : undefined,
          },
        });
        const raw = res.data?.data ?? res.data;
        const items = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
        setComments(items);
        setTotalComments(Number(raw?.total || items.length || 0));
        setCommentPage(page);
      } catch (err: any) {
        setToastTone("error");
        setToastMessage(t("comments_fetch_failed", "Failed to load community comments."));
      } finally {
        setCommentsLoading(false);
      }
    },
    [commentSearch, commentStatusFilter, commentTypeFilter, t]
  );

  // Fetch likes
  const fetchLikes = useCallback(
    async (page = 1) => {
      try {
        setLikesLoading(true);
        const res = await api.get("/social/admin/likes", {
          params: {
            page,
            limit: 25,
            search: likeSearch.trim() || undefined,
            entityType: likeTypeFilter !== "all" ? likeTypeFilter : undefined,
          },
        });
        const raw = res.data?.data ?? res.data;
        const items = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw) ? raw : [];
        setLikes(items);
        setTotalLikes(Number(raw?.total || items.length || 0));
        setLikePage(page);
      } catch (err: any) {
        setToastTone("error");
        setToastMessage(t("likes_fetch_failed", "Failed to load likes activity."));
      } finally {
        setLikesLoading(false);
      }
    },
    [likeSearch, likeTypeFilter, t]
  );

  // Initial & search changes
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  useEffect(() => {
    if (activeTab === "likes" || activeTab === "ranking") {
      fetchLikes(1);
    }
  }, [activeTab, fetchLikes]);

  // Handle comment approval toggle
  const handleToggleApproval = async (comment: SocialComment) => {
    const nextApproved = !comment.is_approved;
    try {
      setTogglingId(comment.id);
      await api.patch(`/social/admin/comments/${comment.id}/approve`, {
        isApproved: nextApproved,
      });

      setComments((prev) =>
        prev.map((c) => (c.id === comment.id ? { ...c, is_approved: nextApproved } : c))
      );
      fetchStats();

      setToastTone("success");
      setToastMessage(
        nextApproved
          ? t("comment_approved_toast", "Commentaire approuvé et visible publiquement.")
          : t("comment_hidden_toast", "Commentaire masqué avec succès.")
      );
    } catch (err: any) {
      setToastTone("error");
      setToastMessage(t("comment_update_failed", "Échec de la mise à jour du statut."));
    } finally {
      setTogglingId(null);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (id: number) => {
    if (
      !window.confirm(
        t(
          "confirm_delete_comment",
          "Voulez-vous vraiment supprimer définitivement ce commentaire ?"
        )
      )
    ) {
      return;
    }

    try {
      setDeletingCommentId(id);
      await api.delete(`/social/admin/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      setTotalComments((prev) => Math.max(0, prev - 1));
      fetchStats();
      setToastTone("success");
      setToastMessage(t("comment_deleted_success", "Commentaire supprimé avec succès."));
    } catch (err: any) {
      setToastTone("error");
      setToastMessage(t("comment_delete_failed", "Échec de la suppression du commentaire."));
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Handle like deletion
  const handleDeleteLike = async (id: number) => {
    if (
      !window.confirm(
        t(
          "confirm_delete_like",
          "Voulez-vous retirer cette mention J'aime de la base de données ?"
        )
      )
    ) {
      return;
    }

    try {
      setDeletingLikeId(id);
      await api.delete(`/social/admin/likes/${id}`);
      setLikes((prev) => prev.filter((l) => l.id !== id));
      setTotalLikes((prev) => Math.max(0, prev - 1));
      fetchStats();
      setToastTone("success");
      setToastMessage(t("like_deleted_success", "Mention J'aime retirée avec succès."));
    } catch (err: any) {
      setToastTone("error");
      setToastMessage(t("like_delete_failed", "Échec de la suppression de la mention J'aime."));
    } finally {
      setDeletingLikeId(null);
    }
  };

  // Helper to resolve readable type label and icon
  const getResourceMeta = (type?: string, key?: string) => {
    const rawType = String(type || "").toLowerCase();
    const rawKey = String(key || "").toLowerCase();

    if (rawType === "tree" || rawKey.includes("tree")) {
      return { label: t("tree", "Arbre"), icon: Network, color: "text-amber-500 bg-amber-500/10 border-amber-500/20", link: "/gallery/trees" };
    }
    if (rawType === "gallery" || rawType === "image" || rawKey.includes("img") || rawKey.includes("gallery_")) {
      return { label: t("gallery_photo", "Galerie"), icon: ImageIcon, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", link: "/gallery/images" };
    }
    if (rawType === "book" || rawKey.includes("book")) {
      return { label: t("book", "Livre"), icon: BookOpen, color: "text-blue-500 bg-blue-500/10 border-blue-500/20", link: "/gallery/books" };
    }
    if (rawType === "document" || rawType === "doc" || rawKey.includes("doc")) {
      return { label: t("document", "Document"), icon: FileText, color: "text-purple-500 bg-purple-500/10 border-purple-500/20", link: "/gallery/documents" };
    }
    if (rawType === "audio" || rawKey.includes("audio")) {
      return { label: t("audio", "Récit Audio"), icon: Music, color: "text-rose-500 bg-rose-500/10 border-rose-500/20", link: "/gallery/audios" };
    }
    if (rawType === "article" || rawKey.includes("article")) {
      return { label: t("article", "Article"), icon: Newspaper, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20", link: "/gallery/articles" };
    }
    return { label: t("media", "Média"), icon: Layers, color: "text-gray-500 bg-gray-500/10 border-gray-500/20", link: "/gallery" };
  };

  return (
    <div className={`p-4 md:p-6 min-h-screen ${pageBg} ${text} transition-colors`}>
      <Toast message={toastMessage} tone={toastTone} />

      {/* ----------------- TOP HERO PANEL ----------------- */}
      <section className={`rounded-2xl p-6 mb-6 border ${border} ${cardBg} shadow-lg relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#0d9488]/15 via-transparent to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#0c4a6e] flex items-center justify-center text-white shadow-md shrink-0">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-[#0d9488]/15 text-[#0d9488] border border-[#0d9488]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {t("super_admin_module", "Super Admin Control")}
                </span>
                <span className="text-xs opacity-50">·</span>
                <span className="text-xs font-semibold opacity-70 flex items-center gap-1 text-emerald-500">
                  <CheckCircle className="w-3.5 h-3.5" /> {t("live_sync_active", "Synchronisation Réelle")}
                </span>
              </div>
              <h1 className="font-serif font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">
                {t("social_interactions_title", "Interactions Sociales : J'aime & Commentaires")}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
                {t(
                  "social_interactions_desc",
                  "Supervisez en temps réel les mentions J'aime authentiques, modérez les commentaires de la communauté et analysez l'engagement sur les arbres généalogiques et archives tunisiennes."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                fetchStats();
                if (activeTab === "comments") fetchComments(commentPage);
                else fetchLikes(likePage);
              }}
              className="px-4 py-2.5 rounded-xl border border-[#0d9488]/30 bg-[#0d9488]/10 hover:bg-[#0d9488]/20 text-[#0d9488] text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  commentsLoading || likesLoading ? "animate-spin" : ""
                }`}
              />
              <span>{t("refresh_now", "Actualiser les données")}</span>
            </button>
          </div>
        </div>

        {/* ----------------- KPI SUMMARY CARDS ----------------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-[var(--border-color,rgba(13,148,136,0.15))]">
          {/* Card 1: Total Likes */}
          <div className={`p-4 rounded-xl border ${border} ${isDark ? "bg-[#0b1726]/60" : "bg-[#fbf9f5]"} flex items-center gap-3.5`}>
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-rose-500/20" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                {t("real_likes_count", "Mentions J'aime Réelles")}
              </p>
              <strong className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalLikes}
              </strong>
            </div>
          </div>

          {/* Card 2: Total Comments */}
          <div className={`p-4 rounded-xl border ${border} ${isDark ? "bg-[#0b1726]/60" : "bg-[#fbf9f5]"} flex items-center gap-3.5`}>
            <div className="w-10 h-10 rounded-xl bg-[#0d9488]/15 text-[#0d9488] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                {t("total_comments", "Total Commentaires")}
              </p>
              <strong className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalComments}
              </strong>
            </div>
          </div>

          {/* Card 3: Approved vs Pending */}
          <div className={`p-4 rounded-xl border ${border} ${isDark ? "bg-[#0b1726]/60" : "bg-[#fbf9f5]"} flex items-center gap-3.5`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                {t("moderation_status", "Statut Modération")}
              </p>
              <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
                <span className="text-emerald-500">{stats.approvedComments} {t("approved", "Approuvés")}</span>
                {stats.pendingComments > 0 && (
                  <span className="text-amber-500">· {stats.pendingComments} {t("pending", "En attente")}</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Engaged Items */}
          <div className={`p-4 rounded-xl border ${border} ${isDark ? "bg-[#0b1726]/60" : "bg-[#fbf9f5]"} flex items-center gap-3.5`}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                {t("interacted_items", "Ressources Engagées")}
              </p>
              <strong className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.uniqueLikedItems}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- NAVIGATION TABS ----------------- */}
      <div className="flex items-center gap-2 mb-4 border-b border-[var(--border-color,rgba(13,148,136,0.2))] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "comments"
              ? "bg-[#0d9488] text-white shadow-md shadow-[#0d9488]/20"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t("comments_moderation_tab", "💬 Modération des Commentaires")}</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20">
            {stats.totalComments}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("likes")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "likes"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>{t("likes_monitoring_tab", "❤️ Surveillance des J'aime")}</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20">
            {stats.totalLikes}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ranking")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === "ranking"
              ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{t("ranking_tab", "📊 Palmarès & Top Ressources")}</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20">
            {(stats.topLikedItems || []).length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: COMMENTS MODERATION                                 */}
      {/* ========================================================= */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS BAR */}
          <div className={`p-4 rounded-xl border ${border} ${cardBg} shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between`}>
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                placeholder={t("search_comments_placeholder", "Rechercher par auteur, email, contenu ou ressource...")}
                className={`w-full ps-9 pe-4 py-2 text-xs rounded-lg border ${border} ${inputBg} ${inputText} focus:ring-2 focus:ring-[#0d9488]/40 outline-none`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={commentStatusFilter}
                onChange={(e) => setCommentStatusFilter(e.target.value)}
                className={`px-3 py-2 text-xs rounded-lg border ${border} ${inputBg} ${inputText} outline-none cursor-pointer`}
              >
                <option value="all">{t("all_statuses", "Tous les statuts")}</option>
                <option value="approved">{t("approved_only", "Approuvés uniquement")}</option>
                <option value="pending">{t("pending_only", "En attente / Masqués")}</option>
              </select>

              {/* Resource Type Filter */}
              <select
                value={commentTypeFilter}
                onChange={(e) => setCommentTypeFilter(e.target.value)}
                className={`px-3 py-2 text-xs rounded-lg border ${border} ${inputBg} ${inputText} outline-none cursor-pointer`}
              >
                <option value="all">{t("all_types", "Toutes les ressources")}</option>
                <option value="tree">{t("trees", "Arbres Généalogiques")}</option>
                <option value="gallery">{t("gallery_photos", "Galerie d'Images")}</option>
                <option value="book">{t("books", "Livres")}</option>
                <option value="document">{t("documents", "Documents")}</option>
                <option value="audio">{t("audios", "Récits Audio")}</option>
                <option value="article">{t("articles", "Articles")}</option>
              </select>

              <div className="text-xs font-semibold opacity-70 px-2">
                {totalComments} {t("comments_found", "commentaire(s)")}
              </div>
            </div>
          </div>

          {/* COMMENTS TABLE */}
          <div className={`rounded-xl border ${border} ${cardBg} shadow-md overflow-hidden`}>
            {commentsLoading && comments.length === 0 ? (
              <div className="p-16 text-center text-xs opacity-70">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#0d9488]" />
                <p>{t("loading_comments", "Chargement des commentaires de la communauté...")}</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="p-16 text-center text-xs opacity-70">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30 text-gray-400" />
                <p className="font-bold text-sm text-gray-700 dark:text-gray-300">
                  {t("no_comments_match", "Aucun commentaire ne correspond à votre filtre.")}
                </p>
                <p className="text-[11px] mt-1 text-gray-500">
                  {t("comments_empty_hint", "Les commentaires publics postés par les membres sur les arbres et médias s'afficheront ici en direct.")}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className={`border-b ${border} ${isDark ? "bg-[#0b1726]" : "bg-stone-50"} text-start opacity-75 font-semibold`}>
                      <th className="py-3 px-4 text-start">ID</th>
                      <th className="py-3 px-4 text-start">{t("author", "Auteur / Membre")}</th>
                      <th className="py-3 px-4 text-start">{t("comment_content", "Commentaire")}</th>
                      <th className="py-3 px-4 text-start">{t("resource", "Ressource Rattachée")}</th>
                      <th className="py-3 px-4 text-start">{t("status", "Statut")}</th>
                      <th className="py-3 px-4 text-start">{t("date", "Date & Heure")}</th>
                      <th className="py-3 px-4 text-end">{t("actions", "Actions Modération")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color,rgba(0,0,0,0.06))]">
                    {comments.map((comment) => {
                      const meta = getResourceMeta(comment.entity_type, comment.media_key);
                      const Icon = meta.icon;
                      const isApproved = Boolean(comment.is_approved);

                      return (
                        <tr key={comment.id} className={`${hoverRow} transition-colors`}>
                          <td className="py-3.5 px-4 font-mono text-[11px] opacity-60">
                            #{comment.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0d9488]/20 to-[#0c4a6e]/20 text-[#0d9488] font-bold flex items-center justify-center text-xs shrink-0 border border-[#0d9488]/30">
                                {(comment.user_name || "M")[0]?.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-900 dark:text-white truncate">
                                  {comment.user_name || t("unknown_user", "Membre")}
                                </div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                  {comment.user_email || `ID: ${comment.user_id}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="bg-stone-50 dark:bg-[#071827] p-2.5 rounded-lg border border-[var(--border-color,rgba(0,0,0,0.05))]">
                              <p className="text-xs leading-relaxed whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                                {comment.content}
                              </p>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 items-start max-w-[220px]">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${meta.color}`}>
                                <Icon className="w-3 h-3" />
                                {meta.label}
                              </span>
                              <Link
                                to={meta.link}
                                className="font-semibold text-xs text-[#0c4a6e] dark:text-[#0d9488] hover:underline truncate w-full flex items-center gap-1"
                                title={comment.item_title || comment.media_key}
                              >
                                <span>{comment.item_title || comment.media_key}</span>
                                <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                              </Link>
                              <span className="font-mono text-[9px] opacity-50 truncate w-full" title={comment.media_key}>
                                {comment.media_key}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleApproval(comment)}
                              disabled={togglingId === comment.id}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 border transition-all cursor-pointer ${
                                isApproved
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
                              }`}
                              title={isApproved ? "Cliquez pour masquer" : "Cliquez pour approuver"}
                            >
                              {isApproved ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>{t("approved", "Approuvé")}</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span>{t("hidden_or_pending", "Masqué")}</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-[11px] opacity-75 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 opacity-60" />
                              <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                              <span className="opacity-50 text-[10px]">
                                {new Date(comment.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-end">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleToggleApproval(comment)}
                                disabled={togglingId === comment.id}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  isApproved
                                    ? "text-amber-500 hover:bg-amber-500/15 border-amber-500/20"
                                    : "text-emerald-500 hover:bg-emerald-500/15 border-emerald-500/20"
                                }`}
                                title={isApproved ? t("hide_comment", "Masquer le commentaire") : t("approve_comment", "Approuver le commentaire")}
                              >
                                {isApproved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deletingCommentId === comment.id}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 border border-rose-500/20 transition-colors cursor-pointer"
                                title={t("delete_comment", "Supprimer définitivement")}
                              >
                                <Trash2 className={`w-4 h-4 ${deletingCommentId === comment.id ? "animate-pulse" : ""}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalComments > 25 && (
              <div className="p-3 border-t border-[var(--border-color,rgba(0,0,0,0.06))] flex items-center justify-between text-xs">
                <span className="opacity-70">
                  Page {commentPage} sur {Math.ceil(totalComments / 25)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fetchComments(commentPage - 1)}
                    disabled={commentPage <= 1 || commentsLoading}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] disabled:opacity-40 cursor-pointer"
                  >
                    {t("previous", "Précédent")}
                  </button>
                  <button
                    type="button"
                    onClick={() => fetchComments(commentPage + 1)}
                    disabled={commentPage >= Math.ceil(totalComments / 25) || commentsLoading}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] disabled:opacity-40 cursor-pointer"
                  >
                    {t("next", "Suivant")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LIKES MONITORING                                    */}
      {/* ========================================================= */}
      {activeTab === "likes" && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS BAR */}
          <div className={`p-4 rounded-xl border ${border} ${cardBg} shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between`}>
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={likeSearch}
                onChange={(e) => setLikeSearch(e.target.value)}
                placeholder={t("search_likes_placeholder", "Rechercher par membre, email ou titre de ressource...")}
                className={`w-full ps-9 pe-4 py-2 text-xs rounded-lg border ${border} ${inputBg} ${inputText} focus:ring-2 focus:ring-rose-500/40 outline-none`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={likeTypeFilter}
                onChange={(e) => setLikeTypeFilter(e.target.value)}
                className={`px-3 py-2 text-xs rounded-lg border ${border} ${inputBg} ${inputText} outline-none cursor-pointer`}
              >
                <option value="all">{t("all_types", "Toutes les ressources")}</option>
                <option value="tree">{t("trees", "Arbres Généalogiques")}</option>
                <option value="gallery">{t("gallery_photos", "Galerie d'Images")}</option>
                <option value="book">{t("books", "Livres")}</option>
                <option value="document">{t("documents", "Documents")}</option>
                <option value="audio">{t("audios", "Récits Audio")}</option>
                <option value="article">{t("articles", "Articles")}</option>
              </select>

              <div className="text-xs font-semibold opacity-70 px-2">
                {totalLikes} {t("likes_found", "mention(s) J'aime")}
              </div>
            </div>
          </div>

          {/* LIKES TABLE */}
          <div className={`rounded-xl border ${border} ${cardBg} shadow-md overflow-hidden`}>
            {likesLoading && likes.length === 0 ? (
              <div className="p-16 text-center text-xs opacity-70">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-rose-500" />
                <p>{t("loading_likes", "Chargement des mentions J'aime...")}</p>
              </div>
            ) : likes.length === 0 ? (
              <div className="p-16 text-center text-xs opacity-70">
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30 text-rose-500" />
                <p className="font-bold text-sm text-gray-700 dark:text-gray-300">
                  {t("no_likes_match", "Aucune mention J'aime trouvée.")}
                </p>
                <p className="text-[11px] mt-1 text-gray-500">
                  {t("likes_empty_hint", "Toutes les mentions J'aime démarrent à 0 et sont enregistrées en direct lorsque les membres connectés cliquent sur le cœur.")}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className={`border-b ${border} ${isDark ? "bg-[#0b1726]" : "bg-stone-50"} text-start opacity-75 font-semibold`}>
                      <th className="py-3 px-4 text-start">ID</th>
                      <th className="py-3 px-4 text-start">{t("member", "Membre ayant aimé")}</th>
                      <th className="py-3 px-4 text-start">{t("liked_resource", "Ressource Aimée")}</th>
                      <th className="py-3 px-4 text-start">{t("date", "Date & Heure")}</th>
                      <th className="py-3 px-4 text-end">{t("actions", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color,rgba(0,0,0,0.06))]">
                    {likes.map((like) => {
                      const meta = getResourceMeta(like.entity_type, like.media_key);
                      const Icon = meta.icon;

                      return (
                        <tr key={like.id} className={`${hoverRow} transition-colors`}>
                          <td className="py-3.5 px-4 font-mono text-[11px] opacity-60">
                            #{like.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-500 font-bold flex items-center justify-center text-xs shrink-0 border border-rose-500/30">
                                {(like.user_name || "M")[0]?.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-gray-900 dark:text-white truncate">
                                  {like.user_name || t("unknown_user", "Membre")}
                                </div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                  {like.user_email || `ID: ${like.user_id}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 items-start max-w-sm">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${meta.color}`}>
                                <Icon className="w-3 h-3" />
                                {meta.label}
                              </span>
                              <Link
                                to={meta.link}
                                className="font-bold text-xs text-[#0c4a6e] dark:text-[#0d9488] hover:underline truncate w-full flex items-center gap-1"
                                title={like.item_title || like.media_key}
                              >
                                <span>{like.item_title || like.media_key}</span>
                                <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                              </Link>
                              <span className="font-mono text-[9px] opacity-50 truncate w-full" title={like.media_key}>
                                {like.media_key}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[11px] opacity-75 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 opacity-60" />
                              <span>{new Date(like.created_at).toLocaleDateString()}</span>
                              <span className="opacity-50 text-[10px]">
                                {new Date(like.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-end">
                            <button
                              type="button"
                              onClick={() => handleDeleteLike(like.id)}
                              disabled={deletingLikeId === like.id}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 border border-rose-500/20 transition-colors cursor-pointer"
                              title={t("delete_like", "Retirer cette mention J'aime")}
                            >
                              <Trash2 className={`w-4 h-4 ${deletingLikeId === like.id ? "animate-pulse" : ""}`} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalLikes > 25 && (
              <div className="p-3 border-t border-[var(--border-color,rgba(0,0,0,0.06))] flex items-center justify-between text-xs">
                <span className="opacity-70">
                  Page {likePage} sur {Math.ceil(totalLikes / 25)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fetchLikes(likePage - 1)}
                    disabled={likePage <= 1 || likesLoading}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] disabled:opacity-40 cursor-pointer"
                  >
                    {t("previous", "Précédent")}
                  </button>
                  <button
                    type="button"
                    onClick={() => fetchLikes(likePage + 1)}
                    disabled={likePage >= Math.ceil(totalLikes / 25) || likesLoading}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] disabled:opacity-40 cursor-pointer"
                  >
                    {t("next", "Suivant")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: RANKING & TOP INTERACTED ITEMS                      */}
      {/* ========================================================= */}
      {activeTab === "ranking" && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${border} ${cardBg} shadow-sm flex items-center justify-between`}>
            <div>
              <h2 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                {t("top_heritage_items", "Palmarès des Arbres et Archives les Plus Populaires")}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t("ranking_subtitle", "Classement des contenus recevant le plus d'engagement authentique de la part des utilisateurs.")}
              </p>
            </div>
            <button
              type="button"
              onClick={fetchStats}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t("refresh", "Actualiser")}</span>
            </button>
          </div>

          {(stats.topLikedItems || []).length === 0 ? (
            <div className={`p-16 rounded-xl border ${border} ${cardBg} text-center text-xs opacity-70`}>
              <Award className="w-10 h-10 mx-auto mb-3 opacity-30 text-amber-500" />
              <p className="font-bold text-sm text-gray-700 dark:text-gray-300">
                {t("no_ranking_yet", "Aucun palmarès pour l'instant.")}
              </p>
              <p className="text-[11px] mt-1 text-gray-500">
                {t("ranking_empty_hint", "Dès que les utilisateurs aiment ou commentent des arbres ou archives, le top 10 se générera automatiquement ici.")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(stats.topLikedItems || []).map((item, index) => {
                const meta = getResourceMeta(item.entity_type, item.media_key);
                const Icon = meta.icon;

                return (
                  <article
                    key={item.media_key}
                    className={`p-5 rounded-2xl border ${border} ${cardBg} shadow-md flex flex-col justify-between gap-4 relative overflow-hidden`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                            index === 0
                              ? "bg-amber-400 text-stone-950 shadow"
                              : index === 1
                              ? "bg-stone-300 text-stone-900"
                              : index === 2
                              ? "bg-amber-700 text-white"
                              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${meta.color}`}>
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          {item.likes_count}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-[#0d9488] bg-[#0d9488]/10 px-2 py-0.5 rounded-full border border-[#0d9488]/20">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {item.comments_count}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">
                        {item.item_title || item.media_key}
                      </h3>
                      <p className="font-mono text-[10px] opacity-50 truncate mt-1">
                        {item.media_key}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-color,rgba(0,0,0,0.06))] flex items-center justify-between text-xs">
                      <span className="text-[10px] text-gray-500">
                        {item.last_liked_at
                          ? `${t("last_liked", "Dernier J'aime")} : ${new Date(item.last_liked_at).toLocaleDateString()}`
                          : ""}
                      </span>

                      <Link
                        to={meta.link}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#0d9488] to-[#0c4a6e] text-white font-bold text-xs flex items-center gap-1 hover:opacity-90 transition-opacity"
                      >
                        <span>{t("view_item", "Consulter")}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
