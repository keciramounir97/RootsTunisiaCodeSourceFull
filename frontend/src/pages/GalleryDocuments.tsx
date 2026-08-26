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
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import RootsPageShell from "../components/RootsPageShell";
import manuscriptImage from "../assets/manuscript.jpg";

interface DocumentItem {
  id: number | string;
  title: string;
  type: string;
  governorate?: string;
  dateStr?: string;
  archiveFonds?: string;
  summary: string;
  documentUrl?: string;
  previewImage?: string;
}

const TUNISIAN_INITIAL_DOCS: DocumentItem[] = [
  {
    id: "doc-tn-1",
    title: "Beylical Sijill Decrees — Tunis Medina (1852)",
    type: "Beylical Decree",
    governorate: "Tunis",
    dateStr: "1268 AH / 1852 AD",
    archiveFonds: "Archives Nationales de Tunisie (Fonds Sadiki / Beylical)",
    summary: "Royal decree bearing the seal of Ahmed I Bey granting waqf exemptions and naming lineage leaders in Tunis Medina.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-2",
    title: "Habous Land Deed — Olive Groves of Sfax & Mahdia",
    type: "Habous & Property",
    governorate: "Sfax / Mahdia",
    dateStr: "1874 AD",
    archiveFonds: "Registres Charaïques de Sfax",
    summary: "Endowment deed detailing family inheritance, olive grove boundaries (ghaba), and patron lineage names in coastal Tunisia.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-3",
    title: "Etat Civil Civil Extract — Protectorate Register (1894)",
    type: "Etat Civil",
    governorate: "Bizerte",
    dateStr: "1894 AD",
    archiveFonds: "Archives du Protectorat & ANOM",
    summary: "Civil registry extract recording birth, parent names, occupation, and residence in Bizerte under late 19th century registers.",
    previewImage: manuscriptImage,
  },
  {
    id: "doc-tn-4",
    title: "Kairouan Waqf Charter for Al-Zaytuna Scholars",
    type: "Waqf & Education",
    governorate: "Kairouan",
    dateStr: "1782 AD",
    archiveFonds: "Bibliothèque Nationale de Tunisie",
    summary: "Scholar waqf certificate establishing family lineage ties and scholarship stipends for Kairouani scholars studying in Zaytuna.",
    previewImage: manuscriptImage,
  },
];

export default function GalleryDocuments() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/documents");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (items.length > 0) {
          setDocuments(items);
        } else {
          setDocuments(TUNISIAN_INITIAL_DOCS);
        }
      } catch {
        setDocuments(TUNISIAN_INITIAL_DOCS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const documentTypes = ["All", "Beylical Decree", "Habous & Property", "Etat Civil", "Waqf & Education"];

  const filteredDocs = useMemo(() => {
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
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)]">
            {t("nav_documents", "Roots Tunisia Legal & Archival Records")}
          </p>
          <h1 className="display-xl text-[var(--foreground)] font-serif">
            {t("gallery_docs_title", "Historical Documents & Civil Extracts")}
          </h1>
          <p className="max-w-3xl mx-auto text-base opacity-90 text-[var(--muted-foreground)]">
            {t(
              "gallery_docs_desc",
              "Search digitized Beylical sijillat, habous property deeds, Ottoman decrees, and Protectorate civil extracts from the Archives Nationales de Tunisie.",
            )}
          </p>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-2.5" />
            <input
              type="text"
              placeholder={t("search_docs_placeholder", "Search document title, region, or summary…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-1.5 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
            {documentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  typeFilter === type
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="surface-card frame-gold p-5 rounded-lg shadow-md space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-sm text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                      {doc.type}
                    </span>
                    <span className="text-[0.65rem] font-mono text-[var(--muted-foreground)] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--primary)]" />
                      {doc.governorate}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[var(--foreground)] leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-[0.65rem] text-[var(--muted-foreground)] font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[var(--gold)]" />
                      {doc.dateStr || "Historical Era"}
                    </span>
                    <span className="truncate max-w-[200px]">{doc.archiveFonds}</span>
                  </div>

                  <button
                    onClick={() => setActiveDoc(doc)}
                    className="w-full btn-base btn-gold text-xs py-1.5 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t("view_document", "Inspect Document Details")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inspection Modal */}
        {activeDoc && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="surface-card frame-gold p-6 rounded-lg max-w-xl w-full space-y-4 bg-[var(--card)] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase text-[var(--gold)]">{activeDoc.type}</span>
                  <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">{activeDoc.title}</h3>
                </div>
                <button onClick={() => setActiveDoc(null)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-hidden rounded-md border border-[var(--border)] max-h-60">
                <img src={activeDoc.previewImage || manuscriptImage} alt={activeDoc.title} className="w-full object-cover" />
              </div>

              <div className="space-y-2 text-xs text-[var(--foreground)]">
                <h4 className="font-bold text-sm text-[var(--gold)]">Document Summary</h4>
                <p className="leading-relaxed">{activeDoc.summary}</p>
                <div className="p-3 rounded-sm bg-[var(--background)] border border-[var(--border)] font-mono text-[0.7rem] space-y-1">
                  <div><strong>Governorate:</strong> {activeDoc.governorate}</div>
                  <div><strong>Date / Period:</strong> {activeDoc.dateStr}</div>
                  <div><strong>Archival Fonds:</strong> {activeDoc.archiveFonds}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => setActiveDoc(null)}
                  className="btn-base btn-outline-ink text-xs px-4 py-2 cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="/my-download-requests"
                  className="btn-base btn-gold text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Request Full Copy</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </RootsPageShell>
  );
}
