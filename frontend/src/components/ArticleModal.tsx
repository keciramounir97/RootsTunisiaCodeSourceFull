import { useState } from "react";
import {
  X,
  Calendar,
  User,
  Heart,
  MessageCircle,
  ExternalLink,
  BookOpen,
  FileCheck,
  Send,
  Share2,
  Clock,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import type { NormalizedArticle } from "../utils/articleNormalize";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";

interface ArticleModalProps {
  article: NormalizedArticle;
  onClose: () => void;
  onLike?: (id: number | string) => void;
  onAddComment?: (id: number | string, text: string) => void;
  isAuthor?: boolean;
  onEdit?: (article: NormalizedArticle) => void;
  onDelete?: (id: number | string) => void;
}

export default function ArticleModal({
  article,
  onClose,
  onLike,
  onAddComment,
  isAuthor = false,
  onEdit,
  onDelete,
}: ArticleModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onAddComment) {
      onAddComment(article.id, commentText.trim());
      setCommentText("");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[var(--card)] border border-[var(--gold)]/50 shadow-2xl p-4 sm:p-7 my-auto text-[var(--foreground)] animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[94vh] overflow-hidden text-start">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--gold)]/25 pb-3.5 shrink-0 gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
              {article.category || "Archives & Notariats"}
            </span>
            {article.readingTime && (
              <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{article.readingTime} de lecture</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthor && onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(article);
                }}
                className="p-2 rounded-lg border border-amber-500/40 text-xs text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                title="Modifier mon article"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Modifier</span>
              </button>
            )}

            {isAuthor && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(article.id);
                  onClose();
                }}
                className="p-2 rounded-lg border border-rose-500/40 text-xs text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-1.5 cursor-pointer font-bold"
                title="Supprimer mon article"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-lg border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copier le lien de l'article"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Lien copié !" : "Partager"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10 cursor-pointer"
              title={t("close", "Fermer")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 pe-2 space-y-6 scrollbar-thin">
          
          {/* Article Title & Metadata */}
          <div className="space-y-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)] leading-snug">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] flex-wrap pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                <User className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{article.userName || "Karim Admin"}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Featured Image if available */}
          {article.images && article.images.length > 0 && (
            <div className="rounded-xl overflow-hidden border border-[var(--gold)]/30 max-h-[380px] bg-black/40">
              <img
                src={article.images[0]}
                alt={article.title}
                className="w-full h-full object-cover max-h-[380px]"
              />
            </div>
          )}

          {/* Full Article Text */}
          <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[var(--foreground)]/90 space-y-4 whitespace-pre-line font-serif border-y border-[var(--border)] py-6">
            {article.content}
          </div>

          {/* SECTION DÉDIÉE : SOURCES & DOCUMENTS D'ARCHIVES RATTACHÉS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-[var(--gold)]/20 pb-2">
              <FileCheck className="w-5 h-5 text-[var(--gold)]" />
              <h2 className="font-display text-lg font-bold text-[var(--foreground)]">
                Sources & Documents d&apos;Archives Rattachés
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30">
                {article.sources?.length || 0} cote{(article.sources?.length || 0) > 1 ? "s" : ""}
              </span>
            </div>

            {article.sources && article.sources.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {article.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)]/80 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-[var(--foreground)]">
                          {src.title}
                        </h3>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--gold)] hover:text-amber-300 p-1 shrink-0"
                            title="Ouvrir le portail d'archives"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {src.cote && (
                        <p className="text-[11px] font-mono text-[var(--gold)] bg-[var(--card)] px-2 py-1 rounded border border-[var(--border)]">
                          <strong>Cote :</strong> {src.cote}
                        </p>
                      )}

                      {src.note && (
                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                          {src.note}
                        </p>
                      )}
                    </div>

                    {src.url && (
                      <div className="pt-2">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-base btn-gold text-[11px] py-1.5 px-3 inline-flex items-center gap-1.5 w-full justify-center"
                        >
                          <span>Consulter la Source en Ligne</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)] italic">
                Cet article repose sur les sources générales du fonds historiographique tunisien.
              </p>
            )}
          </div>

          {/* Comments & Discussion */}
          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[var(--gold)]" />
                <span>Discussion & Retours ({article.comments?.length || 0})</span>
              </h2>

              {onLike && (
                <button
                  type="button"
                  onClick={() => onLike(article.id)}
                  className={`btn-base btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer transition-all ${
                    article.isLiked ? "border-rose-500/50 bg-rose-500/10 text-rose-500" : ""
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${article.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"}`} />
                  <span className="font-bold">{article.likes || 0}</span>
                </button>
              )}
            </div>

            {/* Comment List */}
            {article.comments && article.comments.length > 0 ? (
              <div className="space-y-2.5">
                {article.comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <strong className="text-[var(--gold)]">{c.userName}</strong>
                      <span className="text-[var(--muted-foreground)] font-mono">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[var(--foreground)]/90">{c.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)] italic">
                Aucun commentaire pour l&apos;instant. Soyez le premier à réagir !
              </p>
            )}

            {/* Add Comment Form */}
            {onAddComment && (
              <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={user ? "Partagez votre avis ou apportez une précision d'archives..." : "Connectez-vous pour participer à la discussion..."}
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
                <button
                  type="submit"
                  className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-3.5 border-t border-[var(--border)] flex items-center justify-between text-xs shrink-0">
          <span className="text-[var(--muted-foreground)] font-mono">
            ID Article : #{article.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-base btn-outline text-xs py-1.5 px-4 cursor-pointer"
          >
            Fermer l&apos;Aperçu
          </button>
        </div>
      </div>
    </div>
  );
}

