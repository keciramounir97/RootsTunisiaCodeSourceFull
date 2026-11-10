import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Globe,
  Heart,
  Image as ImageIcon,
  Lock,
  MessageCircle,
  Plus,
  Send,
  Users,
  X,
} from "lucide-react";
import { api } from "../api/client";
import { getApiErrorMessage, getApiRoot } from "../api/helpers";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { useSiteContent } from "../hooks/useSiteContent";
import { PageHero, Section } from "../components/site/Primitives";
import SEO from "../components/SEO";
import manuscript from "../assets/family-archive.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import {
  extractArticleList,
  formatTimeAgo,
  normalizeArticle,
  type NormalizedArticle,
  SCIENTIFIC_GEDCOM_ARTICLES,
} from "../utils/articleNormalize";
import {
  recordAdminUpload,
  getTrackedUploads,
  getSocialLikes,
  toggleSocialLike,
  addSocialComment,
  getSocialComments,
} from "../utils/gallerySocial";

export default function GalleryArticles() {
  const { t, isRtl } = useTranslation();
  const { user } = useAuth();
  const { getText, getImage } = useSiteContent();
  const apiRoot = useMemo(() => getApiRoot(), []);

  const [posts, setPosts] = useState<NormalizedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImages, setNewImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [visibility, setVisibility] = useState<"public" | "community" | "private">("public");
  const [postError, setPostError] = useState("");
  const [activePostId, setActivePostId] = useState<number | string | null>(null);
  const [newComment, setNewComment] = useState("");

  const loadAllArticles = async () => {
    try {
      setLoading(true);
      let apiItems: any[] = [];
      try {
        const { data } = await api.get("/articles");
        apiItems = extractArticleList(data);
      } catch {
        // fallback
      }

      const normalizedApi = apiItems.map((item) => {
        const norm = normalizeArticle(item, apiRoot, t("member", "Member"), manuscript);
        const social = getSocialLikes(`gallery_article_${norm.id}`, norm.likes || 0);
        const storedComments = getSocialComments(`gallery_article_${norm.id}`);
        return {
          ...norm,
          likes: social.count,
          isLiked: social.isLiked,
          comments: storedComments.length > 0 ? storedComments.map((c: any) => ({
            id: c.id,
            userId: "user",
            userName: c.userName,
            text: c.text,
            createdAt: c.createdAt,
          })) : norm.comments,
        };
      });

      const tracked = getTrackedUploads("articles").map((item: any) => {
        const norm = normalizeArticle(item, apiRoot, item.authorName || user?.fullName || t("you", "You"), manuscript);
        const social = getSocialLikes(`gallery_article_${norm.id}`, norm.likes || 0);
        const storedComments = getSocialComments(`gallery_article_${norm.id}`);
        return {
          ...norm,
          likes: social.count,
          isLiked: social.isLiked,
          comments: storedComments.length > 0 ? storedComments.map((c: any) => ({
            id: c.id,
            userId: "user",
            userName: c.userName,
            text: c.text,
            createdAt: c.createdAt,
          })) : norm.comments,
        };
      });

      const combined = [...tracked, ...normalizedApi, ...SCIENTIFIC_GEDCOM_ARTICLES].sort(
        (a: NormalizedArticle, b: NormalizedArticle) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Deduplicate by id
      const seen = new Set();
      const deduped = combined.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });

      setPosts(deduped);
    } catch {
      setPosts(SCIENTIFIC_GEDCOM_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllArticles();

    const handleUploadsChanged = (e: any) => {
      if (!e.detail || e.detail.kind === "articles") {
        loadAllArticles();
      }
    };
    window.addEventListener("roots:uploads-changed", handleUploadsChanged);
    return () => window.removeEventListener("roots:uploads-changed", handleUploadsChanged);
  }, [apiRoot, t]);

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    setPostError("");
    try {
      setPosting(true);
      const payload = {
        title: newContent.trim().slice(0, 90),
        category: newCategory.trim() || "Heritage Chronicle",
        content: newContent.trim(),
        images: newImages.length > 0 ? newImages : [manuscript],
        visibility,
        is_public: visibility !== "private",
      };

      let post: NormalizedArticle;
      try {
        const { data } = await api.post("/my/articles", payload);
        post = normalizeArticle(data?.data || data, apiRoot, user?.fullName || t("you", "You"), manuscript);
      } catch {
        // Fallback gracefully so post is saved even offline or without login
        post = {
          id: `art-local-${Date.now()}`,
          title: payload.title,
          category: payload.category,
          content: payload.content,
          authorName: user?.fullName || t("you", "You"),
          createdAt: new Date().toISOString(),
          images: payload.images,
          likes: 1,
          isLiked: false,
          comments: [],
          visibility: payload.visibility,
        };
      }

      recordAdminUpload("articles", post);
      setPosts((prev) => [post, ...prev.filter((item) => item.id !== post.id)]);
      setNewContent("");
      setNewCategory("");
      setNewImages([]);
      setVisibility("public");
      setShowCreate(false);
    } catch (err) {
      setPostError(
        getApiErrorMessage(err, t("post_publish_failed", "Could not publish the post."))
      );
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number | string) => {
    if (!user) {
      alert(t("legacy.login_to_like", "Vous devez être connecté avec un compte pour aimer un article."));
      return;
    }
    const key = `gallery_article_${postId}`;
    const target = posts.find((p) => p.id === postId);
    const result = await toggleSocialLike(key, target?.likes || 0, undefined, "article", Number(postId) || undefined);

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: result.isLiked,
              likes: result.count,
            }
          : post,
      ),
    );
    try {
      await api.post(`/my/articles/${postId}/like`);
    } catch {
      // local like still stands
    }
  };

  const handleComment = async (postId: number | string) => {
    if (!newComment.trim()) return;
    const authorName = user?.fullName || t("you", "You");
    const text = newComment.trim();
    const key = `gallery_article_${postId}`;

    await addSocialComment(key, text, authorName);

    const comment = {
      id: Date.now(),
      userId: String(user?.id || "guest"),
      userName: authorName,
      text,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [...(post.comments || []), comment] } : post,
      ),
    );
    setNewComment("");
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("gallery_articles_seo_title", "Heritage Stories — Roots Tunisia")}
        description={t(
          "gallery_articles_seo_desc",
          "Share Tunisian family stories, archival finds, and photographs with the Roots Tunisia community.",
        )}
      />
      <PageHero
        eyebrow={getText("gallery_articles", "hero", "eyebrow") ?? t("community", "Community")}
        title={getText("gallery_articles", "hero", "title") ?? t("articles_feed", "Heritage Stories")}
        subtitle={
          getText("gallery_articles", "hero", "subtitle") ??
          t(
            "articles_intro",
            "Share family discoveries, sijillat notes, and photographs from Carthage to Djerba.",
          )
        }
        image={getImage("gallery_articles", "hero", "image") ?? kairouan}
      />

      <Section>
        <div className="surface-card frame-gold p-5 rounded-lg bg-[var(--card)]/95 shadow-md text-start">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 text-sm font-bold shrink-0">
              {(user?.fullName || t("user", "User")).charAt(0)}
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-start text-xs sm:text-sm text-[var(--muted-foreground)] hover:border-[var(--gold)] cursor-pointer"
            >
              {t("share_story", "Share your family story...")}
            </button>
          </div>
          {postError ? <p className="mt-3 text-xs text-rose-500 font-semibold">{postError}</p> : null}
        </div>

        {showCreate ? (
          <div className="surface-card frame-gold mt-4 p-5 sm:p-6 rounded-lg bg-[var(--card)] shadow-lg space-y-4 text-start animate-fade-in">
            <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
              <p className="font-display text-base font-bold text-[var(--foreground)]">
                {t("articles_compose_title", "Publish a finding")}
              </p>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                aria-label={t("cancel", "Cancel")}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder={t("articles_category_placeholder", "Category (civil registry, sijillat, governorate…)")}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={t("share_story", "Share your family story...")}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
            <div className="flex gap-2">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder={t("image_url", "Image URL")}
                className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
              <button
                type="button"
                onClick={() => {
                  const clean = imageInput.trim();
                  if (!clean) return;
                  setNewImages((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
                  setImageInput("");
                }}
                className="btn-base btn-outline text-xs px-3"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {newImages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {newImages.map((url) => (
                  <span key={url} className="inline-flex items-center gap-1 rounded-md bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2 py-1 text-xs">
                    <ImageIcon className="h-3 w-3 text-[var(--gold)]" />
                    <span className="truncate max-w-[140px]">{url}</span>
                    <button type="button" onClick={() => setNewImages((prev) => prev.filter((item) => item !== url))} className="cursor-pointer">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              >
                <option value="public">{t("public", "Public")}</option>
                <option value="community">{t("community", "Community")}</option>
                <option value="private">{t("private", "Private")}</option>
              </select>
              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={posting || !newContent.trim()}
                className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{posting ? t("posting", "Publishing…") : t("articles_publish", "Publish")}</span>
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 rounded-full border-2 border-[var(--gold)]/30 border-t-[var(--gold)] animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="surface-card frame-gold p-12 text-center rounded-lg space-y-3">
              <Users className="h-10 w-10 text-[var(--gold)] mx-auto opacity-70" />
              <p className="font-display text-base font-bold text-[var(--foreground)]">
                {t("no_articles_yet", "No stories published yet.")}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t("first_story_prompt", "Be the first to share an archival finding or family memory.")}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="surface-card frame-gold p-6 sm:p-7 rounded-lg shadow-md space-y-4 text-start hover:border-[var(--gold)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 font-bold text-xs shrink-0">
                      {(post.author || "A").charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
                        {post.author}
                      </p>
                      <p className="text-[0.68rem] text-[var(--muted-foreground)] flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimeAgo(post.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                  {post.category ? (
                    <span className="rounded-sm bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2 py-0.5 text-[0.68rem] font-bold text-[var(--gold)]">
                      {post.category}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  {post.title ? (
                    <h3 className="font-display text-base sm:text-lg font-bold text-[var(--foreground)]">
                      {post.title}
                    </h3>
                  ) : null}
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/85 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {post.images && post.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden border border-[var(--gold)]/20">
                    {post.images.map((img, i) => (
                      <div key={i} className="aspect-video bg-black/30 overflow-hidden">
                        <img src={img} alt="Post attachment" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => void handleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.isLiked ? "text-rose-500 font-bold" : "text-[var(--muted-foreground)] hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? "fill-rose-500" : ""}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>

                {activePostId === post.id ? (
                  <div className="border-t border-[var(--border)] pt-3 space-y-3 animate-fade-in">
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-2">
                        {post.comments.map((c) => (
                          <div key={c.id} className="rounded-md bg-[var(--background)] p-3 border border-[var(--border)] text-xs">
                            <span className="font-bold text-[var(--gold)]">{c.userName}: </span>
                            <span className="text-[var(--foreground)]">{c.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex gap-2">
                      <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t("write_comment", "Write a comment...")}
                        className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                      />
                      <button
                        type="button"
                        onClick={() => handleComment(post.id)}
                        className="btn-base btn-gold text-xs py-1.5 px-3 cursor-pointer"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </Section>
    </div>
  );
}
