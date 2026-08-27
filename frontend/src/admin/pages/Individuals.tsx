/* eslint-disable react-hooks/set-state-in-effect */
// @ts-nocheck
const SOURCE_HOST_LABELS: Array<[string, string]> = [
  ["gallica.bnf.fr", "Gallica (BnF)"],
  ["familysearch.org", "FamilySearch"],
  ["geneanet.org", "Geneanet"],
  ["ancestry.", "Ancestry"],
  ["archives.gov", "National Archives (US)"],
  ["archive.org", "Internet Archive"],
  ["nationalarchives.gov.uk", "National Archives (UK)"],
  ["archives.nat.tn", "National Archives of Maghreb"],
];

export function isDomainOrHostString(str: string): boolean {
  if (!str) return true;
  const s = String(str).trim().toLowerCase();
  if (
    s.includes("api.roots") ||
    s.includes("rootstunisia") ||
    s === "localhost" ||
    s.startsWith("localhost:") ||
    s.startsWith("http://") ||
    s.startsWith("https://")
  ) {
    return true;
  }
  if (/\.(pdf|docx?|txt|png|jpe?g|gif|webp|mp3|wav|ogg|m4a|ged|gedx|json|xml)$/i.test(s)) {
    return false;
  }
  if (/^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?$/i.test(s)) {
    return true;
  }
  return false;
}

export function sanitizeLinkLabel(
  titleHint: string | undefined,
  urlStr: string | undefined,
  kind: string = "document"
): string {
  const cleanTitle = (titleHint || "").trim();
  if (cleanTitle && !isDomainOrHostString(cleanTitle)) {
    return cleanTitle;
  }

  if (urlStr) {
    let cleanUrl = String(urlStr).trim().split("?")[0].split("#")[0].replace(/\/+$/, "");
    try {
      cleanUrl = decodeURIComponent(cleanUrl);
    } catch {}

    if (/^https?:\/\//i.test(cleanUrl)) {
      try {
        const host = new URL(cleanUrl).hostname.replace(/^www\./, "").toLowerCase();
        const known = SOURCE_HOST_LABELS.find(([h]) => host.includes(h));
        if (known) return known[1];
      } catch {}
    }

    const lastSegment = cleanUrl.split("/").pop() || "";
    if (lastSegment && !isDomainOrHostString(lastSegment) && /\.[a-z0-9]+$/i.test(lastSegment)) {
      return lastSegment;
    }
  }

  if (kind === "image" || kind === "photo" || kind === "gallery") return "Photo";
  if (kind === "audio") return "Audio";
  if (kind === "document") return "Document";
  return "External Link";
}
/* eslint-disable react-hooks/set-state-in-effect */
// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  UserRound,
  Plus,
  Upload,
  Pencil,
  Trash2,
  Link2,
  FileText,
  Image as ImageIcon,
  Download,
  Music,
  BookOpen,
  Search,
  X,
  ChevronDown,
  FileCode2,
  Calendar,
  MapPin,
  Briefcase,
  Layers,
  ExternalLink,
  ShieldCheck,
  Globe,
  Lock,
} from "lucide-react";

import { useThemeStore } from "../../store/theme";
import { useLanguage as useTranslation } from "../../i18n";
import { api } from "../../api/client";
import { getApiRoot, requestWithFallback, shouldFallbackRoute } from "../../api/helpers";
import {
  parseGedcom,
  MEDIA_LINK_TYPES,
  DEFAULT_FALLBACK_MEDIA,
  normalizeExistingMediaResponse,
} from "../components/TreesBuilder";

export function parseIndividualPersonLinks(person: any) {
  if (!person || typeof person !== "object") return [];
  const links: Array<{ url: string; label: string; kind: string; raw: string }> = [];
  const seen = new Set<string>();

  const fields: string[] = [];
  if (Array.isArray(person.sourceLinks)) fields.push(...person.sourceLinks);
  else if (typeof person.sourceLinks === "string") {
    try {
      const parsed = JSON.parse(person.sourceLinks);
      if (Array.isArray(parsed)) fields.push(...parsed);
      else if (person.sourceLinks.trim()) fields.push(person.sourceLinks.trim());
    } catch {
      if (person.sourceLinks.trim()) fields.push(person.sourceLinks.trim());
    }
  }

  if (!person.sourceLinksManaged) {
    for (const f of [person.archiveSource, person.documentCode, person.details]) {
      if (f && typeof f === "string" && !fields.includes(f)) fields.push(f);
    }
  }

  const apiBase = String(getApiRoot() || "").replace(/\/+$/, "").replace(/\/api$/, "");

  for (const field of fields) {
    const text = String(field || "").trim();
    if (!text) continue;

    let title = "";
    let target = text;
    if (text.includes(" | ")) {
      const parts = text.split(" | ");
      title = parts[0].trim();
      target = parts.slice(1).join(" | ").trim();
    }
    target = target.replace(/[).,;]+$/, "");
    if (!target) continue;

    let fullUrl = target;
    if (!/^https?:\/\//i.test(target)) {
      const pathname = target.startsWith("/") ? target : `/${target}`;
      fullUrl = `${apiBase}${pathname}`;
    }

    const lower = fullUrl.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);

    let kind = "external";
    if (/\.(pdf|docx?|txt)(?:[?#].*)?$/i.test(lower) || lower.includes("/uploads/documents/")) kind = "document";
    else if (/\.(mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(lower) || lower.includes("/uploads/audios/")) kind = "audio";
    else if (/\.(png|jpe?g|gif|webp)(?:[?#].*)?$/i.test(lower) || lower.includes("/uploads/gallery/")) kind = "image";

    let rawLabel = title || target.split("/").pop() || target;
    if (!title && isDomainOrHostString(rawLabel)) {
      rawLabel = kind === "image" ? "Photo" : kind === "audio" ? "Audio" : kind === "document" ? "Document" : "Link";
    }
    const label = rawLabel;
    links.push({ url: fullUrl, label, kind, raw: text });
  }

  return links;
}

const parseArrayField = (field: any) => {
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* ignore */
    }
  }
  return [];
};

const normalizeIndividualRecord = (item: any) => {
  if (!item || typeof item !== "object") return item;
  const customFields = parseArrayField(item.customFields).filter(
    (f: any) => f && typeof f === "object"
  );
  const sourceLinks = parseArrayField(item.sourceLinks)
    .map((s: any) => String(s || "").trim())
    .filter(Boolean);
  return {
    ...item,
    customFields,
    sourceLinks,
    sourceLinksManaged:
      item.sourceLinksManaged !== undefined ? Boolean(item.sourceLinksManaged) : true,
  };
};

const STORAGE_KEY = "roots_individuals_records_v1";

const uid = () => String(Date.now() + Math.floor(Math.random() * 10000));

const initialForm = () => ({
  id: null,
  name: "",
  gender: "",
  birthYear: "",
  birthPlace: "",
  deathDate: "",
  deathPlace: "",
  profession: "",
  details: "",
  customFields: [], // Array<{ id: string, name: string, value: string }>
  sourceLinks: [], // Array<string>
  gedcomText: "",
  sourceLinksManaged: true,
  isBackedUp: true,
  isPublic: true,
});

export default function Individuals() {
  const { theme } = useThemeStore();
  const { t, dir } = useTranslation();
  const isDark = theme === "dark";

  // Data State
  const [individuals, setIndividuals] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.map(normalizeIndividualRecord);
      }
    } catch {
      /* fallback */
    }
    return [];
  });

  const [query, setQuery] = useState("");
  const [selectedIndividual, setSelectedIndividual] = useState<any>(null);

  // Modal Creation State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<"choose" | "gedcom" | "form">("choose");
  const [formData, setFormData] = useState<any>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  // GEDCOM Import State
  const [gedcomText, setGedcomText] = useState("");
  const gedcomFileInputRef = useRef<HTMLInputElement | null>(null);
  const previewSurfaceRef = useRef<HTMLDivElement | null>(null);
  const [previewTilt, setPreviewTilt] = useState({ x: 0, y: 0, active: false });
  const currentGedcomText = String(gedcomText || formData.gedcomText || "").trim();

  // Media & External Link Attachment State
  const [mediaPanelOpen, setMediaPanelOpen] = useState(false);
  const [previewSource, setPreviewSource] = useState<{ url: string; label: string; kind: string } | null>(null);
  const [mediaLinkType, setMediaLinkType] = useState("document");
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [selectedMediaLink, setSelectedMediaLink] = useState("");

  const [externalPanelOpen, setExternalPanelOpen] = useState(false);
  const [externalTitle, setExternalTitle] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const previewRef = useRef<SVGSVGElement | null>(null);

  const syncGedcomText = useCallback((text: string) => {
    const next = String(text || "");
    setGedcomText(next);
    setFormData((prev: any) => ({ ...prev, gedcomText: next }));
  }, []);

  const handleGedcomFileImport = useCallback(
    async (file: File) => {
      const text = await file.text();
      syncGedcomText(text);
      setAddMode("gedcom");
    },
    [syncGedcomText]
  );

  const downloadGedcomText = useCallback((text: string, filename: string) => {
    const value = String(text || "").trim();
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }, []);

  const updatePreviewTilt = useCallback((event: any) => {
    if (!previewSurfaceRef.current) return;
    const rect = previewSurfaceRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
    setPreviewTilt({ x, y, active: true });
  }, []);

  const resetPreviewTilt = useCallback(() => {
    setPreviewTilt({ x: 0, y: 0, active: false });
  }, []);

  useEffect(() => {
    if (!selectedIndividual || !previewRef.current) return;
    const svg = d3.select(previewRef.current);
    svg.selectAll("*").remove();
    const accent = selectedIndividual.gender === "F" ? "#be185d" : "#0d9488";
    const surface = isDark ? "#0f1f33" : "#f8f5ef";
    const textColor = isDark ? "#f8f5ef" : "#162238";
    svg.attr("viewBox", "0 0 220 120");
    svg.append("rect").attr("x", 8).attr("y", 8).attr("width", 204).attr("height", 104).attr("rx", 18).attr("fill", surface).attr("stroke", accent).attr("stroke-width", 2);
    svg.append("circle").attr("cx", 34).attr("cy", 34).attr("r", 18).attr("fill", accent);
    svg.append("text").attr("x", 34).attr("y", 39).attr("text-anchor", "middle").attr("font-size", 16).attr("font-weight", 700).attr("fill", "#fff").text(String(selectedIndividual.name || "P").charAt(0).toUpperCase());
    svg.append("text").attr("x", 60).attr("y", 34).attr("font-size", 11).attr("font-weight", 700).attr("fill", accent).text(selectedIndividual.name || "Individual");
    svg.append("text").attr("x", 60).attr("y", 50).attr("font-size", 9).attr("fill", textColor).text(selectedIndividual.profession || "—");
    svg.append("text").attr("x", 20).attr("y", 82).attr("font-size", 9).attr("fill", textColor).text(`Birth: ${selectedIndividual.birthYear || "?"}`);
    svg.append("text").attr("x", 20).attr("y", 96).attr("font-size", 9).attr("fill", textColor).text(`Death: ${selectedIndividual.deathDate || "—"}`);
  }, [selectedIndividual, isDark]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(individuals));
    } catch {
      /* ignore */
    }
  }, [individuals]);

  // Filtered List
  const filteredIndividuals = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return individuals;
    return individuals.filter((ind) => {
      const full = `${ind?.name || ""} ${ind?.given || ""} ${ind?.surname || ""} ${ind?.profession || ""} ${ind?.birthPlace || ""}`.toLowerCase();
      const customStr = parseArrayField(ind?.customFields)
        .map((f: any) => `${f?.name || ""} ${f?.value || ""}`)
        .join(" ")
        .toLowerCase();
      return full.includes(q) || customStr.includes(q);
    });
  }, [individuals, query]);

  // Load Platform Uploaded Media
  const loadExistingMedia = useCallback(async (type = "document") => {
    const config = MEDIA_LINK_TYPES[type] || MEDIA_LINK_TYPES.document;
    setMediaLoading(true);
    try {
      const shouldFallbackMediaRead = (err: any) =>
        shouldFallbackRoute(err) ||
        err?.response?.status === 401 ||
        err?.response?.status === 403 ||
        err?.response?.status === 500 ||
        err?.code === "ERR_NETWORK" ||
        !err?.response ||
        err?.code === "AUTH_MISSING";
      const { data } = await requestWithFallback(
        config.endpoints.map((endpoint) => () => api.get(endpoint)),
        shouldFallbackMediaRead
      );
      const rawItems = normalizeExistingMediaResponse(data, type);
      setExistingMedia(rawItems);
      setSelectedMediaLink(rawItems[0]?.sourceUrl || "");
    } catch (err) {
      console.error("Failed to load existing media:", err);
      setExistingMedia([]);
      setSelectedMediaLink("");
    } finally {
      setMediaLoading(false);
    }
  }, []);

  const openMediaPanel = (type: string) => {
    setMediaLinkType(type);
    setMediaPanelOpen(true);
    setExternalPanelOpen(false);
    void loadExistingMedia(type);
  };

  const attachSelectedMedia = () => {
    if (!selectedMediaLink) return;
    setFormData((prev: any) => ({
      ...prev,
      sourceLinks: [...(prev.sourceLinks || []), selectedMediaLink],
    }));
    setSelectedMediaLink("");
  };

  const attachExternalLink = () => {
    const url = externalUrl.trim();
    const title = externalTitle.trim();
    if (!url) return;
    const finalLink = title ? `${title} | ${url}` : url;
    setFormData((prev: any) => ({
      ...prev,
      sourceLinks: [...(prev.sourceLinks || []), finalLink],
    }));
    setExternalUrl("");
    setExternalTitle("");
    setExternalPanelOpen(false);
  };

  const removeSourceLinkAt = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      sourceLinks: (prev.sourceLinks || []).filter((_: any, i: number) => i !== index),
    }));
  };

  // Custom Fields Handler
  const addCustomField = () => {
    setFormData((prev: any) => ({
      ...prev,
      customFields: [...(prev.customFields || []), { id: uid(), name: "", value: "" }],
    }));
  };

  const updateCustomField = (id: string, key: "name" | "value", val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      customFields: (prev.customFields || []).map((field: any) =>
        field.id === id ? { ...field, [key]: val } : field
      ),
    }));
  };

  const removeCustomField = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      customFields: (prev.customFields || []).filter((field: any) => field.id !== id),
    }));
  };

  // Fetch initial data from API with fallback
  useEffect(() => {
    let isMounted = true;
    const fetchIndividuals = async () => {
      try {
        const { data } = await requestWithFallback(
          [
            () => api.get("/admin/individuals"),
            () => api.get("/individuals"),
          ],
          shouldFallbackRoute
        );
        if (isMounted && Array.isArray(data)) {
          const normalized = data.map(normalizeIndividualRecord);
          setIndividuals(normalized);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch {}
        }
      } catch {
        /* keep local storage fallback */
      }
    };
    void fetchIndividuals();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save Individual Form with API & Local Fallback
  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    const payload = { ...formData, gedcomText: String(gedcomText || formData.gedcomText || "").trim() };
    const normalizeIndividual = (item: any) => ({
      ...item,
      sourceLinks: Array.isArray(item?.sourceLinks)
        ? item.sourceLinks
        : Array.isArray(payload.sourceLinks)
          ? payload.sourceLinks
          : [],
      sourceLinksManaged:
        item?.sourceLinksManaged !== undefined
          ? item.sourceLinksManaged
          : payload.sourceLinksManaged !== undefined
            ? payload.sourceLinksManaged
            : true,
    });

    try {
      if (editingId) {
        const { data } = await api.put(`/admin/individuals/${editingId}`, payload);
        if (data && data.id) {
          setIndividuals((prev) =>
            prev.map((item) => (item.id === editingId ? normalizeIndividual(data) : item))
          );
          if (selectedIndividual?.id === editingId) {
            setSelectedIndividual(normalizeIndividual(data));
          }
          closeModal();
          return;
        }
      } else {
        const { data } = await api.post("/admin/individuals", payload);
        if (data && data.id) {
          setIndividuals((prev) => [normalizeIndividual(data), ...prev]);
          closeModal();
          return;
        }
      }
    } catch {
      /* fallback to local storage update */
    }

    if (editingId) {
      setIndividuals((prev) =>
        prev.map((item) =>
          item.id === editingId ? normalizeIndividual({ ...payload, id: editingId }) : item
        )
      );
      if (selectedIndividual?.id === editingId) {
        setSelectedIndividual(normalizeIndividual({ ...payload, id: editingId }));
      }
    } else {
      const newInd = normalizeIndividual({ ...payload, id: uid() });
      setIndividuals((prev) => [newInd, ...prev]);
    }

    closeModal();
  };

  // GEDCOM File Import
  const handleGedcomTextImport = async () => {
    const text = String(gedcomText || "").trim();
    const parsed = parseGedcom(text);
    if (!Array.isArray(parsed) || parsed.length === 0) return;

    const imported = [];
    for (const p of parsed) {
      const payload = {
        name: p.name || `${p.given || ""} ${p.surname || ""}`.trim() || "Personne sans nom",
        given: p.given || "",
        surname: p.surname || "",
        gender: p.gender || "",
        birthYear: p.birthYear || "",
        birthPlace: p.birthPlace || "",
        deathDate: p.deathDate || "",
        deathPlace: p.deathPlace || "",
        profession: p.profession || "",
        details: p.details || "",
        customFields: Array.isArray(p.customFields) ? p.customFields : [],
        sourceLinks: Array.isArray(p.sourceLinks) ? p.sourceLinks : [],
        gedcomText: text,
        sourceLinksManaged: true,
        isBackedUp: true,
        isPublic: true,
      };
      try {
        const { data } = await api.post("/admin/individuals", payload);
        imported.push(data && data.id ? data : { ...payload, id: uid() });
      } catch {
        imported.push({ ...payload, id: uid() });
      }
    }

    if (imported.length) {
      setIndividuals((prev) => [...imported, ...prev]);
      setSelectedIndividual(imported[0] || null);
    }
    closeModal();
  };

  const cardAccent = (gender: string) => (gender === "F" ? "#be185d" : "#0d9488");
  const cardSurface = isDark ? "#0f1f33" : "#f8f5ef";

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm());
    setAddMode("choose");
    setGedcomText("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (individual: any) => {
    setSelectedIndividual(null);
    setEditingId(individual.id);
    const linksManaged = individual.sourceLinksManaged !== undefined ? individual.sourceLinksManaged : true;
    setFormData({
      ...initialForm(),
      ...individual,
      customFields: individual.customFields ? [...individual.customFields] : [],
      sourceLinks: linksManaged
        ? (individual.sourceLinks ? [...individual.sourceLinks] : [])
        : parseIndividualPersonLinks(individual).map(link => link.raw),
      sourceLinksManaged: linksManaged,
    });
    setGedcomText(individual.gedcomText || "");
    setAddMode("form");
    setIsAddModalOpen(true);
  };

  const deleteIndividual = async (id: string) => {
    try {
      await api.delete(`/admin/individuals/${id}`).catch(() => {});
    } catch {}
    setIndividuals((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    if (selectedIndividual?.id === id) {
      setSelectedIndividual(null);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setAddMode("choose");
    setFormData(initialForm());
    setEditingId(null);
    setGedcomText("");
    setMediaPanelOpen(false);
    setExternalPanelOpen(false);
  };

  const openSourceLink = (url: string, label: string = "", kind: string = "") => {
    const target = String(url || "").trim();
    if (!target) return;
    let fullUrl = target;
    if (!/^https?:\/\//i.test(target)) {
      const apiBase = getApiRoot().replace(/\/+$/, "").replace(/\/api$/, "");
      const pathname = target.startsWith("/") ? target : `/${target}`;
      fullUrl = `${apiBase}${pathname}`;
    }
    let detectedKind = kind;
    if (!detectedKind) {
      const lower = fullUrl.toLowerCase();
      if (/\.(pdf|docx?|txt)(?:[?#].*)?$/i.test(lower) || lower.includes("/uploads/documents/") || lower.includes("/uploads/books/")) detectedKind = "document";
      else if (/\.(mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(lower) || lower.includes("/uploads/audios/")) detectedKind = "audio";
      else if (/\.(png|jpe?g|gif|webp)$/i.test(lower) || lower.includes("/uploads/gallery/")) detectedKind = "image";
      else detectedKind = "external";
    }
    setPreviewSource({
      url: fullUrl,
      label: label || fullUrl.split("/").pop() || "Source",
      kind: detectedKind
    });
    resetPreviewTilt();
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-[#071827] text-white" : "bg-[#f5f1e8] text-[#162238]"}`}>
      <input
        ref={gedcomFileInputRef}
        type="file"
        accept=".ged,.gedcom"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file) void handleGedcomFileImport(file);
          e.target.value = "";
        }}
      />
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#0d9488]/20 mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold tracking-wide text-[#0c4a6e] dark:text-[#0d9488] flex items-center gap-3">
            <UserRound className="w-7 h-7 text-[#0d9488]" />
            {t("legacy.individuals_page_title", "Individus")}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {t("legacy.individuals_page_subtitle", "Gérer et explorer les individus et leurs documents rattachés")}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="interactive-btn btn-neu btn-neu--primary flex items-center gap-2 !px-5 !py-2.5 !text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t("legacy.add_person_btn", "Ajouter une personne")}</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0d9488] opacity-70" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("legacy.search_individuals_placeholder", "Rechercher par nom, métier, lieu, champ personnalisé...")}
            className="neu-field w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border focus:ring-2 focus:ring-[#0d9488]/40"
          />
        </div>
        <div className="text-xs font-serif italic text-stone-500 dark:text-stone-400">
          {filteredIndividuals.length} {t("legacy.records", "enregistrements")}
        </div>
      </div>

      {/* INDIVIDUALS GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredIndividuals.map((item) => {
          const links = parseIndividualPersonLinks(item);
          return (
            <div
              key={item.id}
              onClick={() => setSelectedIndividual(item)}
              className={`neu-card p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                isDark ? "bg-[#0f1f33] border-[#0d9488]/20 hover:border-[#0d9488]" : "bg-white border-[#e8e4dc] hover:border-[#0d9488]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 ${
                    item.gender === "F" ? "bg-rose-500" : "bg-[#0d9488]"
                  }`}
                >
                  {item.name ? item.name.charAt(0).toUpperCase() : "P"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-cinzel font-bold text-sm text-[#0c4a6e] dark:text-[#0d9488] truncate">
                    {item.name}
                  </h3>
                  {item.profession && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                      <Briefcase className="w-3 h-3 shrink-0 text-[#0d9488]" />
                      <span>{item.profession}</span>
                    </p>
                  )}
                  {(item.birthYear || item.birthPlace) && (
                    <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>
                        {item.birthYear} {item.birthPlace ? `- ${item.birthPlace}` : ""}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* BADGES & LINKS COUNT */}
              <div className="mt-3 pt-3 border-t border-[#0d9488]/15 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                  <Link2 className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span>{links.length} sources/médias</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.isBackedUp !== false && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5" title="Sauvegardé en BDD">
                      <ShieldCheck className="w-3 h-3" />
                      DB
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5 ${
                      item.isPublic !== false
                        ? "bg-[#0d9488]/15 text-[#0d9488]"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {item.isPublic !== false ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {item.isPublic !== false ? "Public" : "Privé"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIndividuals.length === 0 && (
        <div className="text-center py-16 neu-inset rounded-2xl">
          <UserRound className="w-12 h-12 mx-auto text-[#0d9488] opacity-40 mb-3" />
          <p className="font-serif italic text-sm text-stone-500 dark:text-stone-400">
            {t("legacy.no_individuals_found", "Aucun individu trouvé.")}
          </p>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`neu-card w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
            isDark ? "bg-[#0f1f33] border-[#0d9488]/30" : "bg-white border-[#e8e4dc]"
          }`}>
            {/* MODAL HEADER */}
            <div className="px-6 py-4 border-b border-[#0d9488]/20 flex items-center justify-between">
              <h2 className="font-cinzel text-lg font-bold text-[#0c4a6e] dark:text-[#0d9488]">
                {editingId
                  ? t("legacy.edit_person", "Modifier la personne")
                  : t("legacy.add_person_btn", "Ajouter une personne")}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-stone-400 hover:bg-[#0d9488]/15 hover:text-[#0d9488]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {addMode === "choose" && !editingId && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  {/* GEDCOM CHOICE */}
                  <div
                    onClick={() => {
                      setAddMode("gedcom");
                      setGedcomText("");
                    }}
                    className={`p-6 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all hover:scale-[1.02] ${
                      isDark ? "border-[#0d9488]/40 hover:border-[#0d9488] bg-[#071827]/50" : "border-[#0d9488]/30 hover:border-[#0d9488] bg-[#f5f1e8]/50"
                    }`}
                  >
                    <Upload className="w-10 h-10 mx-auto text-[#0d9488] mb-3" />
                    <h3 className="font-cinzel font-bold text-base text-[#0c4a6e] dark:text-[#0d9488]">
                      {t("legacy.import_gedcom_title", "Importer par GEDCOM")}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                      {t("legacy.import_gedcom_desc", "Importer un fichier, coller du texte GEDCOM, ou exporter le contenu enregistré.")}
                    </p>
                  </div>

                  {/* FORM CHOICE */}
                  <div
                    onClick={() => setAddMode("form")}
                    className={`p-6 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all hover:scale-[1.02] ${
                      isDark ? "border-[#0d9488]/40 hover:border-[#0d9488] bg-[#071827]/50" : "border-[#0d9488]/30 hover:border-[#0d9488] bg-[#f5f1e8]/50"
                    }`}
                  >
                    <FileText className="w-10 h-10 mx-auto text-[#0d9488] mb-3" />
                    <h3 className="font-cinzel font-bold text-base text-[#0c4a6e] dark:text-[#0d9488]">
                      {t("legacy.by_form_title", "Par Formulaire")}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                      {t("legacy.by_form_desc", "Saisir les informations d'une personne avec des champs personnalisés et des liaisons de documents.")}
                    </p>
                  </div>
                </div>
              )}

              {addMode === "gedcom" && !editingId && (
                <div className="space-y-4 py-4">
                  <div className={`rounded-xl border ${isDark ? "border-[#0d9488]/30 bg-[#071827]/60" : "border-[#d9a441]/20 bg-white" } p-4 space-y-4`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-cinzel font-bold text-sm text-[#0c4a6e] dark:text-[#0d9488]">
                          {t("legacy.import_gedcom_title", "Importer par GEDCOM")}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {t("legacy.import_gedcom_desc", "Choisissez un fichier, collez du GEDCOM, ou exportez le contenu actuel.")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAddMode("choose")}
                        className="interactive-btn btn-neu px-3 py-1.5 text-xs"
                      >
                        {t("back", "Retour")}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => gedcomFileInputRef.current?.click()}
                        className="neu-inset p-4 rounded-xl text-left hover:border-[#0d9488] transition-colors"
                      >
                        <Upload className="w-5 h-5 text-[#0d9488] mb-2" />
                        <div className="text-sm font-semibold">Importer un fichier</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">.ged, .gedcom</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("individual-gedcom-editor");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className="neu-inset p-4 rounded-xl text-left hover:border-[#0d9488] transition-colors"
                      >
                        <FileText className="w-5 h-5 text-[#0d9488] mb-2" />
                        <div className="text-sm font-semibold">Éditer / coller</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">Modifier le texte GEDCOM</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadGedcomText(currentGedcomText, `${(formData.name || "individual").replace(/\s+/g, "-").toLowerCase()}.ged`)}
                        disabled={!currentGedcomText}
                        className="neu-inset p-4 rounded-xl text-left hover:border-[#0d9488] transition-colors disabled:opacity-50"
                      >
                        <FileCode2 className="w-5 h-5 text-[#0d9488] mb-2" />
                        <div className="text-sm font-semibold">Exporter GEDCOM</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">Télécharger le fichier</div>
                      </button>
                    </div>
                    <textarea
                      id="individual-gedcom-editor"
                      value={gedcomText}
                      onChange={(e) => syncGedcomText(e.target.value)}
                      placeholder="0 @I1@ INDI&#10;1 NAME Ahmed /Ben Mohamed/&#10;1 SEX M&#10;1 BIRT&#10;2 DATE 1905"
                      className="neu-field w-full min-h-80 rounded-xl px-4 py-3 text-xs leading-6"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="interactive-btn btn-neu px-4 py-2 text-xs"
                    >
                      {t("cancel", "Annuler")}
                    </button>
                    <button
                      type="button"
                      onClick={handleGedcomTextImport}
                      disabled={!gedcomText.trim()}
                      className="interactive-btn btn-neu btn-neu--primary px-5 py-2 text-xs font-bold disabled:opacity-50"
                    >
                      {t("legacy.import_gedcom", "Importer par GEDCOM")}
                    </button>
                  </div>
                </div>
              )}

              {addMode === "form" && (
                <form onSubmit={saveForm} className="space-y-6">
                  {/* BASIC INFO */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#0c4a6e] dark:text-[#0d9488] border-b border-[#0d9488]/30 pb-1">
                      Informations Personnelles
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold mb-1 block">Nom complet *</label>
                        <input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((s: any) => ({ ...s, name: e.target.value }))}
                          placeholder="ex. Ahmed Ben Mohamed"
                          className="neu-field w-full px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold mb-1 block">Genre</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData((s: any) => ({ ...s, gender: e.target.value }))}
                          className="neu-field w-full px-3 py-2 text-xs"
                        >
                          <option value="">Sélectionner...</option>
                          <option value="M">Masculin</option>
                          <option value="F">Féminin</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold mb-1 block">Profession</label>
                        <input
                          value={formData.profession}
                          onChange={(e) => setFormData((s: any) => ({ ...s, profession: e.target.value }))}
                          placeholder="ex. Historien"
                          className="neu-field w-full px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold mb-1 block">Année de naissance</label>
                        <input
                          value={formData.birthYear}
                          onChange={(e) => setFormData((s: any) => ({ ...s, birthYear: e.target.value }))}
                          placeholder="ex. 1905"
                          className="neu-field w-full px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold mb-1 block">Lieu de naissance</label>
                        <input
                          value={formData.birthPlace}
                          onChange={(e) => setFormData((s: any) => ({ ...s, birthPlace: e.target.value }))}
                          placeholder="ex. Le Caire"
                          className="neu-field w-full px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold mb-1 block">Date/Année de décès</label>
                        <input
                          value={formData.deathDate}
                          onChange={(e) => setFormData((s: any) => ({ ...s, deathDate: e.target.value }))}
                          placeholder="ex. 1978"
                          className="neu-field w-full px-3 py-2 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold mb-1 block">Lieu de décès</label>
                        <input
                          value={formData.deathPlace}
                          onChange={(e) => setFormData((s: any) => ({ ...s, deathPlace: e.target.value }))}
                          placeholder="ex. Alexandrie"
                          className="neu-field w-full px-3 py-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GEDCOM block was removed from form mode so that when choosing add by form, the user gets only the form fields. */}

                  {/* DYNAMIC CUSTOM FIELDS */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-[#0d9488]/30 pb-1">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#0c4a6e] dark:text-[#0d9488]">
                        Champs personnalisés
                      </h4>
                      <button
                        type="button"
                        onClick={addCustomField}
                        className="interactive-btn btn-neu text-xs !px-3 !py-1 text-[#0d9488] font-semibold"
                      >
                        + Ajouter un champ
                      </button>
                    </div>

                    {parseArrayField(formData?.customFields).map((field: any) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <input
                          value={field.name}
                          onChange={(e) => updateCustomField(field.id, "name", e.target.value)}
                          placeholder="Nom du champ (ex. Tribu)"
                          className="neu-field w-1/3 px-3 py-2 text-xs"
                        />
                        <input
                          value={field.value}
                          onChange={(e) => updateCustomField(field.id, "value", e.target.value)}
                          placeholder="Valeur du champ"
                          className="neu-field flex-1 px-3 py-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomField(field.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* SOURCES & MEDIA LINKING */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-[#0d9488]/30 pb-1">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#0c4a6e] dark:text-[#0d9488]">
                        Documents et Liens de Source
                      </h4>
                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openMediaPanel("document")}
                          className="interactive-btn btn-neu text-[11px] !px-2.5 !py-1"
                        >
                          <FileText className="w-3.5 h-3.5 inline mr-1 text-[#0d9488]" />
                          Document
                        </button>
                        <button
                          type="button"
                          onClick={() => openMediaPanel("image")}
                          className="interactive-btn btn-neu text-[11px] !px-2.5 !py-1"
                        >
                          <ImageIcon className="w-3.5 h-3.5 inline mr-1 text-[#0d9488]" />
                          Photo/Image
                        </button>
                        <button
                          type="button"
                          onClick={() => openMediaPanel("audio")}
                          className="interactive-btn btn-neu text-[11px] !px-2.5 !py-1"
                        >
                          <Music className="w-3.5 h-3.5 inline mr-1 text-[#0d9488]" />
                          Audio
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExternalPanelOpen((v) => !v);
                            setMediaPanelOpen(false);
                          }}
                          className="interactive-btn btn-neu btn-neu--primary text-[11px] !px-2.5 !py-1"
                        >
                          <Link2 className="w-3.5 h-3.5 inline mr-1" />
                          Lien Externe
                        </button>
                      </div>
                    </div>

                    {/* SELECT PLATFORM UPLOADED MEDIA PANEL */}
                    {mediaPanelOpen && (
                      <div className="neu-inset p-3 rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-[#0c4a6e] dark:text-[#0d9488]">
                          <span>Lier un élément existant ({mediaLinkType})</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => loadExistingMedia(mediaLinkType)}
                              className="text-[11px] underline text-[#0d9488]"
                            >
                              {mediaLoading ? "Chargement..." : "Rafraîchir"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setMediaPanelOpen(false)}
                              className="text-[11px] underline text-red-500"
                            >
                              Fermer
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={selectedMediaLink}
                            onChange={(e) => setSelectedMediaLink(e.target.value)}
                            disabled={mediaLoading || !existingMedia.length}
                            className="neu-field flex-1 px-3 py-2 text-xs"
                          >
                            {existingMedia.length ? (
                              existingMedia.map((m: any) => (
                                <option key={m.id} value={m.sourceUrl}>
                                  {m.title}
                                </option>
                              ))
                            ) : (
                              <option value="">Aucun élément disponible</option>
                            )}
                          </select>
                          <button
                            type="button"
                            onClick={attachSelectedMedia}
                            disabled={!selectedMediaLink}
                            className="interactive-btn btn-neu btn-neu--primary px-3 py-2 text-xs"
                          >
                            Lier
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ADD EXTERNAL LINK WITH PAGE NAME */}
                    {externalPanelOpen && (
                      <div className="neu-inset p-3 rounded-lg space-y-2">
                        <span className="block text-xs font-bold text-[#0c4a6e] dark:text-[#0d9488]">
                          Ajouter un lien externe avec nom de page
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            value={externalTitle}
                            onChange={(e) => setExternalTitle(e.target.value)}
                            placeholder="Nom de la page / Titre (ex. Registre d'état civil)"
                            className="neu-field px-3 py-2 text-xs"
                          />
                          <input
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            placeholder="Lien externe URL (https://...)"
                            className="neu-field px-3 py-2 text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setExternalPanelOpen(false)}
                            className="interactive-btn btn-neu px-3 py-1.5 text-xs"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={attachExternalLink}
                            className="interactive-btn btn-neu btn-neu--primary px-3 py-1.5 text-xs"
                          >
                            Enregistrer le lien
                          </button>
                        </div>
                      </div>
                    )}

                    {/* LIST OF ATTACHED SOURCES */}
                    <div className="space-y-1">
                      {parseArrayField(formData?.sourceLinks).map((link: string, idx: number) => {
                        const parsed = parseIndividualPersonLinks({ sourceLinks: [link], sourceLinksManaged: true })[0];
                        return (
                          <div key={idx} className="neu-card p-2 rounded flex items-center justify-between text-xs gap-2">
                            <button
                              type="button"
                              onClick={() => openSourceLink(parsed?.url || link, parsed?.label, parsed?.kind)}
                              className="min-w-0 flex-1 truncate text-left font-semibold text-[#0d9488] hover:underline flex items-center gap-1.5"
                            >
                              {parsed?.kind === "image" ? (
                                <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                              ) : parsed?.kind === "audio" ? (
                                <Music className="w-3.5 h-3.5 shrink-0" />
                              ) : (
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              )}
                              <span className="truncate">{parsed?.label || link}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSourceLinkAt(idx)}
                              className="text-red-500 p-1 hover:bg-red-500/10 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* BACKUP & VISIBILITY OPTIONS */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#0c4a6e] dark:text-[#0d9488] border-b border-[#0d9488]/30 pb-1">
                      Paramètres & Visibilité
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-2 text-xs font-medium cursor-pointer p-2.5 rounded-lg neu-inset">
                        <input
                          type="checkbox"
                          checked={formData.isBackedUp !== false}
                          onChange={(e) => setFormData((s: any) => ({ ...s, isBackedUp: e.target.checked }))}
                          className="w-4 h-4 accent-[#0d9488]"
                        />
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Sauvegardé en base de données (Backup)</span>
                      </label>

                      <div className="p-2.5 rounded-lg neu-inset flex items-center justify-between">
                        <span className="text-xs font-medium flex items-center gap-1.5">
                          {formData.isPublic !== false ? (
                            <Globe className="w-4 h-4 text-[#0d9488]" />
                          ) : (
                            <Lock className="w-4 h-4 text-amber-500" />
                          )}
                          Statut de visibilité :
                        </span>
                        <select
                          value={formData.isPublic !== false ? "public" : "private"}
                          onChange={(e) =>
                            setFormData((s: any) => ({ ...s, isPublic: e.target.value === "public" }))
                          }
                          className="neu-field px-2.5 py-1 text-xs font-semibold"
                        >
                          <option value="public">Public</option>
                          <option value="private">Privé</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FORM ACTIONS */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-[#0d9488]/20">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="interactive-btn btn-neu px-4 py-2 text-xs"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="interactive-btn btn-neu btn-neu--primary px-5 py-2 text-xs font-bold"
                    >
                      Sauvegarder les changements
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL CARD MODAL (Matching Tree Builder Person Modal design) */}
      {selectedIndividual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`neu-card w-full max-w-xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
            isDark ? "bg-[#0f1f33] border-[#0d9488]/30" : "bg-white border-[#e8e4dc]"
          }`}>
            {/* CARD HEADER */}
            <div className="p-6 border-b border-[#0d9488]/20 flex items-start justify-between relative bg-[#0d9488]/5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner ${
                    selectedIndividual.gender === "F" ? "bg-rose-500" : "bg-[#0d9488]"
                  }`}
                >
                  {selectedIndividual.name ? selectedIndividual.name.charAt(0).toUpperCase() : "P"}
                </div>
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-[#0c4a6e] dark:text-[#0d9488]">
                    {selectedIndividual.name}
                  </h2>
                  {selectedIndividual.profession && (
                    <p className="text-xs text-[#0d9488] font-semibold mt-0.5">
                      {selectedIndividual.profession}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedIndividual(null)}
                className="p-1 rounded-lg text-stone-400 hover:bg-[#0d9488]/15 hover:text-[#0d9488]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CARD BODY */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              <div
                ref={previewSurfaceRef}
                onMouseMove={updatePreviewTilt}
                onMouseLeave={resetPreviewTilt}
                className="space-y-3 neu-inset p-4 rounded-xl transition-transform duration-200"
                style={{
                  transform: `perspective(1000px) rotateX(${previewTilt.y}deg) rotateY(${previewTilt.x}deg) scale(${previewTilt.active ? 1.01 : 1})`,
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="neu-label text-[10px] block uppercase tracking-wider font-bold">
                  {t("legacy.person_card", "Carte de personne")}
                </span>
                <svg ref={previewRef} className="w-full h-32 rounded-xl border border-[#0d9488]/20 bg-white/70 dark:bg-[#071827]/50" />
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {selectedIndividual.isBackedUp !== false && (
                    <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      GEDCOM sauvegardé
                    </span>
                  )}
                  {selectedIndividual.gedcomText ? (
                    <span className="px-2 py-1 rounded-full bg-[#0d9488]/10 text-[#0d9488] font-semibold">
                      GEDCOM en base
                    </span>
                  ) : null}
                </div>
                {selectedIndividual.gedcomText ? (
                  <div className="neu-inset p-3 rounded-lg">
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                      {t("legacy.import_gedcom_title", "Importer par GEDCOM")}
                    </span>
                    <pre className="text-[11px] whitespace-pre-wrap break-words max-h-40 overflow-auto">
                      {selectedIndividual.gedcomText}
                    </pre>
                  </div>
                ) : null}
                <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
                  Faites glisser pour incliner la carte 3D
                </div>
              </div>

              {/* VITAL INFO GRID */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="neu-inset p-3 rounded-lg">
                  <span className="neu-label text-[10px] block uppercase tracking-wider font-bold">Naissance</span>
                  <span className="font-semibold block mt-0.5">
                    {selectedIndividual.birthYear || "Inconnue"}
                  </span>
                  {selectedIndividual.birthPlace && (
                    <span className="text-stone-400 block text-[11px]">{selectedIndividual.birthPlace}</span>
                  )}
                </div>

                <div className="neu-inset p-3 rounded-lg">
                  <span className="neu-label text-[10px] block uppercase tracking-wider font-bold">Décès</span>
                  <span className="font-semibold block mt-0.5">
                    {selectedIndividual.deathDate || "Inconnu / En vie"}
                  </span>
                  {selectedIndividual.deathPlace && (
                    <span className="text-stone-400 block text-[11px]">{selectedIndividual.deathPlace}</span>
                  )}
                </div>
              </div>

              {/* DETAILS / NOTES */}
              {selectedIndividual.details && (
                <div>
                  <span className="neu-label text-[10px] block uppercase tracking-wider font-bold mb-1">
                    Notes & Détails
                  </span>
                  <p className="text-xs neu-inset p-3 rounded-lg leading-relaxed">
                    {selectedIndividual.details}
                  </p>
                </div>
              )}

              {/* CUSTOM FIELDS SECTION */}
              {parseArrayField(selectedIndividual?.customFields).length > 0 && (
                <div>
                  <span className="neu-label text-[10px] block uppercase tracking-wider font-bold mb-2">
                    Champs personnalisés
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {parseArrayField(selectedIndividual?.customFields).map((field: any) => (
                      <div key={field.id} className="neu-inset p-2.5 rounded-lg text-xs">
                        <span className="text-[10px] font-bold text-[#0d9488] block">{field.name}</span>
                        <span className="font-semibold">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LINKED SOURCES & MEDIA */}
              <div>
                <span className="neu-label text-[10px] block uppercase tracking-wider font-bold mb-2">
                  Sources & Documents Rattachés
                </span>
                {parseIndividualPersonLinks(selectedIndividual).length > 0 ? (
                  <div className="space-y-2">
                    {parseIndividualPersonLinks(selectedIndividual).map((link: any, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => openSourceLink(link.url, link.label, link.kind)}
                        className="neu-card p-3 rounded-lg flex items-start justify-between text-xs hover:border-[#0d9488] transition-colors group w-full"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <Link2 className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
                          <span className="min-w-0 text-left">
                            <span className="block font-semibold text-[#0c4a6e] dark:text-[#0d9488] group-hover:underline truncate">
                              {link.label}
                            </span>
                            {link.url && !isDomainOrHostString(link.url) ? (
      <span className="block text-[10px] font-normal text-stone-500 dark:text-stone-400 truncate">
        {link.url.startsWith("http") ? new URL(link.url).pathname : link.url}
      </span>
    ) : null}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#0d9488] shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic neu-inset p-3 rounded-lg text-stone-400">
                    Aucune source ou document rattaché.
                  </p>
                )}
              </div>
            </div>

            {/* CARD FOOTER */}
            <div className="p-4 border-t border-[#0d9488]/20 flex justify-between items-center bg-[#0d9488]/5">
              <button
                onClick={() => deleteIndividual(selectedIndividual.id)}
                className="text-red-500 text-xs font-semibold hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Supprimer
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(selectedIndividual)}
                  className="interactive-btn btn-neu btn-neu--primary px-4 py-2 text-xs flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewSource && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setPreviewSource(null)}>
          <div className={`w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
            isDark ? "bg-[#0f1f33] border-[#0d9488]/30" : "bg-white border-[#e8e4dc]"
          } animate-in zoom-in-95 duration-200`} onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#0d9488]/20 flex items-center justify-between bg-stone-50/50 dark:bg-[#071827]/30">
              <div className="min-w-0 flex-1">
                <h2 className="font-cinzel text-lg font-bold text-[#0c4a6e] dark:text-[#0d9488] truncate">
                  {previewSource.label}
                </h2>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-1">
                  {previewSource.url}
                </p>
              </div>
              <button
                onClick={() => setPreviewSource(null)}
                className="p-1 rounded-lg text-stone-400 hover:bg-[#0d9488]/15 hover:text-[#0d9488] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0d1b2a]/10">
              {previewSource.kind === "image" || /\.(png|jpe?g|gif|webp)$/i.test(previewSource.url) ? (
                <img
                  src={previewSource.url}
                  alt={previewSource.label}
                  className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-md bg-stone-50 dark:bg-[#071827]/50"
                />
              ) : previewSource.kind === "audio" || /\.(mp3|wav|ogg|m4a)$/i.test(previewSource.url) ? (
                <div className="text-center p-6 bg-stone-50 dark:bg-[#071827]/50 rounded-xl border border-[#0d9488]/15 w-full max-w-md">
                  <Music className="w-16 h-16 text-[#0d9488] mx-auto mb-4 animate-pulse" />
                  <audio controls src={previewSource.url} className="w-full" autoPlay />
                </div>
              ) : previewSource.url.toLowerCase().endsWith(".pdf") || previewSource.kind === "document" || previewSource.kind === "book" ? (
                <div className="w-full h-full min-h-[45vh] flex flex-col">
                  <iframe
                    src={previewSource.url}
                    title={previewSource.label}
                    className="w-full flex-1 min-h-[40vh] border border-[#0d9488]/15 rounded-lg bg-white"
                  />
                </div>
              ) : (
                <div className="text-center p-8 bg-stone-50 dark:bg-[#071827]/50 rounded-xl border border-[#0d9488]/15 max-w-md">
                  <FileText className="w-16 h-16 text-[#0d9488] mx-auto mb-4" />
                  <p className="text-sm font-semibold mb-2">Lien externe ou document</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                    Ce type de fichier ou lien ne peut pas être prévisualisé directement.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#0d9488]/20 flex justify-end gap-3 bg-stone-50/30 dark:bg-[#071827]/10">
              <a
                href={previewSource.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-btn btn-neu btn-neu--primary px-4 py-2 text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Télécharger / Ouvrir
              </a>
              <button
                type="button"
                onClick={() => setPreviewSource(null)}
                className="interactive-btn btn-neu px-4 py-2 text-xs text-stone-600 dark:text-stone-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
