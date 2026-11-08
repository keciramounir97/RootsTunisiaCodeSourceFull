import { useState, useEffect } from "react";
import { X, Send, MessageCircle, Heart, User, Calendar } from "lucide-react";
import {
  type SocialComment,
  getSocialComments,
  addSocialComment,
  getSocialLikes,
  toggleSocialLike,
} from "../utils/gallerySocial";
import { useAuth } from "../admin/components/AuthContext";
import { useTranslation } from "../context/TranslationContext";

interface GalleryCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaKey: string;
  itemTitle: string;
  itemSubtitle?: string;
  defaultLikes?: number;
  apiPath?: string;
}

export default function GalleryCommentsModal({
  isOpen,
  onClose,
  mediaKey,
  itemTitle,
  itemSubtitle,
  defaultLikes = 0,
  apiPath,
}: GalleryCommentsModalProps) {
  const { user } = useAuth();
  const { t, isRtl } = useTranslation();
  const [comments, setComments] = useState<SocialComment[]>([]);
  const [newText, setNewText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [likeInfo, setLikeInfo] = useState({ count: defaultLikes, isLiked: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !mediaKey) return;
    setComments(getSocialComments(mediaKey));
    setLikeInfo(getSocialLikes(mediaKey, defaultLikes));
    setNewText("");
    if (user?.fullName) {
      setAuthorName(user.fullName);
    }
  }, [isOpen, mediaKey, defaultLikes, user]);

  if (!isOpen) return null;

  const handleLike = async () => {
    const updated = await toggleSocialLike(mediaKey, likeInfo.count, apiPath ? `${apiPath}/like` : undefined);
    setLikeInfo(updated);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || submitting) return;
    setSubmitting(true);
    const resolvedName = authorName.trim() || user?.fullName || t("legacy.member", "Member");
    const updated = await addSocialComment(
      mediaKey,
      newText.trim(),
      resolvedName,
      apiPath ? `${apiPath}/comment` : undefined
    );
    setComments(updated);
    setNewText("");
    setSubmitting(false);
  };

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
          >
            <Heart className={`h-4 w-4 ${likeInfo.isLiked ? "fill-rose-500" : ""}`} />
            <span>{likeInfo.count} {t("legacy.likes", "Likes")}</span>
          </button>
          <span className="text-[var(--muted-foreground)] text-xs flex items-center gap-1 pe-2">
            <MessageCircle className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>{comments.length} {t("legacy.comments", "Comments")}</span>
          </span>
        </div>

        {/* Comments Feed */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pe-1 min-h-[140px] max-h-[360px]">
          {comments.length === 0 ? (
            <div className="py-10 text-center space-y-2 text-[var(--muted-foreground)]">
              <MessageCircle className="h-8 w-8 mx-auto text-[var(--gold)] opacity-40" />
              <p className="text-xs">
                {t("legacy.no_comments_yet", "No comments yet. Share your memory or insight on this item!")}
              </p>
            </div>
          ) : (
            comments.map((c) => (
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
                  <span className="text-[var(--muted-foreground)] flex items-center gap-1 text-[0.65rem]">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <p className="text-[var(--foreground)]/90 leading-relaxed ps-8 whitespace-pre-line">
                  {c.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddComment} className="pt-2 border-t border-[var(--gold)]/20 space-y-2">
          {!user && (
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={t("legacy.your_name", "Your name (optional)")}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={t("legacy.write_reflection", "Write a comment or memory…")}
              className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
            <button
              type="submit"
              disabled={submitting || !newText.trim()}
              className="btn-base btn-gold text-xs px-3.5 py-2 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? "…" : t("legacy.send", "Send")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
