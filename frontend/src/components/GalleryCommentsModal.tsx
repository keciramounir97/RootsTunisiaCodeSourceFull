import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Send, MessageCircle, Heart, User, Calendar, LogIn, UserPlus, Trash2 } from "lucide-react";
import {
  type SocialComment,
  getSocialComments,
  fetchSocialComments,
  addSocialComment,
  getSocialLikes,
  toggleSocialLike,
} from "../utils/gallerySocial";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";

interface GalleryCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaKey: string;
  itemTitle: string;
  itemSubtitle?: string;
  defaultLikes?: number;
  apiPath?: string;
  entityType?: string;
  entityId?: number;
}

export default function GalleryCommentsModal({
  isOpen,
  onClose,
  mediaKey,
  itemTitle,
  itemSubtitle,
  defaultLikes = 0,
  apiPath,
  entityType = "tree",
  entityId,
}: GalleryCommentsModalProps) {
  const { user } = useAuth();
  const { t, isRtl } = useTranslation();
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [newText, setNewText] = useState("");
  const [likeInfo, setLikeInfo] = useState({ count: defaultLikes, isLiked: false });
  const [submitting, setSubmitting] = useState(false);
  const [authNotice, setAuthNotice] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !mediaKey) return;
    setAuthNotice("");
    setComments(getSocialComments(mediaKey));
    setLikeInfo(getSocialLikes(mediaKey, defaultLikes));
    setNewText("");

    // Live sync from server
    void fetchSocialComments(mediaKey).then((live) => {
      if (Array.isArray(live)) setComments(live);
    });
  }, [isOpen, mediaKey, defaultLikes]);

  if (!isOpen) return null;

  const handleLike = async () => {
    if (!user) {
      setAuthNotice(t("legacy.auth_required_to_like", "Vous devez être connecté pour aimer cet élément. Veuillez vous connecter ou créer un compte."));
      return;
    }
    setAuthNotice("");
    const updated = await toggleSocialLike(
      mediaKey,
      likeInfo.count,
      apiPath ? `${apiPath}/like` : undefined,
      entityType,
      entityId
    );
    setLikeInfo(updated);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthNotice(t("legacy.auth_required_to_comment", "Vous devez être connecté pour laisser un commentaire. Veuillez vous connecter ou créer un compte."));
      return;
    }
    if (!newText.trim() || submitting) return;
    setSubmitting(true);
    setAuthNotice("");
    const resolvedName = user.fullName || (user as any).full_name || user.email || t("legacy.member", "Member");
    const updated = await addSocialComment(
      mediaKey,
      newText.trim(),
      resolvedName,
      apiPath ? `${apiPath}/comment` : undefined,
      entityType,
      entityId
    );
    setComments(updated);
    setNewText("");
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string | number) => {
    const shouldDelete = window.confirm(t("legacy.confirm_delete_comment", "Supprimer ce commentaire ?"));
    if (!shouldDelete) return;

    try {
      if (typeof commentId === "number" || !String(commentId).startsWith("c_")) {
        await api.delete(`/social/comments/${commentId}`);
      }
    } catch {
      // ignore
    }
    setComments((prev) => prev.filter((c) => String(c.id) !== String(commentId)));
  };

  const isAdmin = user && (user.role === 1 || user.role === 3);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface-card frame-gold relative w-full max-w-lg rounded-xl bg-[var(--card)] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-start border border-[var(--gold)]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--gold)]/20 pb-3">
          <div className="min-w-0 flex-1">
            <span className="eyebrow text-[var(--gold)] text-[0.65rem] tracking-wider block">
              {itemSubtitle || t("legacy.community_discussion", "Community Reflections")}
            </span>
            <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)] truncate mt-0.5">
              {itemTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--gold)]/20 hover:text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Like Action Bar */}
        <div className="flex items-center justify-between py-1 px-1 bg-[var(--background)]/60 rounded-md border border-[var(--border)] text-xs">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors cursor-pointer ${
              likeInfo.isLiked
                ? "text-rose-500 font-bold bg-rose-500/10"
                : "text-[var(--muted-foreground)] hover:text-rose-400"
            }`}
            title={user ? t("like", "Aimer") : t("login_to_like", "Connectez-vous pour aimer")}
          >
            <Heart className={`h-4 w-4 ${likeInfo.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{likeInfo.count} {t("legacy.likes", "Likes")}</span>
          </button>
          <span className="text-[var(--muted-foreground)] text-xs flex items-center gap-1 pe-2">
            <MessageCircle className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>{comments.length} {t("legacy.comments", "Comments")}</span>
          </span>
        </div>

        {/* Authentication Notice if user tries to like/comment without account */}
        {authNotice && (
          <div className="p-3 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <span className="font-medium">{authNotice}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                to="/login"
                onClick={onClose}
                className="px-2.5 py-1 rounded bg-[#d9a441] text-black font-bold text-[11px] hover:opacity-90 inline-flex items-center gap-1"
              >
                <LogIn className="w-3 h-3" />
                <span>{t("login", "Connexion")}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Comments Feed */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pe-1 min-h-[140px] max-h-[340px]">
          {comments.length === 0 ? (
            <div className="py-10 text-center space-y-2 text-[var(--muted-foreground)]">
              <MessageCircle className="h-8 w-8 mx-auto text-[var(--gold)] opacity-40" />
              <p className="text-xs">
                {t("legacy.no_comments_yet", "No comments yet. Be the first to share your memory or reflection!")}
              </p>
            </div>
          ) : (
            comments.map((c) => {
              const canDelete = isAdmin || (user?.id && (c as any).userId && String((c as any).userId) === String(user.id));
              return (
                <div
                  key={c.id}
                  className="rounded-lg bg-[var(--background)] p-3 border border-[var(--border)] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[0.7rem]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)] font-bold text-[0.65rem]">
                        {(c.userName || "U").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-[var(--foreground)]">{c.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--muted-foreground)] flex items-center gap-1 text-[0.65rem]">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </span>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => void handleDeleteComment(c.id)}
                          className="text-stone-400 hover:text-red-500 p-0.5 rounded transition-colors"
                          title={t("legacy.delete", "Supprimer")}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[var(--foreground)]/90 leading-relaxed ps-8 whitespace-pre-line">
                    {c.text}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Input Form or Login Prompt */}
        <div className="pt-2 border-t border-[var(--gold)]/20">
          {!user ? (
            <div className="p-4 rounded-lg bg-[var(--background)]/80 border border-[var(--gold)]/30 text-center space-y-2.5">
              <p className="text-xs text-[var(--foreground)] font-semibold">
                {t("legacy.login_to_participate", "Vous devez être connecté pour participer à la discussion et laisser un commentaire.")}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="btn-base btn-gold text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t("login", "Se connecter")}</span>
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="btn-base btn-outline text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{t("register", "Créer un compte")}</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddComment} className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--gold)] font-bold px-1">
                <User className="w-3 h-3" />
                <span>{user.fullName || (user as any).full_name || user.email}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder={t("legacy.write_reflection", "Écrire un commentaire ou souvenir…")}
                  className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
                <button
                  type="submit"
                  disabled={submitting || !newText.trim()}
                  className="btn-base btn-gold text-xs px-3.5 py-2 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? "…" : t("legacy.send", "Publier")}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
