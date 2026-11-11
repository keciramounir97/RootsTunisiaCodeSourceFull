import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FileText,
  Search,
  Download,
  Eye,
  Filter,
  X,
  Building,
  Calendar,
  Shield,
  FileCode,
  MapPin,
  ExternalLink,
  BookOpen,
  Heart,
  MessageSquare,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import RootsPageShell from "../components/RootsPageShell";
import GalleryCommentsModal from "../components/GalleryCommentsModal";
import { useAuth } from "../admin/components/AuthContext";
import {
  getSocialLikes,
  toggleSocialLike,
  getTrackedUploads,
  resolveAnyMediaUrl,
} from "../utils/gallerySocial";
import manuscriptImage from "../assets/family-archive.jpg";

interface DocumentItem {
  id: number | string;
  titleKey?: string;
  title: string;
  type: string;
  typeKey?: string;
  governorate?: string;
  dateStr?: string;
  archiveFondsKey?: string;
  archiveFonds?: string;
  summaryKey?: string;
  summary: string;
  documentUrl?: string;
  previewImage?: string;
  likes?: number;
  isLiked?: boolean;
}

export default function GalleryDocuments() {
  const { theme } = useTheme();
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();
  const { user } = useAuth();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [commentTarget, setCommentTarget] = useState<{
    mediaKey: string;
    title: string;
    subtitle?: string;
    likes: number;
  } | null>(null);

  const loadAllDocuments = async () => {
    try {
      setLoading(true);
      let items: any[] = [];
      try {
        const { data } = await api.get("/documents");
        items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      } catch {
        // fallback
      }

      const formatted = items.map((d: any) => {
        const key = `gallery_doc_${d.id}`;
        const social = getSocialLikes(key, 0);
        return {
          id: d.id,
          title: d.title || "Archival Document",
          type: d.type || "Historical Deed",
          governorate: d.governorate || "Tunisia",
          dateStr: d.date || d.dateStr || "19th Century",
          archiveFonds: d.archive_fonds || d.archiveFonds || "Archives Nationales de Tunisie",
          summary: d.summary || d.description || "",
          previewImage: resolveAnyMediaUrl(d.file_path || d.filePath || d.preview_image || d.previewImage, undefined, manuscriptImage),
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      const tracked = getTrackedUploads("documents").map((d: any) => {
        const key = `gallery_doc_${d.id}`;
        const social = getSocialLikes(key, 0);
        return {
          id: d.id,
          title: d.title || "Uploaded Document",
          type: d.type || "Historical Deed",
          governorate: d.governorate || "Tunisia",
          dateStr: d.dateStr || d.date || "Archived",
          archiveFonds: d.archiveFonds || "National Archives",
          summary: d.summary || "",
          previewImage: resolveAnyMediaUrl(d.file_path || d.filePath || d.preview_image, undefined, manuscriptImage),
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      setDocuments([...tracked, ...formatted]);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    loadAllDocuments();

    const handleUploadsChanged = (e: any) => {
      if (!e.detail || e.detail.kind === "documents") {
        loadAllDocuments();
      }
    };
    window.addEventListener("roots:uploads-changed", handleUploadsChanged);
    return () => window.removeEventListener("roots:uploads-changed", handleUploadsChanged);
  }, []);

  const toggleDocLike = async (id: number | string) => {
    if (!user) {
      alert(t("legacy.login_to_like", "Vous devez être connecté avec un compte pour aimer un document d'archives."));
      return;
    }
    const key = `gallery_doc_${id}`;
    const target = documents.find((d) => d.id === id);
    const result = await toggleSocialLike(key, target?.likes || 0, undefined, "document", Number(id) || undefined);
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isLiked: result.isLiked, likes: result.count } : d))
    );
  };

  const typeOptions = [
    { key: "All", labelKey: "cat_all" },
    { key: "Beylical Decree", labelKey: "doc_beylical_decree" },
    { key: "Habous & Property", labelKey: "doc_habous_property" },
    { key: "Etat Civil", labelKey: "doc_etat_civil" },
    { key: "Waqf & Education", labelKey: "doc_waqf_education" },
  ];

  const filteredDocuments = useMemo(() => {
    return documents.filter((item) => {
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.governorate && item.governorate.toLowerCase().includes(query.toLowerCase())) ||
        item.summary.toLowerCase().includes(query.toLowerCase());
      const matchType = typeFilter === "All" || item.type === typeFilter;
      return matchQuery && matchType;
    });
  }, [documents, query, typeFilter]);

  return (
    <RootsPageShell
      heroBackgroundUrl={getImage("documents", "hero", "image")}
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">
            {getText("documents", "hero", "eyebrow") ?? t("nav_documents")}
          </p>
          <h1 className="display-xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
            {getText("documents", "hero", "title") ?? t("doc_inspector_title")}
          </h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="max-w-3xl mx-auto text-base text-slate-100/95 font-medium drop-shadow-md">
            {getText("documents", "hero", "subtitle") ??
              t(
                "documents_desc",
                "Explore high-resolution digitized extracts of Beylical decrees, Sijillat Charaïques, Habous deeds, and municipal civil status records.",
              )}
          </p>
        </div>
      }
    >
      <div className="w-full space-y-8">
        {/* Search & Filter Bar */}
        <div className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("search_docs_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-thin">
            <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
            {typeOptions.map((tOpt) => (
              <button
                key={tOpt.key}
                type="button"
                onClick={() => setTypeFilter(tOpt.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  typeFilter === tOpt.key
                    ? "bg-[var(--gold)] text-[#1f160f] shadow-sm font-bold"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                {t(tOpt.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="surface-card frame-gold p-12 text-center rounded-lg space-y-4 max-w-xl mx-auto my-8">
            <FileText className="w-12 h-12 text-[var(--gold)] mx-auto opacity-80" />
            <h3 className="text-xl font-display font-bold text-[var(--foreground)]">
              {t("no_records_found")}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("search_docs_placeholder")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
            {filteredDocuments.map((doc) => (
              <article
                key={doc.id}
                className="surface-card frame-gold p-6 sm:p-7 rounded-lg shadow-md flex h-full flex-col justify-between space-y-4 hover:-translate-y-1 transition-all text-start"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--gold)]/20 pb-3">
                    <span className="px-2.5 py-0.5 rounded-sm text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                      {doc.typeKey ? t(doc.typeKey) : doc.type}
                    </span>
                    <span className="text-[0.68rem] font-mono text-[var(--muted-foreground)] font-bold">
                      {doc.dateStr}
                    </span>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 rounded-md overflow-hidden border border-[var(--gold)]/30 shrink-0 bg-black/30">
                      <img
                        src={doc.previewImage || manuscriptImage}
                        alt={doc.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base sm:text-lg text-[var(--foreground)] leading-snug">
                        {doc.title}
                      </h3>
                      {doc.governorate && (
                        <p className="text-xs text-[var(--gold)] font-semibold flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{doc.governorate}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between text-[0.68rem] text-[var(--muted-foreground)] font-mono">
                    <span className="truncate max-w-[260px]">{doc.archiveFonds}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveDoc(doc)}
                      className="btn-base btn-gold flex-1 text-xs py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t("preview_extract")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDocLike(doc.id)}
                      className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer"
                      title={t("like", "Like")}
                    >
                      <Heart className={`w-3.5 h-3.5 ${doc.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"}`} />
                      <span className="text-[0.65rem]">{doc.likes || 0}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCommentTarget({
                          mediaKey: `gallery_doc_${doc.id}`,
                          title: doc.title,
                          subtitle: `${doc.type} • ${doc.governorate}`,
                          likes: doc.likes || 0,
                        })
                      }
                      className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center cursor-pointer"
                      title={t("comments", "Comments")}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[var(--gold)]" />
                    </button>
                    <a
                      href="http://www.archives.nat.tn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center cursor-pointer"
                      title={t("official_portal_link")}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[var(--gold)]" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Document Inspector Modal */}
      {activeDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-xl bg-[var(--card)] shadow-2xl text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setActiveDoc(null)}
              className="absolute top-4 end-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--gold)]/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--gold)]/25 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                  {activeDoc.typeKey ? t(activeDoc.typeKey) : activeDoc.type}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {activeDoc.title}
                </h3>
                <p className="text-xs text-[var(--gold)] font-bold mt-0.5">
                  {activeDoc.dateStr} • {activeDoc.governorate}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="h-64 sm:h-80 w-full rounded-lg overflow-hidden border border-[var(--gold)]/30 bg-black/40">
                <img
                  src={activeDoc.previewImage || manuscriptImage}
                  alt={activeDoc.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="text-[0.68rem] font-bold uppercase text-[var(--gold)] mb-1">
                  {t("doc_diplomatic_transcript")}
                </p>
                <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                  {activeDoc.summary}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="text-[0.68rem] font-bold uppercase text-[var(--gold)] mb-1">
                  {t("doc_fonds_label")}
                </p>
                <p className="text-xs font-mono text-[var(--muted-foreground)]">
                  {activeDoc.archiveFonds}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleDocLike(activeDoc.id)}
                  className="btn-base btn-outline text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className={`h-4 w-4 ${activeDoc.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"}`} />
                  <span>{activeDoc.likes || 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCommentTarget({
                      mediaKey: `gallery_doc_${activeDoc.id}`,
                      title: activeDoc.title,
                      subtitle: `${activeDoc.type} • ${activeDoc.governorate}`,
                      likes: activeDoc.likes || 0,
                    })
                  }
                  className="btn-base btn-gold text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{t("comments", "Comments")}</span>
                </button>
                <a
                  href="http://www.archives.nat.tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{t("official_portal_link")}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="btn-base btn-outline text-xs py-2 px-4"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {commentTarget && (
        <GalleryCommentsModal
          isOpen={Boolean(commentTarget)}
          onClose={() => setCommentTarget(null)}
          mediaKey={commentTarget.mediaKey}
          itemTitle={commentTarget.title}
          itemSubtitle={commentTarget.subtitle}
          defaultLikes={commentTarget.likes}
        />
      )}

      <SiteCustomBlocks pageId="documents" fallbackPageId="gallery_documents" />
    </RootsPageShell>
  );
}
