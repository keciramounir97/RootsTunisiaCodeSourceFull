import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Heart,
  Image as ImageIcon,
  Lock,
  MessageCircle,
  Search,
  Send,
  Users,
  Calendar,
} from "lucide-react";
import { api } from "../api/client";
import { getApiErrorMessage, getApiRoot } from "../api/helpers";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { useSiteContent } from "../hooks/useSiteContent";
import { PageHero, Section } from "../components/site/Primitives";
import SEO from "../components/SEO";
import manuscript from "../assets/family-archive.jpg";
import {
  ARTICLE_CATEGORIES,
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

export default function ArticlesPage() {
  const { t, isRtl } = useTranslation();
  const { user } = useAuth();
  const { getText, getImage } = useSiteContent();
  const apiRoot = useMemo(() => getApiRoot(), []);

  const [articles, setArticles] = useState<NormalizedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"latest" | "likes" | "comments">("latest");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [posting, setPosting] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftCategory, setDraftCategory] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<string | number | null>(null);

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
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

      const seen = new Set();
      const deduped = combined.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });

      setArticles(deduped);
    } catch (err) {
      setArticles(SCIENTIFIC_GEDCOM_ARTICLES);
      setError(getApiErrorMessage(err, t("articles_load_failed", "Could not load articles.")));
    } finally {
      setLoading(false);
    }
  }, [apiRoot, t, user]);

  useEffect(() => {
    void loadArticles();

    const handleUploadsChanged = (e: any) => {
      if (!e.detail || e.detail.kind === "articles") {
        void loadArticles();
      }
    };
    window.addEventListener("roots:uploads-changed", handleUploadsChanged);
    return () => window.removeEventListener("roots:uploads-changed", handleUploadsChanged);
  }, [loadArticles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const next = articles.filter((article) => {
      const matchesCategory =
        categoryFilter === "all" ||
        (article.category && article.category.toLowerCase() === categoryFilter.toLowerCase());
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q) ||
        article.author.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
    return [...next].sort((a: NormalizedArticle, b: NormalizedArticle) => {
      if (sort === "likes") return (b.likes || 0) - (a.likes || 0);
      if (sort === "comments") return (b.comments?.length || 0) - (a.comments?.length || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [articles, search, sort, categoryFilter]);

  const publish = async (event: FormEvent) => {
    event.preventDefault();
    if (!draftBody.trim()) return;
    try {
      setPosting(true);
      setError("");
      const payload = {
        title: draftTitle.trim() || draftBody.trim().slice(0, 90),
        category: draftCategory.trim() || "Heritage Chronicle",
        content: draftBody.trim(),
        visibility: "public",
        is_public: true,
      };

      let post: NormalizedArticle;
      try {
        const { data } = await api.post("/my/articles", payload);
        post = normalizeArticle(data?.data || data, apiRoot, user?.fullName || t("you", "You"), manuscript);
      } catch {
        // graceful local fallback
        post = {
          id: `art-local-${Date.now()}`,
          title: payload.title,
          category: payload.category,
          content: payload.content,
          authorName: user?.fullName || t("you", "You"),
          createdAt: new Date().toISOString(),
          images: [manuscript],
          likes: 1,
          isLiked: false,
          comments: [],
          visibility: "public",
        };
      }

      recordAdminUpload("articles", post);
      setArticles((prev) => [post, ...prev.filter((item) => item.id !== post.id)]);
      setDraftTitle("");
      setDraftBody("");
      setDraftCategory("");
    } catch (err) {
      setError(
        getApiErrorMessage(err, t("post_publish_failed", "Could not publish the article."))
      );
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (id: number | string) => {
    if (!user) {
      alert(t("legacy.login_to_like", "Vous devez être connecté avec un compte pour aimer un article."));
      return;
    }
    const key = `gallery_article_${id}`;
    const target = articles.find((a) => a.id === id);
    const result = await toggleSocialLike(key, target?.likes || 0, undefined, "article", Number(id) || undefined);

    setArticles((prev) =>
      prev.map((article) =>
        article.id === id
          ? {
              ...article,
              isLiked: result.isLiked,
              likes: result.count,
            }
          : article,
      ),
    );
    try {
      await api.post(`/my/articles/${id}/like`);
    } catch {
      // Keep optimistic state
    }
  };

  const addComment = async (id: number | string) => {
    const body = (commentDrafts[String(id)] || "").trim();
    if (!body) return;
    const authorName = user?.fullName || t("articles_guest_name", "Guest");
    const key = `gallery_article_${id}`;

    await addSocialComment(key, body, authorName);

    const comment = {
      id: Date.now(),
      userId: String(user?.id || "guest"),
      userName: authorName,
      text: body,
      createdAt: new Date().toISOString(),
    };
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, comments: [...(article.comments || []), comment] } : article,
      ),
    );
    setCommentDrafts((drafts) => ({ ...drafts, [String(id)]: "" }));
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("articles_seo_title", "Articles — Roots Tunisia")}
        description={t(
          "articles_seo_desc",
          "Read and share Tunisian genealogy findings: civil registry, Ottoman sijillat, Kairouan nasab, and governorate histories.",
        )}
      />

      <PageHero
        eyebrow={getText("gallery_articles", "hero", "eyebrow") ?? getText("articles", "hero", "eyebrow") ?? t("nav_articles")}
        title={getText("gallery_articles", "hero", "title") ?? getText("articles", "hero", "title") ?? t("articles_hero_title", "Tunisian Lineage, Written in the Open")}
        subtitle={
          getText("gallery_articles", "hero", "subtitle") ??
          getText("articles", "hero", "subtitle") ??
          t(
            "articles_hero_subtitle",
            "Discoveries from civil registry, court sijillat, habous deeds, and family memory indexed across twenty-four governorates.",
          )
        }
        image={getImage("gallery_articles", "hero", "image") ?? getImage("articles", "hero", "image") ?? manuscript}
      >
        <Link to="/gallery/articles" className="btn-base btn-gold w-full sm:w-auto min-w-[180px]">
          {t("articles_community_feed", "Community Feed")}
        </Link>
        <Link to="/research" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[180px]">
          {t("nav_research", "Research")}
        </Link>
      </PageHero>

      <Section>
        <div className="surface-card frame-gold p-5 rounded-lg bg-[var(--card)]/95 shadow-md space-y-4 text-start">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  ["latest", t("articles_sort_latest", "Latest")],
                  ["likes", t("articles_sort_likes", "Most liked")],
                  ["comments", t("articles_sort_comments", "Most commented")],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold cursor-pointer transition-all ${
                    sort === key
                      ? "bg-[var(--gold)] text-[#1f160f] font-bold shadow-sm"
                      : "bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full">
            <Search className="h-4 w-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("articles_search", "Search articles…")}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] ps-9 pe-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                categoryFilter === "all"
                  ? "bg-[var(--gold)] text-[#1f160f] font-bold"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
              }`}
            >
              {t("cat_all", "All")}
            </button>
            {ARTICLE_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategoryFilter(cat.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                  categoryFilter === cat.key
                    ? "bg-[var(--gold)] text-[#1f160f] font-bold"
                    : "bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
                }`}
              >
                {t(cat.labelKey, cat.defaultLabel)}
              </button>
            ))}
          </div>
        </div>

        {/* Create Form */}
        <form onSubmit={publish} className="surface-card frame-gold mt-6 p-5 sm:p-6 rounded-lg bg-[var(--card)]/95 shadow-md space-y-3 text-start">
          <h3 className="font-display text-base font-bold text-[var(--foreground)]">
            {t("publish_new_article", "Publish an Archival Article")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder={t("article_title_placeholder", "Article Title (optional)")}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
            <input
              value={draftCategory}
              onChange={(e) => setDraftCategory(e.target.value)}
              placeholder={t("articles_category_placeholder", "Category (civil registry, sijillat, governorate…)")}
              className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>
          <textarea
            rows={4}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            placeholder={t("articles_body_placeholder", "Document your lineage research, cemetery readings, or archival discovery…")}
            className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
          />
          <div className="flex items-center justify-between pt-2">
            <span className="text-[0.68rem] text-[var(--muted-foreground)]">
              {t("articles_login_hint", "Sign in to publish. Everyone can read, like, and comment.")}
            </span>
            <button
              type="submit"
              disabled={posting || !draftBody.trim()}
              className="btn-base btn-gold text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{posting ? t("posting", "Publishing…") : t("articles_publish", "Publish")}</span>
            </button>
          </div>
          {error ? <p className="text-xs text-rose-500 font-semibold">{error}</p> : null}
        </form>

        {/* Articles List */}
        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 rounded-full border-2 border-[var(--gold)]/30 border-t-[var(--gold)] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="surface-card frame-gold p-12 text-center rounded-lg space-y-3">
              <Users className="h-10 w-10 text-[var(--gold)] mx-auto opacity-70" />
              <p className="font-display text-base font-bold text-[var(--foreground)]">
                {t("no_articles_match", "No articles match your search.")}
              </p>
            </div>
          ) : (
            filtered.map((article) => (
              <article
                key={article.id}
                className="surface-card frame-gold p-6 sm:p-7 rounded-lg shadow-md space-y-4 text-start hover:border-[var(--gold)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 font-bold text-xs shrink-0">
                      {(article.author || "A").charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
                        {article.author}
                      </p>
                      <p className="text-[0.68rem] text-[var(--muted-foreground)] flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimeAgo(article.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                  {article.category ? (
                    <span className="rounded-sm bg-[var(--gold)]/15 border border-[var(--gold)]/30 px-2.5 py-0.5 text-[0.68rem] font-bold text-[var(--gold)]">
                      {article.category}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-base sm:text-lg font-bold text-[var(--foreground)]">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground)]/85 leading-relaxed whitespace-pre-line">
                    {article.content}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => void toggleLike(article.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        article.isLiked ? "text-rose-500 font-bold" : "text-[var(--muted-foreground)] hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${article.isLiked ? "fill-rose-500" : ""}`} />
                      <span>{article.likes}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenComments(openComments === article.id ? null : article.id)}
                      className="flex items-center gap-1.5 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{article.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>

                {openComments === article.id ? (
                  <div className="border-t border-[var(--border)] pt-3 space-y-3 animate-fade-in">
                    {article.comments && article.comments.length > 0 ? (
                      <div className="space-y-2">
                        {article.comments.map((c) => (
                          <div key={c.id} className="rounded-md bg-[var(--background)] p-3 border border-[var(--border)] text-xs">
                            <span className="font-bold text-[var(--gold)]">{c.userName}: </span>
                            <span className="text-[var(--foreground)]">{c.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex gap-2">
                      <input
                        value={commentDrafts[String(article.id)] || ""}
                        onChange={(e) =>
                          setCommentDrafts({
                            ...commentDrafts,
                            [String(article.id)]: e.target.value,
                          })
                        }
                        placeholder={t("write_comment", "Write a comment...")}
                        className="flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                      />
                      <button
                        type="button"
                        onClick={() => addComment(article.id)}
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
