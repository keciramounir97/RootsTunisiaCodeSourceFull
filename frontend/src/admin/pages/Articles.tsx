import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiErrorMessage, getApiRoot, requestWithFallback, shouldFallbackRoute } from "../../api/helpers";
import { Edit, Globe, Image as ImageIcon, Lock, MessageCircle, Play, Send, Trash2, Users, X } from "lucide-react";
import Toast from "../../components/Toast";
import manuscript from "../../assets/family-archive.jpg";
import {
  extractArticleList,
  normalizeArticle,
  resolveMediaUrl,
  type NormalizedArticle,
} from "../../utils/articleNormalize";

export default function AdminArticles() {
  const { t } = useTranslation();
  const apiRoot = useMemo(() => getApiRoot(), []);
  const [articles, setArticles] = useState<NormalizedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [imageInput, setImageInput] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    visibility: "public" as "public" | "community" | "private",
    images: [] as string[],
    videos: [] as string[],
  });
  const [toast, setToast] = useState({ message: "", tone: "success" as "success" | "error" });

  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    setToast({ message, tone });
  }, []);

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => setToast({ message: "", tone: "success" }), 3500);
    return () => clearTimeout(timer);
  }, [toast.message]);

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      const shouldFallback = (err: any) => shouldFallbackRoute(err) || [401, 403, 500].includes(err?.response?.status);
      const { data } = await requestWithFallback(
        [() => api.get("/admin/articles"), () => api.get("/my/articles"), () => api.get("/articles")],
        shouldFallback,
      );
      const list = extractArticleList(data);
      setArticles(list.map((item: any) => normalizeArticle(item, apiRoot, t("user", "User"), manuscript)));
    } catch (err) {
      setArticles([]);
      notify(getApiErrorMessage(err, t("posts_load_failed", "Failed to load posts")), "error");
    } finally {
      setLoading(false);
    }
  }, [apiRoot, notify, t]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const resetForm = () => {
    setEditingId(null);
    setImageInput("");
    setVideoInput("");
    setForm({ title: "", category: "", content: "", visibility: "public", images: [], videos: [] });
  };

  const addMedia = (kind: "images" | "videos", url: string) => {
    const clean = String(url || "").trim();
    if (!clean) return;
    setForm((prev) => (prev[kind].includes(clean) ? prev : { ...prev, [kind]: [...prev[kind], clean] }));
  };

  const removeMedia = (kind: "images" | "videos", url: string) => {
    setForm((prev) => ({ ...prev, [kind]: prev[kind].filter((u) => u !== url) }));
  };

  const saveArticle = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) {
      notify(t("content_required", "Please enter content"), "error");
      return;
    }

    const payload = {
      title: form.title.trim() || form.content.trim().slice(0, 90),
      category: form.category.trim(),
      content: form.content.trim(),
      visibility: form.visibility,
      images: form.images,
      videos: form.videos,
    };

    try {
      setSaving(true);
      const shouldFallback = (err: any) => shouldFallbackRoute(err) || [401, 403, 500].includes(err?.response?.status);
      if (editingId) {
        await requestWithFallback(
          [() => api.put(`/admin/articles/${editingId}`, payload), () => api.put(`/my/articles/${editingId}`, payload)],
          shouldFallback,
        );
        notify(t("article_updated", "Post updated."));
      } else {
        await requestWithFallback(
          [() => api.post("/admin/articles", payload), () => api.post("/my/articles", payload)],
          shouldFallback,
        );
        notify(t("article_created", "Post published."));
      }
      resetForm();
      await loadArticles();
    } catch (err) {
      notify(getApiErrorMessage(err, t("post_save_failed", "Failed to save post")), "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (id: number | string) => {
    if (!window.confirm(t("confirm_delete", "Are you sure you want to delete this item?"))) return;
    try {
      const shouldFallback = (err: any) => shouldFallbackRoute(err) || [401, 403, 500].includes(err?.response?.status);
      await requestWithFallback(
        [() => api.delete(`/admin/articles/${id}`), () => api.delete(`/my/articles/${id}`)],
        shouldFallback,
      );
      notify(t("article_deleted", "Post deleted."));
      await loadArticles();
    } catch (err) {
      notify(getApiErrorMessage(err, t("post_delete_failed", "Failed to delete post")), "error");
    }
  };

  const editArticle = (item: NormalizedArticle) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      category: item.category || "",
      content: item.content || "",
      visibility: item.visibility || "public",
      images: Array.isArray(item.images) ? item.images : [],
      videos: Array.isArray(item.videos) ? item.videos : [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = useMemo(() => {
    const total = articles.length;
    const media = articles.filter((a) => (a.images?.length || 0) + (a.videos?.length || 0) > 0).length;
    const community = articles.filter((a) => a.visibility === "community").length;
    return { total, media, community };
  }, [articles]);

  return (
    <div className="min-h-screen p-6 bg-[var(--background)] text-[var(--foreground)]">
      <Toast message={toast.message} tone={toast.tone} />
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="surface-card p-6">
          <h1 className="font-display text-3xl">{t("article_management", "Genealogy articles")}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {t("article_desc", "Publish discoveries, stories, and media-rich family updates.")}
          </p>
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            <div className="rounded-sm p-3 bg-[var(--gold)]/10">
              <p className="text-xs opacity-70">{t("posts", "Posts")}</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-sm p-3 bg-[var(--primary)]/10">
              <p className="text-xs opacity-70">{t("with_media", "With Media")}</p>
              <p className="text-xl font-bold">{stats.media}</p>
            </div>
            <div className="rounded-sm p-3 bg-[var(--secondary)]">
              <p className="text-xs opacity-70">{t("community", "Community")}</p>
              <p className="text-xl font-bold">{stats.community}</p>
            </div>
          </div>
        </section>

        <section className="surface-card p-6">
          <form onSubmit={saveArticle} className="space-y-4">
            <input
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              placeholder={t("post_title", "Post title")}
              className="w-full rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--gold)]"
            />
            <input
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              placeholder={t("custom_category_placeholder", "Name this category...")}
              className="w-full rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none focus:border-[var(--gold)]"
            />
            <textarea
              rows={5}
              value={form.content}
              onChange={(e) => setForm((s) => ({ ...s, content: e.target.value }))}
              placeholder={t(
                "share_story_placeholder",
                "Share a family discovery, migration story, or archival finding...",
              )}
              className="w-full rounded-sm border border-[var(--border)] bg-[var(--background)] p-4 outline-none focus:border-[var(--gold)]"
            />

            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex gap-2">
                <input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder={t("image_url", "Image URL")}
                  className="flex-1 rounded-sm border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    addMedia("images", imageInput);
                    setImageInput("");
                  }}
                  className="px-3 rounded-sm border border-[var(--border)] inline-flex items-center gap-1"
                >
                  <ImageIcon className="w-4 h-4" />
                  {t("add", "Add")}
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder={t("video_url", "Video URL")}
                  className="flex-1 rounded-sm border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    addMedia("videos", videoInput);
                    setVideoInput("");
                  }}
                  className="px-3 rounded-sm border border-[var(--border)] inline-flex items-center gap-1"
                >
                  <Play className="w-4 h-4" />
                  {t("add", "Add")}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.images.map((u) => (
                <span key={u} className="text-xs px-2 py-1 rounded-sm bg-[var(--gold)]/15 inline-flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {u.slice(0, 42)}
                  {u.length > 42 ? "..." : ""}
                  <button type="button" onClick={() => removeMedia("images", u)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {form.videos.map((u) => (
                <span key={u} className="text-xs px-2 py-1 rounded-sm bg-[var(--primary)]/10 inline-flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  {u.slice(0, 42)}
                  {u.length > 42 ? "..." : ""}
                  <button type="button" onClick={() => removeMedia("videos", u)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {form.images.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {form.images.slice(0, 3).map((url) => (
                  <img
                    key={url}
                    src={resolveMediaUrl(url, apiRoot, manuscript)}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.src = manuscript;
                    }}
                    className="h-32 w-full rounded-sm object-cover"
                  />
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={form.visibility}
                onChange={(e) => setForm((s) => ({ ...s, visibility: e.target.value as typeof form.visibility }))}
                className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-3 py-2"
              >
                <option value="public">{t("public", "Public")}</option>
                <option value="community">{t("community", "Community")}</option>
                <option value="private">{t("private", "Private")}</option>
              </select>
              <button disabled={saving} className="btn-base btn-gold">
                <Send className="w-4 h-4" />
                {saving ? t("posting", "Posting...") : editingId ? t("update", "Update") : t("post", "Post")}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className="btn-base btn-outline-ink">
                  <X className="w-4 h-4" />
                  {t("cancel", "Cancel")}
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="surface-card p-6">
          {loading ? (
            <div className="py-12 text-center opacity-60">{t("loading", "Loading...")}</div>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center opacity-60">{t("no_articles", "No posts yet.")}</div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <article key={article.id} className="rounded-sm border border-[var(--border)] overflow-hidden bg-[var(--background)]">
                  {(article.images || [])[0] ? (
                    <a href={(article.images || [])[0]} target="_blank" rel="noreferrer" className="block">
                      <img
                        src={(article.images || [])[0]}
                        alt={article.title || t("article_image", "Article image")}
                        onError={(event) => {
                          event.currentTarget.src = manuscript;
                        }}
                        className="h-56 w-full object-cover"
                      />
                    </a>
                  ) : null}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white grid place-items-center text-xs font-bold">
                          {(article.userName || t("user", "User")).charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{article.userName || t("user", "User")}</p>
                          <p className="text-xs opacity-60">
                            {article.createdAt ? new Date(article.createdAt).toLocaleString() : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editArticle(article)} className="p-2 rounded-sm hover:bg-[var(--gold)]/15">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          className="p-2 rounded-sm hover:bg-red-500/20 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {article.title ? <h3 className="mt-4 font-display text-xl">{article.title}</h3> : null}
                    {article.category ? (
                      <span className="mt-3 inline-flex px-2.5 py-1 rounded-sm bg-[var(--gold)]/15 text-[var(--gold)] text-xs font-semibold">
                        {article.category}
                      </span>
                    ) : null}
                    <p className="mt-2 whitespace-pre-wrap text-sm">{article.content}</p>
                    {(article.images?.length || article.videos?.length) ? (
                      <div className="mt-3 grid md:grid-cols-2 gap-3">
                        {(article.images || []).slice((article.images || []).length > 1 ? 1 : 0, 3).map((url) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="rounded-sm border overflow-hidden block">
                            <img
                              src={url}
                              alt={article.title || t("article_image", "Article image")}
                              onError={(event) => {
                                event.currentTarget.src = manuscript;
                              }}
                              className="w-full h-40 object-cover"
                            />
                          </a>
                        ))}
                        {(article.videos || []).slice(0, 2).map((url) => (
                          <a key={url} href={url} target="_blank" rel="noreferrer" className="rounded-sm border p-3 inline-flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            {url}
                          </a>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs opacity-80">
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-[var(--gold)]/10">
                        {article.visibility === "public" ? (
                          <Globe className="w-3 h-3" />
                        ) : article.visibility === "community" ? (
                          <Users className="w-3 h-3" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                        {article.visibility || "public"}
                      </span>
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-sm bg-[var(--gold)]/10">
                        <MessageCircle className="w-3 h-3" />
                        {article.likes || 0} {t("likes", "likes")}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
