import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Heart,
  MessageCircle,
  Plus,
  Send,
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  Search,
  Filter,
  X,
  PlusCircle,
  Trash2,
  Edit,
} from "lucide-react";
import { api } from "../api/client";
import { getApiErrorMessage, getApiRoot } from "../api/helpers";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { useSiteContent } from "../hooks/useSiteContent";
import { PageHero, Section } from "../components/site/Primitives";
import SEO from "../components/SEO";
import ArticleModal from "../components/ArticleModal";
import manuscript from "../assets/family-archive.jpg";
import {
  ARTICLE_CATEGORIES,
  extractArticleList,
  normalizeArticle,
  type NormalizedArticle,
  type ArticleSource,
  SCIENTIFIC_GEDCOM_ARTICLES,
} from "../utils/articleNormalize";
import {
  recordAdminUpload,
  removeTrackedUpload,
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
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<NormalizedArticle | null>(null);

  // Quick Post Form
  const [showCreate, setShowCreate] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Sijillats & Notariats");
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSources, setNewSources] = useState<ArticleSource[]>([
    { title: "", cote: "", url: "", note: "" },
  ]);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  const resetForm = () => {
    setEditingArticleId(null);
    setNewTitle("");
    setNewCategory("Sijillats & Notariats");
    setNewContent("");
    setNewImageUrl("");
    setNewSources([{ title: "", cote: "", url: "", note: "" }]);
    setShowCreate(false);
    setPostError("");
  };

  const loadArticles = async () => {
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
        const norm = normalizeArticle(item, apiRoot, item.authorName || user?.fullName || "Karim Admin", manuscript);
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
    } catch {
      setArticles(SCIENTIFIC_GEDCOM_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [apiRoot]);

  // Sources in form
  const addSourceRow = () => {
    setNewSources([...newSources, { title: "", cote: "", url: "", note: "" }]);
  };

  const updateSourceRow = (index: number, field: keyof ArticleSource, value: string) => {
    const updated = [...newSources];
    updated[index] = { ...updated[index], [field]: value };
    setNewSources(updated);
  };

  const removeSourceRow = (index: number) => {
    if (newSources.length <= 1) {
      setNewSources([{ title: "", cote: "", url: "", note: "" }]);
      return;
    }
    setNewSources(newSources.filter((_, i) => i !== index));
  };

  const canManage = (article: NormalizedArticle) => {
    if (!user) return false;
    const uid = String(user.id);
    const authorId = String(article.userId || "");
    const userRole = Number(user.role);
    const isAdmin = userRole === 1 || userRole === 3;
    if (isAdmin) return true;
    if (authorId && authorId !== "user" && authorId === uid) return true;
    if (user.fullName && article.userName && user.fullName.trim().toLowerCase() === article.userName.trim().toLowerCase()) return true;
    return false;
  };

  const handleEdit = (article: NormalizedArticle) => {
    setEditingArticleId(article.id);
    setNewTitle(article.title);
    setNewCategory(article.category || "Sijillats & Notariats");
    setNewContent(article.content);
    setNewImageUrl(article.images?.[0] || "");
    setNewSources(article.sources && article.sources.length > 0 ? article.sources : [{ title: "", cote: "", url: "", note: "" }]);
    setShowCreate(true);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
    if (!confirmed) return;
    try {
      try {
        await api.delete(`/articles/${id}`);
      } catch {
        try {
          await api.delete(`/my/articles/${id}`);
        } catch {
          await api.delete(`/admin/articles/${id}`);
        }
      }
    } catch (e) {
      console.warn("Delete article error:", e);
    }
    removeTrackedUpload("articles", id);
    setArticles((prev) => prev.filter((p) => String(p.id) !== String(id)));
    if (selectedArticle && String(selectedArticle.id) === String(id)) {
      setSelectedArticle(null);
    }
  };

  const handleCreate = async () => {
    if (!newContent.trim() && !newTitle.trim()) return;
    setPostError("");

    const validSources = newSources.filter((s) => s.title.trim().length > 0);
    const title = newTitle.trim() || newContent.trim().slice(0, 80);
    const payload = {
      title,
      category: newCategory.trim() || "Archives & Notariats",
      content: newContent.trim(),
      images: newImageUrl.trim() ? [newImageUrl.trim()] : [],
      videos: [],
      sources: validSources,
      visibility: "public",
      is_public: true,
    };

    setPosting(true);
    try {
      if (editingArticleId) {
        // UPDATE existing article
        try {
          await api.put(`/articles/${editingArticleId}`, payload);
        } catch {
          try {
            await api.put(`/my/articles/${editingArticleId}`, payload);
          } catch {
            await api.put(`/admin/articles/${editingArticleId}`, payload);
          }
        }
        setArticles((prev) =>
          prev.map((p) =>
            String(p.id) === String(editingArticleId)
              ? {
                  ...p,
                  title,
                  category: payload.category,
                  content: payload.content,
                  images: payload.images,
                  sources: validSources,
                }
              : p
          )
        );
        resetForm();
        await loadArticles();
      } else {
        // CREATE new article
        let createdArticle: any = null;
        try {
          const { data } = await api.post("/articles", payload);
          createdArticle = data?.data || data;
        } catch {
          try {
            const { data } = await api.post("/my/articles", payload);
            createdArticle = data?.data || data;
          } catch {
            const localId = `local_article_${Date.now()}`;
            createdArticle = {
              id: localId,
              ...payload,
              authorName: user?.fullName || "Karim Admin",
              createdAt: new Date().toISOString(),
              likes: 0,
              comments: [],
            };
            recordAdminUpload("articles", createdArticle);
          }
        }
        resetForm();
        await loadArticles();
      }
    } catch (err) {
      setPostError(getApiErrorMessage(err, "Impossible de sauvegarder l'article."));
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = async (id: number | string) => {
    const key = `gallery_article_${id}`;
    const result = toggleSocialLike(key, 0);

    setArticles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            likes: result.count,
            isLiked: result.isLiked,
          };
        }
        return p;
      })
    );

    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle({
        ...selectedArticle,
        likes: result.count,
        isLiked: result.isLiked,
      });
    }

    try {
      await api.post(`/articles/${id}/like`);
    } catch {
      // offline like supported
    }
  };

  const handleAddComment = async (id: number | string, text: string) => {
    const key = `gallery_article_${id}`;
    const authorName = user?.fullName || "Chercheur invité";
    await addSocialComment(key, text, authorName);

    const newComment = {
      id: Date.now(),
      userId: String(user?.id || "guest"),
      userName: authorName,
      text,
      createdAt: new Date().toISOString(),
    };

    setArticles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );

    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle({
        ...selectedArticle,
        comments: [...(selectedArticle.comments || []), newComment],
      });
    }
  };

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = categoryFilter === "all" || a.category.toLowerCase().includes(categoryFilter.toLowerCase());
      if (!matchCat) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const sourcesText = (a.sources || []).map((s) => `${s.title} ${s.cote || ""} ${s.note || ""}`).join(" ");
      return (
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.userName.toLowerCase().includes(q) ||
        sourcesText.toLowerCase().includes(q)
      );
    });
  }, [articles, categoryFilter, search]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("articles_seo_title", "Articles & Études Généalogiques — Roots Tunisia")}
        description={t(
          "articles_seo_desc",
          "Consultez les articles et méthodologies de recherche généalogique en Tunisie : Majba, justice charaïque, notariats et archives diplomatiques."
        )}
      />

      <PageHero
        eyebrow={t("nav_articles", "Articles & Études d'Archives")}
        title={t("articles_hero_title", "Articles & Découvertes Généalogiques")}
        subtitle={t(
          "articles_hero_subtitle",
          "Analyses paléographiques, dépouillements des sijillats et méthodologies de recherche pour les familles de Tunisie."
        )}
        image={manuscript}
      >
        <Link to="/sources" className="btn-base btn-gold w-full sm:w-auto min-w-[180px]">
          {t("nav_sources_and_archives", "Sources & Archives")}
        </Link>
        <Link to="/gallery/trees" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[180px]">
          {t("nav_family_trees", "Arbres Familles")}
        </Link>
      </PageHero>

      <Section>
        {/* Controls Bar */}
        <div className="surface-card frame-gold p-4 sm:p-6 rounded-xl bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-[var(--gold)] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article, une cote d'archive, un cadi ou un patronyme..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] ps-10 pe-9 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(!showCreate)}
            className="btn-base btn-gold text-xs py-2.5 px-5 flex items-center justify-center gap-2 font-bold shrink-0 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showCreate ? "Fermer le formulaire" : "Publier un Article"}</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-thin">
          <Filter className="w-4 h-4 text-[var(--gold)] shrink-0 me-1" />
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-serif whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === "all"
                ? "bg-[var(--gold)] text-[#1f160f] font-bold shadow-sm"
                : "bg-[var(--card)] text-[var(--foreground)]/80 hover:bg-[var(--gold)]/15 border border-[var(--border)]"
            }`}
          >
            Tous ({articles.length})
          </button>
          {ARTICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.fallback)}
              className={`px-3 py-1.5 rounded-full text-xs font-serif whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat.fallback
                  ? "bg-[var(--gold)] text-[#1f160f] font-bold shadow-sm"
                  : "bg-[var(--card)] text-[var(--foreground)]/80 hover:bg-[var(--gold)]/15 border border-[var(--border)]"
              }`}
            >
              {cat.fallback}
            </button>
          ))}
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="surface-card frame-gold mt-6 p-6 sm:p-8 rounded-2xl bg-[var(--card)] shadow-xl border-2 border-[var(--gold)]/60 space-y-5 animate-in fade-in duration-200 text-start">
            <div className="flex items-center justify-between border-b border-[var(--gold)]/30 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--gold)]" />
                <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                  {editingArticleId ? "Modifier l'Article Historique & Généalogique" : "Rédiger et Publier un Article avec Sources d'Archives"}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 cursor-pointer"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
                {postError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                    Titre de l&apos;Article *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Les registres notariés des cadis de Kairouan au XIXe siècle..."
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                    Thématique / Catégorie
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  >
                    <option value="Sijillats & Notariats">Sijillats & Notariats</option>
                    <option value="État Civil & Décrets">État Civil & Décrets</option>
                    <option value="Habous & Waqf">Habous & Waqf</option>
                    <option value="Lignées & Nasab">Lignées & Nasab</option>
                    <option value="Monographies Régionales">Monographies Régionales</option>
                    <option value="Archives Photographiques">Archives Photographiques</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  Corps de l&apos;Article & Analyse Historique *
                </label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Rédigez votre étude, vos transcriptions d'actes ou votre analyse documentaire..."
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-serif leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                  Image Principale / Scan d&apos;Archive (Optionnel URL)
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://... ou /assets/family-archive.jpg"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              {/* ATTACHED SOURCES */}
              <div className="p-4 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)]/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--gold)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                      Sources & Documents d&apos;Archives Rattachés
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addSourceRow}
                    className="text-xs font-bold text-[var(--gold)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ajouter une source</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {newSources.map((source, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={source.title}
                          onChange={(e) => updateSourceRow(index, "title", e.target.value)}
                          placeholder="Institution / Dépôt (ex: Archives Nationales)"
                          className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={source.cote || ""}
                          onChange={(e) => updateSourceRow(index, "cote", e.target.value)}
                          placeholder="Cote d'archive (ex: Série Majba n°12)"
                          className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={source.url || ""}
                          onChange={(e) => updateSourceRow(index, "url", e.target.value)}
                          placeholder="Lien web (ex: http://www.archives.nat.tn)"
                          className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeSourceRow(index)}
                          className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <span className="text-xs text-[var(--muted-foreground)]">
                Publié sous le label institutionnel vérifié.
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={posting || (!newTitle.trim() && !newContent.trim())}
                  className="btn-base btn-gold text-xs py-2 px-6 flex items-center gap-2 font-bold cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{posting ? "Enregistrement..." : editingArticleId ? "Enregistrer les Modifications" : "Publier l'Article"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ARTICLES GRID */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="surface-card frame-gold p-12 text-center rounded-xl space-y-4 max-w-xl mx-auto my-8">
            <BookOpen className="w-12 h-12 text-[var(--gold)] mx-auto opacity-70" />
            <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">
              Aucun article trouvé
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              Aucun article ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map((article) => (
              <article
                key={article.id}
                className="surface-card frame-gold p-6 rounded-lg shadow-md space-y-4 flex h-full flex-col justify-between hover:-translate-y-1 transition-all text-start"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 font-bold">
                      {article.category || "Archives & Notariats"}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--muted-foreground)] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--gold)]" />
                      <span>{article.readingTime || "5 min"}</span>
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedArticle(article)}
                    className="text-lg sm:text-xl font-display font-bold text-[var(--foreground)] leading-snug cursor-pointer hover:text-[var(--gold)] transition-colors"
                    title="Cliquer pour lire l'article complet et ses sources"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                    {article.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--background)] p-3 rounded-md border border-[var(--border)]">
                    <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                      <FileText className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                      <span><strong>Sources:</strong> {article.sources?.length || 0} doc{(article.sources?.length || 0) > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                      <Clock className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                      <span><strong>Lecture:</strong> {article.readingTime || "5 min"}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedArticle(article)}
                      className="btn-base btn-gold flex-1 text-xs py-2 flex items-center justify-center gap-2 cursor-pointer font-bold"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>LIRE L&apos;ARTICLE</span>
                    </button>

                    {canManage(article) && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(article)}
                          className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer text-amber-500 border-amber-500/40 hover:bg-amber-500/10"
                          title="Modifier mon article"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(article.id)}
                          className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer text-rose-500 border-rose-500/40 hover:bg-rose-500/10"
                          title="Supprimer mon article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => toggleLike(article.id)}
                      className={`btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                        article.isLiked ? "border-rose-500/50 bg-rose-500/10 text-rose-500" : ""
                      }`}
                      title="Aimer cet article"
                    >
                      <Heart className={`w-3.5 h-3.5 ${article.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"}`} />
                      <span className={`text-[0.65rem] font-bold ${article.isLiked ? "text-rose-500" : ""}`}>
                        {article.likes || 0}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedArticle(article)}
                      className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer"
                      title="Commentaires"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[var(--gold)]" />
                      {article.comments && article.comments.length > 0 && (
                        <span className="text-[0.65rem] font-bold text-[var(--gold)]">
                          {article.comments.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onLike={toggleLike}
          onAddComment={handleAddComment}
          isAuthor={canManage(selectedArticle)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
