import { useState, useEffect } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Search,
  MessageSquare,
  Trash2,
  RefreshCw,
  User,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle,
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
  content: string;
  is_approved: boolean | number;
  created_at: string;
}

export default function SocialComments() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  const [comments, setComments] = useState<SocialComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  const pageBg = isDark ? "bg-[#071827]" : "bg-[#f5f1e8]";
  const text = isDark ? "text-white" : "text-[#162238]";
  const card = isDark ? "bg-[#0f1f33]" : "bg-white";
  const border = isDark ? "border-[#1a3048]" : "border-[#e8e4dc]";
  const hoverRow = isDark ? "hover:bg-white/5" : "hover:bg-black/[0.02]";
  const inputBg = isDark ? "bg-[#0f1f33]" : "bg-white";
  const inputText = isDark ? "text-[#f8f5ef]" : "text-[#162238]";

  const fetchComments = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/social/admin/comments", {
        params: { page: pageNum, limit: 30, search: search.trim() || undefined },
      });
      const data = res.data?.data || res.data || [];
      const totalCount = res.data?.total || data.length;
      setComments(Array.isArray(data) ? data : []);
      setTotal(totalCount);
      setPage(pageNum);
    } catch (err: any) {
      setToastTone("error");
      setToastMessage(t("comments_fetch_failed", "Failed to load community comments."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("confirm_delete_comment", "Voulez-vous vraiment supprimer ce commentaire ? / Are you sure you want to delete this comment?"))) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/social/admin/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      setToastTone("success");
      setToastMessage(t("comment_deleted_success", "Commentaire supprimé avec succès. / Comment successfully deleted."));
    } catch (err: any) {
      setToastTone("error");
      setToastMessage(t("comment_delete_failed", "Échec de la suppression du commentaire. / Failed to delete comment."));
    } finally {
      setDeletingId(null);
    }
  };

  const getReadableType = (type?: string, key?: string) => {
    if (type) return type.toUpperCase();
    if (key?.startsWith("gallery_tree_") || key?.startsWith("tree_")) return "TREE";
    if (key?.startsWith("gallery_img_") || key?.startsWith("img_")) return "IMAGE";
    if (key?.startsWith("gallery_audio_") || key?.startsWith("audio_")) return "AUDIO";
    if (key?.startsWith("gallery_doc_") || key?.startsWith("doc_")) return "DOCUMENT";
    if (key?.startsWith("gallery_book_") || key?.startsWith("book_")) return "BOOK";
    if (key?.startsWith("gallery_article_") || key?.startsWith("article_")) return "ARTICLE";
    return "MEDIA";
  };

  return (
    <div className={`p-4 md:p-6 min-h-screen ${pageBg} ${text} heritage-page-root`}>
      <Toast message={toastMessage} tone={toastTone} />

      {/* TOP HEADER */}
      <div className={`rounded-xl p-5 mb-6 border ${border} bg-gradient-to-r from-[#0f2742]/15 to-[#24766f]/15 heritage-panel heritage-panel--accent shadow-md`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#0c4a6e] flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-cinzel font-bold text-xl md:text-2xl text-[#0c4a6e] dark:text-[#0d9488]">
                {t("social_comments_moderation", "Modération des Commentaires Publics")}
              </h1>
              <p className="text-xs md:text-sm opacity-75">
                {t("social_comments_desc", "Supervision et contrôle en temps réel des interactions et commentaires de la communauté.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchComments(page)}
              className="px-3.5 py-2 rounded-lg border border-[#0d9488]/30 bg-[#0d9488]/10 hover:bg-[#0d9488]/20 text-[#0d9488] text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{t("refresh", "Actualiser")}</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#0d9488]/20 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0d9488]" />
            <span className="opacity-70">{t("total_comments", "Total Commentaires")}:</span>
            <span className="font-bold text-[#0d9488]">{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="opacity-70">{t("status", "Statut")}:</span>
            <span className="font-bold text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {t("live_filtering", "Live Real-Time")}
            </span>
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" />
            <span className="opacity-70">{t("auth_required", "Accès")}:</span>
            <span className="font-semibold">{t("verified_users_only", "Membres Connectés")}</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className={`p-4 mb-4 rounded-xl border ${border} ${card} shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between`}>
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_comments_placeholder", "Rechercher par auteur, contenu ou ressource...")}
            className={`w-full ltr:pl-9 rtl:pr-9 px-3 py-2 text-xs rounded-lg border ${border} ${inputBg} ${inputText} focus:ring-2 focus:ring-[#0d9488]/30`}
          />
        </div>

        <div className="text-xs opacity-70">
          {total} {t("results_found", "résultat(s)")}
        </div>
      </div>

      {/* COMMENTS TABLE */}
      <div className={`rounded-xl border ${border} ${card} shadow-md overflow-hidden`}>
        {loading && comments.length === 0 ? (
          <div className="p-12 text-center text-xs opacity-70">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0d9488]" />
            {t("loading", "Chargement des commentaires...")}
          </div>
        ) : comments.length === 0 ? (
          <div className="p-12 text-center text-xs opacity-70">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            {t("no_comments_yet", "Aucun commentaire trouvé.")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className={`border-b ${border} ${isDark ? "bg-[#0b1726]" : "bg-stone-100/70"} text-start opacity-75 font-semibold`}>
                  <th className="py-3 px-4 text-start">ID</th>
                  <th className="py-3 px-4 text-start">{t("author", "Auteur")}</th>
                  <th className="py-3 px-4 text-start">{t("content", "Commentaire")}</th>
                  <th className="py-3 px-4 text-start">{t("resource", "Ressource")}</th>
                  <th className="py-3 px-4 text-start">{t("date", "Date")}</th>
                  <th className="py-3 px-4 text-end">{t("actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d9488]/10">
                {comments.map((comment) => (
                  <tr key={comment.id} className={`${hoverRow} transition-colors`}>
                    <td className="py-3 px-4 font-mono text-[11px] opacity-60">#{comment.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0d9488]/20 text-[#0d9488] font-bold flex items-center justify-center text-xs shrink-0">
                          {(comment.user_name || "U")[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#0c4a6e] dark:text-[#0d9488]">
                            {comment.user_name || t("unknown_user", "Utilisateur")}
                          </div>
                          <div className="text-[10px] opacity-60">ID: {comment.user_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0d9488]/15 text-[#0d9488] border border-[#0d9488]/20">
                          {getReadableType(comment.entity_type, comment.media_key)}
                        </span>
                        <span className="font-mono text-[10px] opacity-60 truncate max-w-[140px]" title={comment.media_key}>
                          {comment.media_key}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[11px] opacity-75 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 opacity-60" />
                        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                        <span className="opacity-50 text-[10px]">
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 border border-rose-500/20 transition-colors cursor-pointer"
                        title={t("delete_comment", "Supprimer définitivement")}
                      >
                        <Trash2 className={`w-4 h-4 ${deletingId === comment.id ? "animate-pulse" : ""}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
