import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  X,
  GitBranch,
  Users,
  Layers,
  Download,
  FileCode,
  Sparkles,
  User,
  ShieldCheck,
  MapPin,
  Clock,
  RefreshCcw,
  Briefcase,
  FileText,
  Link2,
  ExternalLink,
  Calendar,
  ScrollText,
  Music,
  Award,
  ChevronRight,
  Archive,
  Building,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import TreesBuilder, {
  parseGedcom,
  parseGedcomX,
  extractPersonLinks,
  maskSourceLabel,
  isInternalBackendUrl,
  handleSafeDownloadOrOpen,
} from "../admin/components/TreesBuilder";
import { getTreeMetrics, computeRealGenerations } from "../utils/treeMetrics";

interface FamilyCardModalProps {
  tree?: any;
  individual?: any;
  onClose: () => void;
}

interface RealMemberSourceItem {
  id: string;
  memberId: string;
  memberName: string;
  memberRole?: string;
  gender?: string;
  url: string;
  label: string;
  kind: "image" | "audio" | "document" | "external" | "archive";
  archiveSource?: string;
  documentCode?: string;
  reliability?: string;
  details?: string;
}

const cleanArchText = (val: unknown): string => {
  if (Array.isArray(val)) return val.map(cleanArchText).filter(Boolean).join(", ");
  const s = String(val || "").trim();
  if (!s || /^@[^@]+@$/.test(s)) return "";
  return s;
};

const classifySourceLink = (linkKind: string | undefined, url: string | undefined): RealMemberSourceItem["kind"] => {
  const lower = String(url || "").toLowerCase();
  if (linkKind === "audio" || /\.(mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(lower) || lower.includes("/uploads/audios/")) {
    return "audio";
  }
  if (linkKind === "image" || /\.(png|jpe?g|gif|webp)(?:[?#].*)?$/i.test(lower) || lower.includes("/uploads/gallery/")) {
    return "image";
  }
  if (linkKind === "document" || /\.(pdf|docx?|txt)(?:[?#].*)?$/i.test(lower) || lower.includes("/uploads/documents/")) {
    return "document";
  }
  return "external";
};

const isDirectPreviewUrl = (kind: string, url: string): boolean => {
  const lower = String(url || "").toLowerCase();
  return (
    kind === "image" ||
    kind === "audio" ||
    kind === "document" ||
    /\.(png|jpe?g|gif|webp|pdf|mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(lower) ||
    lower.includes("/uploads/")
  );
};

// Fast module-level in-memory cache for parsed people per tree
const modalParsedTreeCache = new Map<string | number, { people: any[]; timestamp: number }>();

export default function FamilyCardModal({ tree, individual, onClose }: FamilyCardModalProps) {
  const { t, locale } = useTranslation();
  const isArabic = locale === "ar";
  const [activeTab, setActiveTab] = useState<"schema" | "details" | "sources">("schema");
  const [fetchedPeople, setFetchedPeople] = useState<any[] | null>(null);
  const [loadingGedcom, setLoadingGedcom] = useState(false);

  // Selected Individual in Volet 2 (Fiche & GEDCOM)
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const [personTilt, setPersonTilt] = useState({ x: 0, y: 0, active: false });
  const personSurfaceRef = useRef<HTMLDivElement | null>(null);

  // Selected Source member filter & live preview modal state
  const [selectedSourceMemberId, setSelectedSourceMemberId] = useState<string>("all");
  const [previewSource, setPreviewSource] = useState<{
    url: string;
    label: string;
    kind?: string;
    memberName?: string;
    repository?: string;
    cote?: string;
    date?: string;
    location?: string;
  } | null>(null);

  // 3D Card Tilt State for Standalone Individual Modal
  const [previewTilt, setPreviewTilt] = useState({ x: 0, y: 0, active: false });
  const previewSurfaceRef = useRef<HTMLDivElement | null>(null);

  const updatePreviewTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewSurfaceRef.current) return;
    const rect = previewSurfaceRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setPreviewTilt({
      x: Math.max(-12, Math.min(12, (px - 0.5) * 24)),
      y: Math.max(-12, Math.min(12, (0.5 - py) * 24)),
      active: true,
    });
  };

  const resetPreviewTilt = () => {
    setPreviewTilt({ x: 0, y: 0, active: false });
  };

  const updatePersonTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!personSurfaceRef.current) return;
    const rect = personSurfaceRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setPersonTilt({
      x: Math.max(-12, Math.min(12, (px - 0.5) * 24)),
      y: Math.max(-12, Math.min(12, (0.5 - py) * 24)),
      active: true,
    });
  };

  const resetPersonTilt = () => {
    setPersonTilt({ x: 0, y: 0, active: false });
  };

  const isIndividualModal = Boolean(individual && !tree);

  // Extract Tree / Individual metadata
  const rawIndName = individual
    ? (
        individual.name ||
        `${individual.first_name || individual.firstName || individual.given || ""} ${
          individual.last_name || individual.lastName || individual.surname || ""
        }`
      ).trim()
    : "";
  const indName =
    isArabic && rawIndName && !/[\u0600-\u06FF]/.test(rawIndName)
      ? individual?.gender === "F"
        ? t("ind_default_name_f", "السيدة الفاضلة")
        : t("ind_default_name_m", "السيد الفاضل")
      : rawIndName;
  const rawTitle = tree?.name || tree?.title || indName || "";
  const title = !rawTitle || (isArabic && !/[\u0600-\u06FF]/.test(rawTitle)) ? t("family_tree", "Arbre Généalogique") : rawTitle;
  const rawGov = tree?.governorate || tree?.region || individual?.birth_place || individual?.birthPlace || "";
  const governorate = !rawGov || (isArabic && !/[\u0600-\u06FF]/.test(rawGov)) ? t("tunisia", "Tunisie") : rawGov;
  const rawPeopleList = Array.isArray(tree?.people) ? tree.people : individual ? [individual] : [];
  const rawDesc = tree?.description || tree?.notes || tree?.provenance || "";
  const description =
    !rawDesc || (isArabic && !/[\u0600-\u06FF]/.test(rawDesc))
      ? t("tree_default_summary", "Lignée familiale et archives patronymiques répertoriées avec actes d'état civil et registres historiques.")
      : rawDesc;

  // Reset state when switching trees
  useEffect(() => {
    setSelectedPerson(null);
    setSelectedSourceMemberId("all");
    setPreviewSource(null);

    const targetTreeId = tree?.id;
    if (targetTreeId && modalParsedTreeCache.has(targetTreeId)) {
      setFetchedPeople(modalParsedTreeCache.get(targetTreeId)!.people);
      setLoadingGedcom(false);
    } else {
      setFetchedPeople(null);
    }
  }, [tree?.id]);

  // Initial check if GEDCOM text is already attached
  useEffect(() => {
    if (isIndividualModal) return;
    const targetTreeId = tree?.id;
    if (targetTreeId && modalParsedTreeCache.has(targetTreeId)) return;

    const rawContent = tree?.gedcom_text || tree?.content || tree?.gedcom_data || tree?.gedcom || tree?.gedcomText;
    if (typeof rawContent === "string" && rawContent.trim().length > 10) {
      try {
        const isGedcomX = (tree?.data_format || "gedcom") === "gedcomx" || /^\s*(\{|\<\?xml)/.test(rawContent);
        const parsed = isGedcomX ? parseGedcomX(rawContent) : parseGedcom(rawContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (targetTreeId) modalParsedTreeCache.set(targetTreeId, { people: parsed, timestamp: Date.now() });
          setFetchedPeople(parsed);
        }
      } catch (e) {
        console.warn("Error parsing pre-loaded tree GEDCOM text:", e);
      }
    }
  }, [tree?.id, tree?.gedcom_text, tree?.content, tree?.gedcom_data, tree?.gedcomText, isIndividualModal]);

  // Dynamically fetch exact GEDCOM / DB people for this tree so schema and details match Tree Builder 100%
  useEffect(() => {
    if (isIndividualModal) return;
    const targetTreeId = tree?.id;
    if (!targetTreeId) return;

    // 1. Instant hit from memory cache
    const cached = modalParsedTreeCache.get(targetTreeId);
    if (cached && Array.isArray(cached.people) && cached.people.length > 0) {
      setFetchedPeople(cached.people);
      setLoadingGedcom(false);
      return;
    }

    // 2. Instant hit from preloaded tree object (props)
    if (Array.isArray(tree?.people) && tree.people.length > 0) {
      modalParsedTreeCache.set(targetTreeId, { people: tree.people, timestamp: Date.now() });
      setFetchedPeople(tree.people);
      setLoadingGedcom(false);
      return;
    }

    let isMounted = true;
    setLoadingGedcom(true);

    (async () => {
      try {
        let res: any;
        try {
          res = await api.get(`/trees/${targetTreeId}/gedcom`, { responseType: "text" });
        } catch {
          try {
            res = await api.get(`/my/trees/${targetTreeId}/gedcom`, { responseType: "text" });
          } catch {
            res = await api.get(`/admin/trees/${targetTreeId}/gedcom`, { responseType: "text" });
          }
        }

        const rawText =
          typeof res?.data === "string"
            ? res.data
            : res?.data && (res.data as any).data != null
            ? String((res.data as any).data)
            : "";

        if (rawText && rawText.trim().length > 10 && isMounted) {
          const isGedcomX = (tree?.data_format || "gedcom") === "gedcomx" || /^\s*(\{|\<\?xml)/.test(rawText);
          const parsed = isGedcomX ? parseGedcomX(rawText) : parseGedcom(rawText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            modalParsedTreeCache.set(targetTreeId, { people: parsed, timestamp: Date.now() });
            setFetchedPeople(parsed);
            setLoadingGedcom(false);
            return;
          }
        }

        try {
          const treeObjRes = await api.get(`/trees/${targetTreeId}`);
          const treeObj = treeObjRes?.data?.data || treeObjRes?.data;
          if (treeObj && isMounted) {
            const gedText = treeObj.gedcom_text || treeObj.content || treeObj.gedcom_data;
            if (typeof gedText === "string" && gedText.trim().length > 10) {
              const isGedX = treeObj.data_format === "gedcomx" || /^\s*(\{|\<\?xml)/.test(gedText);
              const parsed = isGedX ? parseGedcomX(gedText) : parseGedcom(gedText);
              if (Array.isArray(parsed) && parsed.length > 0) {
                modalParsedTreeCache.set(targetTreeId, { people: parsed, timestamp: Date.now() });
                setFetchedPeople(parsed);
                setLoadingGedcom(false);
                return;
              }
            }
            if (Array.isArray(treeObj.people) && treeObj.people.length > 0) {
              modalParsedTreeCache.set(targetTreeId, { people: treeObj.people, timestamp: Date.now() });
              setFetchedPeople(treeObj.people);
              setLoadingGedcom(false);
              return;
            }
          }
        } catch {
          // Ignore
        }

        // Fallback to SQL persons table if GEDCOM file was not uploaded separately
        try {
          const peopleRes = await api.get(`/trees/${targetTreeId}/people`);
          const peopleRows = peopleRes?.data?.data || peopleRes?.data;
          if (Array.isArray(peopleRows) && peopleRows.length > 0 && isMounted) {
            modalParsedTreeCache.set(targetTreeId, { people: peopleRows, timestamp: Date.now() });
            setFetchedPeople(peopleRows);
            setLoadingGedcom(false);
            return;
          }
        } catch {
          // Ignore
        }

        if (isMounted) {
          setFetchedPeople([]);
        }
      } catch (err) {
        console.warn("Could not fetch GEDCOM schema for modal:", err);
        if (isMounted) {
          setFetchedPeople([]);
        }
      } finally {
        if (isMounted) setLoadingGedcom(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [tree?.id, tree?.data_format, isIndividualModal]);

  const normalizePersonList = (list: any[]) =>
    list.map((p: any, idx: number) => {
      const id = p.id != null ? String(p.id) : `@I${idx + 1}@`;
      const rawName = typeof p.name === "string" ? p.name.trim() : "";
      const existingNamesObj = p.names && typeof p.names === "object" ? p.names : null;
      const rawGiven = p.first_name || p.firstName || p.given || "";
      const surname = p.last_name || p.lastName || p.surname || "";
      const fullName =
        existingNamesObj?.fr ||
        existingNamesObj?.en ||
        existingNamesObj?.ar ||
        rawName ||
        [rawGiven, surname].filter(Boolean).join(" ").trim() ||
        `Individu #${idx + 1}`;
      const father = p.father || p.father_id || p.fatherId ? String(p.father || p.father_id || p.fatherId) : null;
      const mother = p.mother || p.mother_id || p.motherId ? String(p.mother || p.mother_id || p.motherId) : null;
      const spouse = p.spouse || p.spouse_id || p.spouseId ? String(p.spouse || p.spouse_id || p.spouseId) : null;
      const children = Array.isArray(p.children) ? p.children.map(String) : [];
      const bDate = p.birth_date || p.birthDate || p.birthYear || p.birth_year || "";
      const dDate = p.death_date || p.deathDate || p.deathYear || p.death_year || "";

      return {
        ...p,
        id,
        given: rawGiven || (surname ? "" : fullName),
        surname,
        name: fullName,
        names: existingNamesObj || { fr: fullName, en: fullName, ar: fullName },
        gender: (p.gender || "").toUpperCase().startsWith("F") ? "F" : (p.gender || "").toUpperCase().startsWith("M") ? "M" : "",
        birthYear: p.birthYear || bDate,
        birthDate: bDate,
        birthPlace: p.birth_place || p.birthPlace || "",
        deathDate: dDate,
        deathPlace: p.death_place || p.deathPlace || "",
        profession: p.profession || p.occupation || p.job || "",
        occupation: p.occupation || p.profession || p.job || "",
        father,
        mother,
        spouse,
        children,
      };
    });

  // Real individuals belonging strictly to this tree (never inject fake sample people for a DB tree)
  const displayPeople = useMemo(() => {
    if (Array.isArray(fetchedPeople) && fetchedPeople.length > 0) {
      return normalizePersonList(fetchedPeople);
    }

    if (rawPeopleList.length > 0) {
      return normalizePersonList(rawPeopleList);
    }

    return [];
  }, [rawPeopleList, fetchedPeople]);

  // Set default selected person when people are available
  useEffect(() => {
    if (displayPeople.length > 0 && !selectedPerson) {
      setSelectedPerson(displayPeople[0]);
    }
  }, [displayPeople, selectedPerson]);

  // Safe name extractor matching TreesBuilder
  const nameOf = (p: any): string => {
    if (!p) return "Individu";
    const fromNames = p.names?.[locale] || p.names?.fr || p.names?.en || p.names?.ar || (typeof p.name === "string" ? p.name : "");
    if (fromNames && String(fromNames).trim()) return String(fromNames).trim();
    const givenSurname = [p.given, p.first_name, p.firstName, p.surname, p.last_name, p.lastName].filter(Boolean).map(String).join(" ").trim();
    return givenSurname || "Individu";
  };

  // Detect strictly real sources from every individual's Open Details modal (matching TreesBuilder Open Details)
  const allMemberSources = useMemo<RealMemberSourceItem[]>(() => {
    const list: RealMemberSourceItem[] = [];
    const seen = new Set<string>();

    displayPeople.forEach((p: any, idx: number) => {
      if (!p) return;
      const memberId = String(p.id ?? `@I${idx + 1}@`);
      const memberName = nameOf(p) || `Individu #${idx + 1}`;

      const isFemale = (p.gender || "").toUpperCase().startsWith("F");
      const hasChildren = Array.isArray(p.children) && p.children.length > 0;
      const memberRole = isFemale
        ? (hasChildren ? "Mère & Conjointe" : "Fille")
        : (hasChildren ? "Père de famille" : (p.father || p.mother ? "Fils" : "Individu"));

      const archSrc = cleanArchText(p.archiveSource);
      const docCode = cleanArchText(p.documentCode);
      const extracted = typeof extractPersonLinks === "function" ? extractPersonLinks(p) : [];

      // 1. Exact links/documents shown in "Sources & Documents" of this individual's Open Details modal
      if (Array.isArray(extracted) && extracted.length > 0) {
        extracted.forEach((l: any, lIdx: number) => {
          const key = `${memberId}::${l.url}::${l.label}`;
          if (seen.has(key)) return;
          seen.add(key);

          const kind = classifySourceLink(l.kind, l.url);

          list.push({
            id: `src-${memberId}-${lIdx}`,
            memberId,
            memberName,
            memberRole,
            gender: p.gender,
            url: l.url,
            label: maskSourceLabel(l.label, l.url, kind),
            kind,
            archiveSource: archSrc || undefined,
            documentCode: docCode || undefined,
            reliability: p.reliability || undefined,
            details: p.details || undefined,
          });
        });
      }

      // 2. Explicit archival reference / cote fields set on this person's Open Details modal (excluding bare @xref@ pointers & URL duplicates)
      if (archSrc || docCode) {
        const archLabel = [archSrc, docCode].filter(Boolean).join(" • ");
        const alreadyInLink = Array.isArray(extracted) && extracted.some((l: any) =>
          l.url && (archSrc.includes(l.url) || l.url.includes(archSrc) || String(l.raw || "").trim() === archSrc)
        );
        if (archLabel && !alreadyInLink) {
          const key = `${memberId}::archive::${archLabel}`;
          if (!seen.has(key)) {
            seen.add(key);
            list.push({
              id: `arch-${memberId}`,
              memberId,
              memberName,
              memberRole,
              gender: p.gender,
              url: "",
              label: archLabel,
              kind: "archive",
              archiveSource: archSrc || undefined,
              documentCode: docCode || undefined,
              reliability: p.reliability || undefined,
              details: p.details || undefined,
            });
          }
        }
      }
    });

    return list;
  }, [displayPeople, locale]);

  // Real exact metrics computed directly from loaded people graph
  const treeMetrics = useMemo(() => {
    if (fetchedPeople !== null || rawPeopleList.length > 0) {
      const couplePairs = new Set<string>();
      displayPeople.forEach((p: any) => {
        if (p?.spouse) {
          couplePairs.add([String(p.id), String(p.spouse)].sort().join("::"));
        }
        if (p?.father && p?.mother) {
          couplePairs.add([String(p.father), String(p.mother)].sort().join("::"));
        }
      });
      return {
        individuals: displayPeople.length,
        generations: displayPeople.length > 0 ? computeRealGenerations(displayPeople) : 0,
        couplesCount: couplePairs.size,
        sourcesCount: allMemberSources.length,
      };
    }

    return {
      ...getTreeMetrics(tree),
      sourcesCount: allMemberSources.length,
    };
  }, [tree, fetchedPeople, rawPeopleList.length, displayPeople, allMemberSources.length]);

  const membersCount = treeMetrics.individuals;
  const generations = treeMetrics.generations;

  // Filtered Real Sources by Selected Member
  const filteredMemberSources = useMemo(() => {
    if (selectedSourceMemberId === "all") return allMemberSources;
    return allMemberSources.filter((s) => s.memberId === selectedSourceMemberId);
  }, [allMemberSources, selectedSourceMemberId]);

  const handleDownloadGedcom = async () => {
    if (!tree?.id) {
      const gedcomText = `0 HEAD\n1 SOUR RootsPlatform\n1 GEDC\n2 VERS 5.5.1\n1 CHAR UTF-8\n0 @I1@ INDI\n1 NAME ${title}\n0 TRLR\n`;
      const blob = new Blob([gedcomText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.ged`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const base = String(api.defaults.baseURL || "/api").replace(/\/+$/, "");
    window.open(`${base}/trees/${tree.id}/gedcom`, "_blank", "noopener,noreferrer");
  };

  const getSourceKindBadge = (kind: RealMemberSourceItem["kind"]) => {
    switch (kind) {
      case "image":
        return { label: "IMAGE", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
      case "audio":
        return { label: "AUDIO", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
      case "document":
        return { label: "DOCUMENT", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" };
      case "external":
        return { label: "LIEN EXTERNE", color: "bg-teal-500/15 text-teal-400 border-teal-500/30" };
      case "archive":
      default:
        return { label: "ARCHIVE", color: "bg-[var(--gold)]/15 text-[var(--gold)] border-[var(--gold)]/30" };
    }
  };

  // Current person with safe fallback to first member
  const currentPerson = selectedPerson || (displayPeople.length > 0 ? displayPeople[0] : null);

  // Open source action matching TreesBuilder Open Details modal strictly
  const openSourceAction = (item: {
    url?: string;
    label: string;
    kind: string;
    memberName?: string;
    archiveSource?: string;
    documentCode?: string;
    date?: string;
    location?: string;
  }) => {
    const url = String(item.url || "").trim();
    if (!url) return;
    if (!isDirectPreviewUrl(item.kind, url) && /^https?:\/\//i.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setPreviewSource({
      url,
      label: maskSourceLabel(item.label, url, item.kind),
      kind: item.kind,
      memberName: item.memberName,
      repository: item.archiveSource,
      cote: item.documentCode,
      date: item.date,
      location: item.location,
    });
  };

  // Sources for the currently selected person in Volet 2 (Matching TreesBuilder Open Details strictly)
  const selectedPersonSources = useMemo(() => {
    const target = selectedPerson || (displayPeople.length > 0 ? displayPeople[0] : null);
    if (!target) return [];

    const extracted = typeof extractPersonLinks === "function" ? extractPersonLinks(target) : [];
    const list = Array.isArray(extracted)
      ? extracted.map((l: any) => ({
          ...l,
          kind: classifySourceLink(l.kind, l.url),
        }))
      : [];

    const archSrc = cleanArchText(target.archiveSource);
    const docCode = cleanArchText(target.documentCode);
    if (archSrc || docCode) {
      const label = [archSrc, docCode].filter(Boolean).join(" • ");
      const alreadyInLink = list.some((l) =>
        l.url && (archSrc.includes(l.url) || l.url.includes(archSrc) || String(l.raw || "").trim() === archSrc)
      );
      if (label && !alreadyInLink && !list.some((l) => l.label === label)) {
        list.push({
          url: "",
          label,
          kind: "archive" as const,
        });
      }
    }

    return list;
  }, [selectedPerson, displayPeople]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-1.5 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-[var(--card)] border border-[var(--gold)]/50 shadow-2xl p-3 sm:p-6 my-auto text-[var(--foreground)] animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[96vh] sm:max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 border-b border-[var(--border)] pb-2.5 sm:pb-3.5 shrink-0">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[0.6rem] sm:text-[0.65rem] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
                <span>{t("verified_patrimony", "Patrimoine Vérifié")}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("schema")}
              className="text-start group cursor-pointer block max-w-full"
              title="Cliquer pour afficher le schéma interactif de l'arbre"
            >
              <h2 className="text-base sm:text-xl md:text-2xl font-serif font-bold text-[var(--foreground)] tracking-wide group-hover:text-[var(--gold)] transition-colors line-clamp-2 sm:line-clamp-none">
                <span>{title}</span>
              </h2>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
            title={t("close", "Fermer")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* CASE 1: INDIVIDUAL STANDALONE MODAL                                       */}
        {/* ========================================================================= */}
        {isIndividualModal ? (
          <div className="space-y-5 animate-in fade-in duration-200 overflow-y-auto p-2">
            <div className="p-5 rounded-2xl border border-[var(--gold)]/40 bg-gradient-to-br from-[var(--background)] via-[var(--card)] to-[var(--background)] shadow-xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-serif font-bold text-white shadow-md border-2 border-[var(--gold)]/60 ${
                      individual.gender === "F" ? "bg-rose-600" : "bg-[#0d9488]"
                    }`}
                  >
                    {indName ? indName.charAt(0).toUpperCase() : "ج"}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[var(--foreground)]">{indName}</h3>
                    {(individual.profession || individual.occupation) && (
                      <p className="text-xs text-[var(--gold)] font-semibold mt-0.5 flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{individual.profession || individual.occupation}</span>
                      </p>
                    )}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30">
                  {governorate}
                </span>
              </div>

              {/* 3D TILT INDIVIDUAL CARD */}
              <div
                ref={previewSurfaceRef}
                onMouseMove={updatePreviewTilt}
                onMouseLeave={resetPreviewTilt}
                className="space-y-3 p-5 rounded-xl border border-[var(--gold)]/30 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] text-white transition-transform duration-200 shadow-2xl relative overflow-hidden"
                style={{
                  transform: `perspective(1000px) rotateX(${previewTilt.y}deg) rotateY(${previewTilt.x}deg) scale(${
                    previewTilt.active ? 1.01 : 1
                  })`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="flex items-center justify-between text-xs border-b border-[var(--gold)]/20 pb-2">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--gold)] flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{t("card_individual_3d", "Fiche Individuelle d'Archives")}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[0.65rem] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t("registered_document", "Acte Enregistré")}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 font-mono">
                  <div className="p-3 rounded-lg bg-black/40 border border-[var(--gold)]/30 space-y-1">
                    <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">{t("birth", "Naissance")}</span>
                    <span className="font-bold text-white block flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>{individual.birth_date || individual.birthDate || t("unknown_date", "Date à préciser")}</span>
                    </span>
                    <span className="text-slate-300 block text-[11px] flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[var(--gold)]" />
                      <span>{individual.birth_place || individual.birthPlace || governorate}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-[var(--gold)]/30 space-y-1">
                    <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">{t("death", "Décès")}</span>
                    <span className="font-bold text-white block flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{individual.death_date || individual.deathDate || t("living_or_unlisted", "Non répertorié")}</span>
                    </span>
                    <span className="text-slate-300 block text-[11px] flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[var(--gold)]" />
                      <span>{individual.death_place || individual.deathPlace || t("not_applicable", "—")}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE 2: TREE MODAL WITH SYMMETRICAL VERTICAL 3-VOLET NAVIGATION           */
          /* ========================================================================= */
          <div className="flex flex-col md:flex-row gap-3 sm:gap-5 pt-2.5 sm:pt-3 flex-1 overflow-y-auto md:overflow-hidden min-h-0">
            
            {/* 3-VOLET NAVIGATION: ONE UNDER ONE, VERTICALEMENT ALIGNÉ & SYMÉTRIQUE ON DESKTOP, COMPACT RESPONSIVE ON MOBILE */}
            <div className="w-full md:w-64 shrink-0 flex flex-col justify-start relative z-20 pointer-events-auto">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[var(--background)]/90 border border-[var(--gold)]/40 shadow-md space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider sm:tracking-widest text-[var(--gold)] block text-start">
                    Navigation des 3 Volets
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono md:hidden text-[var(--muted-foreground)]">
                    <span>Gén: <strong className="text-[var(--gold)]">{generations}</strong></span>
                    <span>•</span>
                    <span>Ind: <strong className="text-[var(--gold)]">{membersCount}</strong></span>
                  </div>
                </div>

                {/* 3 BUTTONS */}
                <div className="grid grid-cols-3 md:flex md:flex-col gap-1.5 sm:gap-2">
                  {/* VOLET 1 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveTab("schema");
                    }}
                    className={`w-full py-2 px-1.5 sm:py-3 sm:px-3 rounded-lg sm:rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center sm:gap-3 transition-all cursor-pointer border select-none ${
                      activeTab === "schema"
                        ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-md font-bold ring-2 ring-[var(--gold)]/40"
                        : "bg-[var(--card)]/60 text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/10"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mb-1 sm:mb-0 ${
                        activeTab === "schema" ? "bg-black/20 text-black" : "bg-[var(--gold)]/15 text-[var(--gold)]"
                      }`}
                    >
                      <GitBranch className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="text-center sm:text-start min-w-0 flex-1">
                      <div className="font-bold text-[10px] sm:text-xs leading-tight sm:leading-snug truncate">Schéma Graphique</div>
                      <div className={`hidden md:block text-[10px] truncate ${activeTab === "schema" ? "text-black/80 font-medium" : "text-[var(--muted-foreground)]"}`}>
                        Arbre interactif & liens
                      </div>
                    </div>
                  </button>

                  {/* VOLET 2 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveTab("details");
                      if (!selectedPerson && displayPeople.length > 0) {
                        setSelectedPerson(displayPeople[0]);
                      }
                    }}
                    className={`w-full py-2 px-1.5 sm:py-3 sm:px-3 rounded-lg sm:rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center sm:gap-3 transition-all cursor-pointer border select-none ${
                      activeTab === "details"
                        ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-md font-bold ring-2 ring-[var(--gold)]/40"
                        : "bg-[var(--card)]/60 text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/10"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mb-1 sm:mb-0 ${
                        activeTab === "details" ? "bg-black/20 text-black" : "bg-[var(--gold)]/15 text-[var(--gold)]"
                      }`}
                    >
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="text-center sm:text-start min-w-0 flex-1">
                      <div className="font-bold text-[10px] sm:text-xs leading-tight sm:leading-snug truncate">Fiche & GEDCOM</div>
                      <div className={`hidden md:block text-[10px] truncate ${activeTab === "details" ? "text-black/80 font-medium" : "text-[var(--muted-foreground)]"}`}>
                        Personnes & Détails
                      </div>
                    </div>
                  </button>

                  {/* VOLET 3 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveTab("sources");
                    }}
                    className={`w-full py-2 px-1.5 sm:py-3 sm:px-3 rounded-lg sm:rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center sm:gap-3 transition-all cursor-pointer border select-none ${
                      activeTab === "sources"
                        ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-md font-bold ring-2 ring-[var(--gold)]/40"
                        : "bg-[var(--card)]/60 text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/10"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 mb-1 sm:mb-0 ${
                        activeTab === "sources" ? "bg-black/20 text-black" : "bg-[var(--gold)]/15 text-[var(--gold)]"
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div className="text-center sm:text-start min-w-0 flex-1">
                      <div className="font-bold text-[10px] sm:text-xs leading-tight sm:leading-snug truncate">Aperçu Sources</div>
                      <div className={`hidden md:block text-[10px] truncate ${activeTab === "sources" ? "text-black/80 font-medium" : "text-[var(--muted-foreground)]"}`}>
                        Documents & Liens réels
                      </div>
                    </div>
                  </button>
                </div>

                {/* Symmetrical Tree Metrics Footer (desktop) */}
                <div className="hidden md:grid pt-2.5 border-t border-[var(--border)] grid-cols-2 gap-1.5 text-center font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                    <span className="text-[10px] text-[var(--muted-foreground)] block">Générations</span>
                    <strong className="text-[var(--gold)] font-bold">{generations}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                    <span className="text-[10px] text-[var(--muted-foreground)] block">Individus</span>
                    <strong className="text-[var(--gold)] font-bold">{membersCount}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB CONTENT PANEL */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
              
              {/* ======================================================== */}
              {/* VOLET 1: SCHÉMA GRAPHIQUE INTERACTIF                     */}
              {/* ======================================================== */}
              {activeTab === "schema" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] font-mono px-1">
                    <span className="flex items-center gap-1.5 truncate">
                      <GitBranch className="h-4 w-4 text-[var(--gold)] shrink-0" />
                      <span className="truncate">{t("interactive_tree_schema_hint", "Survolez les unions et filiations • Glissez pour naviguer • Zoomez")}</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {loadingGedcom && (
                        <span className="text-[0.68rem] text-[var(--gold)] animate-pulse flex items-center gap-1">
                          <RefreshCcw className="h-3 w-3 animate-spin" /> {t("loading_gedcom", "Chargement...")}
                        </span>
                      )}
                      <span className="bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-xs">
                        {displayPeople.length} {t("linked_cards", "cartes liées")}
                      </span>
                    </div>
                  </div>

                  <div className="h-[360px] sm:h-[480px] lg:h-[580px] w-full rounded-xl overflow-hidden border-2 border-[var(--gold)]/60 relative bg-[#0b1726] shadow-2xl flex flex-col">
                    {loadingGedcom && displayPeople.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-300 p-6 text-center">
                        <RefreshCcw className="h-7 w-7 text-[var(--gold)] animate-spin" />
                        <span className="text-xs font-mono">Chargement de la structure généalogique...</span>
                      </div>
                    ) : displayPeople.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-300 p-6 text-center max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
                          <GitBranch className="h-6 w-6" />
                        </div>
                        <h4 className="font-serif text-base font-bold text-white">
                          Aucun individu enregistré dans cet arbre
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Cet arbre ne contient pas encore d&apos;individus ni de fichier GEDCOM importé. Ajoutez des personnes dans l&apos;éditeur pour visualiser la lignée et ses sources.
                        </p>
                      </div>
                    ) : (
                      <TreesBuilder
                        key={tree?.id ? `tree-builder-${tree.id}-${displayPeople.length}` : "tree-builder"}
                        people={displayPeople}
                        rawPeople={displayPeople}
                        readOnly={true}
                        canDownloadDirectly={true}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VOLET 2: FICHE & GEDCOM (PERSONNES & DÉTAILS INDIVIDUALS) */}
              {/* ======================================================== */}
              {activeTab === "details" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* TREE FICHE HEADER */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] p-5 text-white border-2 border-[var(--gold)]/70 shadow-2xl relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--gold)]/30 pb-2.5">
                      <span className="text-xs text-amber-200/90 font-mono font-bold uppercase tracking-wider">
                        Fonds Patronyme & Lignée
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-serif font-bold text-amber-100 tracking-wide">{title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">{description}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs pt-1">
                      <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[var(--gold)] shrink-0" />
                        <div>
                          <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">Générations</span>
                          <strong className="text-sm text-white">{generations}</strong>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 flex items-center gap-2">
                        <Users className="h-4 w-4 text-sky-400 shrink-0" />
                        <div>
                          <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">Individus</span>
                          <strong className="text-sm text-white">{membersCount}</strong>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 flex items-center gap-2">
                        <ScrollText className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">Alliances</span>
                          <strong className="text-sm text-white">{treeMetrics.couplesCount}</strong>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-400 shrink-0" />
                        <div>
                          <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">Sources</span>
                          <strong className="text-sm text-white">{treeMetrics.sourcesCount}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PERSONNES DANS L'ARBRE (SELECTION & DETAILS LIKE INDIVIDUALS) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                      <h4 className="font-serif text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                        <Users className="h-4 w-4 text-[var(--gold)]" />
                        <span>Personnes de l'Arbre & Fiches Détaillées</span>
                      </h4>
                      <span className="text-xs font-mono text-[var(--muted-foreground)]">
                        Cliquez pour inspecter en 3D
                      </span>
                    </div>

                    {/* SPLIT VIEW: PERSONS LIST (LEFT) & SELECTED PERSON DETAIL LIKE INDIVIDUALS (RIGHT) */}
                    {loadingGedcom && displayPeople.length === 0 ? (
                      <div className="p-8 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted-foreground)] flex items-center justify-center gap-2">
                        <RefreshCcw className="h-4 w-4 text-[var(--gold)] animate-spin" />
                        <span>Chargement des individus de l&apos;arbre...</span>
                      </div>
                    ) : displayPeople.length === 0 ? (
                      <div className="p-8 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted-foreground)] space-y-2">
                        <Users className="h-7 w-7 text-[var(--gold)]/60 mx-auto" />
                        <div className="font-semibold text-[var(--foreground)]">Aucun individu répertorié dans cet arbre pour le moment.</div>
                        <p>Aucune fiche personnelle ni source GEDCOM n&apos;est encore associée à cet arbre.</p>
                      </div>
                    ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      
                      {/* PERSONS ROSTER COLUMN */}
                      <div className="lg:col-span-5 space-y-1.5 sm:space-y-2 max-h-[220px] sm:max-h-[320px] lg:max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                        {displayPeople.map((p: any, idx: number) => {
                          const pName = nameOf(p);
                          const pBirth = p.birthYear || p.birthDate;
                          const isFem = (p.gender || "").toUpperCase().startsWith("F");
                          const isSelected = (currentPerson?.id === p.id);
                          const role = idx === 0 ? "Fondateur / Membre" : isFem && p.spouse ? "Conjointe" : p.father || p.mother ? "Enfant" : "Membre de la lignée";

                          return (
                            <div
                              key={p.id || idx}
                              onClick={() => setSelectedPerson(p)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-[var(--gold)]/15 border-[var(--gold)] shadow-md"
                                  : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--gold)]/50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow ${
                                    isFem ? "bg-rose-600" : "bg-[#0d9488]"
                                  }`}
                                >
                                  {pName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-xs text-[var(--foreground)] truncate">{pName}</div>
                                  <div className="text-[10px] text-[var(--muted-foreground)] font-mono flex items-center gap-1.5">
                                    <span>{role}</span>
                                    {pBirth && <span>• ° {pBirth}</span>}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? "text-[var(--gold)] translate-x-0.5" : "text-[var(--muted-foreground)]"}`} />
                            </div>
                          );
                        })}
                      </div>

                      {/* SELECTED PERSON DETAIL CARD (MATCHING OPEN DETAILS MODAL) */}
                      <div className="lg:col-span-7">
                        {currentPerson ? (
                          <div className="p-4 sm:p-5 rounded-2xl border border-[var(--gold)]/40 bg-[var(--background)] shadow-xl space-y-4">
                            {/* 3D TILT PERSON CARD */}
                            <div
                              ref={personSurfaceRef}
                              onMouseMove={updatePersonTilt}
                              onMouseLeave={resetPersonTilt}
                              className="space-y-3 p-5 rounded-xl border border-[var(--gold)]/30 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] text-white transition-transform duration-200 shadow-2xl relative overflow-hidden"
                              style={{
                                transform: `perspective(1000px) rotateX(${personTilt.y}deg) rotateY(${personTilt.x}deg) scale(${
                                  personTilt.active ? 1.01 : 1
                                })`,
                                transformStyle: "preserve-3d",
                              }}
                            >
                              <div className="flex items-center justify-between text-xs border-b border-[var(--gold)]/20 pb-2">
                                <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--gold)] flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  <span>Fiche Personne • ID: {currentPerson.id}</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[0.65rem] flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Dossier Individu</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-3 pt-1">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md border-2 border-[var(--gold)]/50 ${
                                    (currentPerson.gender || "").toUpperCase().startsWith("F") ? "bg-rose-600" : "bg-[#0d9488]"
                                  }`}
                                >
                                  {nameOf(currentPerson).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-serif text-lg font-bold text-amber-100">
                                    {nameOf(currentPerson)}
                                  </h4>
                                  <p className="text-xs text-[var(--gold)] font-medium flex items-center gap-1 mt-0.5">
                                    <Briefcase className="h-3 w-3" />
                                    <span>{currentPerson.profession || currentPerson.occupation || "Profession non précisée"}</span>
                                  </p>
                                </div>
                              </div>

                              {/* VITAL DATES GRID */}
                              <div className="grid grid-cols-2 gap-2 text-xs pt-2 font-mono">
                                <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 space-y-0.5">
                                  <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">Naissance</span>
                                  <strong className="text-white block">
                                    {(currentPerson.birthYear || currentPerson.birthDate) ? `° ${currentPerson.birthYear || currentPerson.birthDate}` : "Date non précisée"}
                                  </strong>
                                  <span className="text-slate-300 block text-[11px] truncate">
                                    {currentPerson.birthPlace || "—"}
                                  </span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 space-y-0.5">
                                  <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">Décès</span>
                                  <strong className="text-white block">
                                    {(currentPerson.deathDate || currentPerson.deathYear) ? `+ ${currentPerson.deathDate || currentPerson.deathYear}` : "Non répertorié"}
                                  </strong>
                                  <span className="text-slate-300 block text-[11px] truncate">
                                    {currentPerson.deathPlace || "—"}
                                  </span>
                                </div>
                              </div>

                              <div className="text-[10px] uppercase tracking-[0.2em] text-center text-slate-400 pt-1">
                                Glissez pour faire pivoter la carte en 3D
                              </div>
                            </div>

                            {/* RELATIONS DE FAMILLE */}
                            <div className="space-y-2 pt-1 text-xs">
                              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--gold)] block">
                                Filiation & Famille Directe
                              </span>
                              <div className="grid grid-cols-2 gap-2 font-mono">
                                <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                                  <span className="text-[10px] text-[var(--muted-foreground)] block">Père déclaré</span>
                                  <span className="font-semibold text-[var(--foreground)] truncate block">
                                    {currentPerson.father
                                      ? nameOf(displayPeople.find((x: any) => String(x.id) === String(currentPerson.father))) || `ID: ${currentPerson.father}`
                                      : "Non renseigné"}
                                  </span>
                                </div>
                                <div className="p-2 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                                  <span className="text-[10px] text-[var(--muted-foreground)] block">Mère déclarée</span>
                                  <span className="font-semibold text-[var(--foreground)] truncate block">
                                    {currentPerson.mother
                                      ? nameOf(displayPeople.find((x: any) => String(x.id) === String(currentPerson.mother))) || `ID: ${currentPerson.mother}`
                                      : "Non renseigné"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* ARCHIVAL CITATION & DETAILS (EXACTLY AS IN OPEN DETAILS MODAL) */}
                            {(cleanArchText(currentPerson.archiveSource) || cleanArchText(currentPerson.documentCode) || cleanArchText(currentPerson.reliability) || currentPerson.details) && (
                              <div className="space-y-2 pt-1 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {cleanArchText(currentPerson.archiveSource) && (
                                    <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] sm:col-span-2">
                                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--muted-foreground)] block">Source d&apos;archive</span>
                                      <span className="text-xs font-medium text-[var(--foreground)] break-words">
                                        {cleanArchText(currentPerson.archiveSource)}
                                      </span>
                                    </div>
                                  )}
                                  {cleanArchText(currentPerson.documentCode) && (
                                    <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--muted-foreground)] block">Cote du document</span>
                                      <span className="text-xs font-medium text-[var(--foreground)] break-words">
                                        {cleanArchText(currentPerson.documentCode)}
                                      </span>
                                    </div>
                                  )}
                                  {cleanArchText(currentPerson.reliability) && (
                                    <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--muted-foreground)] block">Fiabilité</span>
                                      <span className="text-xs font-medium text-[var(--foreground)]">
                                        {cleanArchText(currentPerson.reliability)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {currentPerson.details && (
                                  <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--muted-foreground)] block">Détails / Biographie</span>
                                    <p className="text-xs text-[var(--foreground)]/90 whitespace-pre-line leading-relaxed mt-0.5">
                                      {currentPerson.details}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* SOURCES & DOCUMENTS SECTION (EXACTLY MATCHING OPEN DETAILS MODAL IN TREES BUILDER) */}
                            <div className="space-y-2.5 pt-3 border-t border-[var(--border)]">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
                                  <Archive className="h-3.5 w-3.5 text-[var(--gold)]" />
                                  <span>Sources & Documents rattachés</span>
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30">
                                  {selectedPersonSources.length} document{selectedPersonSources.length > 1 ? "s" : ""}
                                </span>
                              </div>

                              {selectedPersonSources.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {selectedPersonSources.map((s: any, idx: number) => {
                                    const kind = s.kind || classifySourceLink(s.kind, s.url);
                                    const isAudio = kind === "audio";
                                    const isImg = kind === "image";
                                    const isDoc = kind === "document";

                                    const badge = getSourceKindBadge(kind);

                                    return (
                                      <div
                                        key={`${s.url || s.label}-${idx}`}
                                        className="p-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)] hover:border-[var(--gold)]/70 transition-all flex flex-col gap-2 shadow-sm"
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-md border ${badge.color}`}>
                                            {badge.label}
                                          </span>
                                          {s.url ? (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                openSourceAction({
                                                  url: s.url,
                                                  label: maskSourceLabel(s.label, s.url, kind),
                                                  kind,
                                                  memberName: nameOf(currentPerson),
                                                  archiveSource: cleanArchText(currentPerson?.archiveSource) || undefined,
                                                  documentCode: cleanArchText(currentPerson?.documentCode) || undefined,
                                                  date: currentPerson?.birthYear || currentPerson?.birthDate || "",
                                                  location: currentPerson?.birthPlace || "",
                                                })
                                              }
                                              className="inline-flex items-center gap-1 rounded-lg bg-[var(--gold)]/15 px-2.5 py-1 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/25 transition cursor-pointer shrink-0"
                                            >
                                              <ExternalLink className="h-3 w-3" />
                                              <span>Ouvrir</span>
                                            </button>
                                          ) : null}
                                        </div>

                                        <div className="flex items-center gap-2 min-w-0">
                                          {isImg ? (
                                            <FileText className="h-4 w-4 shrink-0 text-emerald-400" />
                                          ) : isAudio ? (
                                            <Music className="h-4 w-4 shrink-0 text-amber-400" />
                                          ) : isDoc ? (
                                            <FileText className="h-4 w-4 shrink-0 text-blue-400" />
                                          ) : kind === "archive" ? (
                                            <Archive className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                                          ) : (
                                            <Link2 className="h-4 w-4 shrink-0 text-teal-400" />
                                          )}
                                          <span className="font-semibold text-xs text-[var(--foreground)] break-words" title={maskSourceLabel(s.label, s.url, kind)}>
                                            {maskSourceLabel(s.label, s.url, kind)}
                                          </span>
                                        </div>

                                        {isAudio && s.url && (
                                          <audio controls src={s.url} className="w-full h-8 mt-1 rounded-md" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="p-3.5 rounded-xl border border-dashed border-[var(--border)] text-xs text-[var(--muted-foreground)] italic flex items-center gap-2">
                                  <Archive className="h-4 w-4 opacity-50 shrink-0" />
                                  <span>Aucune source ni document rattaché à cet individu pour le moment.</span>
                                </div>
                              )}
                            </div>

                            {/* SHORTCUT ACTIONS */}
                            <div className="pt-2 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => setActiveTab("sources")}
                                className="btn-base btn-outline text-xs py-2 px-3 flex items-center gap-2 cursor-pointer hover:border-[var(--gold)] hover:text-[var(--gold)]"
                              >
                                <FileText className="h-3.5 w-3.5 text-[var(--gold)]" />
                                <span>Voir l&apos;ensemble des sources</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setActiveTab("schema")}
                                className="btn-base btn-gold text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                              >
                                <GitBranch className="h-3.5 w-3.5" />
                                <span>Situer dans l&apos;arbre</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
                            Sélectionnez un individu à gauche pour inspecter sa fiche complète.
                          </div>
                        )}
                      </div>
                    </div>
                    )}
                  </div>

                  {/* GEDCOM EXPORT ACTION */}
                  <div className="p-4 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-start">
                      <h5 className="font-serif text-sm font-bold text-[var(--foreground)] flex items-center gap-2 justify-center sm:justify-start">
                        <FileCode className="h-4 w-4 text-[var(--gold)]" />
                        <span>Téléchargement GEDCOM 5.5.1 Conforme</span>
                      </h5>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Format standard ouvert interopérable avec tous les logiciels de généalogie (Gramps, Heredis).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadGedcom}
                      className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
                    >
                      <Download className="h-4 w-4" />
                      <span>Télécharger le Fichier .GED</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* VOLET 3: APERÇU DES SOURCES (CONFORME OPEN DETAILS MODAL)*/}
              {/* ======================================================== */}
              {activeTab === "sources" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* VOLET 3 HEADER BAR WITH DIRECT TREE LINK */}
                  <div className="p-3.5 sm:p-4 rounded-xl border border-[var(--gold)]/35 bg-[var(--background)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-base sm:text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[var(--gold)]" />
                        <span>Aperçu des Sources & Documents Réels</span>
                      </h4>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Documents, archives et liens probatoires rattachés aux individus dans l'arbre généalogique.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                        {allMemberSources.length} document{allMemberSources.length > 1 ? "s" : ""} rattaché{allMemberSources.length > 1 ? "s" : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("schema")}
                        className="btn-base btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm font-semibold"
                        title="Situer dans le schéma de l'arbre interactif"
                      >
                        <GitBranch className="h-3.5 w-3.5" />
                        <span>Voir l'Arbre</span>
                      </button>
                    </div>
                  </div>

                  {/* CASE 0: LOADING GEDCOM SOURCES */}
                  {loadingGedcom && displayPeople.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)]/60 text-center space-y-3">
                      <RefreshCcw className="h-7 w-7 text-[var(--gold)] mx-auto animate-spin" />
                      <p className="text-xs font-mono text-[var(--muted-foreground)]">
                        Analyse des sources liées aux fiches de l&apos;arbre...
                      </p>
                    </div>
                  ) : allMemberSources.length === 0 ? (
                    /* CASE 1: TREE HAS ZERO SOURCES LINKED TO ANY INDIVIDUAL */
                    <div className="p-6 sm:p-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)]/60 text-center space-y-4">
                      <div className="w-14 h-14 mx-auto rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)]">
                        <Archive className="h-7 w-7 opacity-80" />
                      </div>
                      <div className="space-y-1.5 max-w-lg mx-auto">
                        <h4 className="font-serif text-lg font-bold text-[var(--foreground)]">
                          {displayPeople.length === 0
                            ? "Aucun individu ni source liée dans cet arbre"
                            : "Aucune source ni document lié pour cet arbre"}
                        </h4>
                        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                          {displayPeople.length === 0 ? (
                            <>Cet arbre ne contient encore aucun individu enregistré ni aucune source rattachée dans l&apos;éditeur.</>
                          ) : (
                            <>
                              Cet arbre compte <strong>{membersCount} individu{membersCount > 1 ? "s" : ""}</strong> et <strong>{generations} génération{generations > 1 ? "s" : ""}</strong>. Aucun document, image, audio ou lien de source n&apos;est rattaché dans la fenêtre <em>Open details</em> de ces individus.
                            </>
                          )}
                        </p>
                      </div>

                      {/* INDIVIDUAL STATUS BREAKDOWN LIST */}
                      {displayPeople.length > 0 && (
                        <div className="pt-2 max-w-md mx-auto space-y-2 text-start">
                          <div className="text-[10px] uppercase font-mono font-bold text-[var(--muted-foreground)] tracking-wider px-1">
                            État des individus répertoriés ({displayPeople.length}) :
                          </div>
                          <div className="space-y-1.5">
                            {displayPeople.map((person: any, idx: number) => {
                              const pName = nameOf(person);
                              const isFem = (person.gender || "").toUpperCase().startsWith("F");

                              return (
                                <button
                                  key={person.id || idx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedPerson(person);
                                    setActiveTab("details");
                                  }}
                                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:border-[var(--gold)]/60 text-xs transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                                        isFem ? "bg-rose-600" : "bg-[#0d9488]"
                                      }`}
                                    >
                                      <User className="h-3 w-3" />
                                    </div>
                                    <span className="font-semibold truncate text-[var(--foreground)]">{pName}</span>
                                  </div>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-500/10 text-[var(--muted-foreground)] border border-[var(--border)] shrink-0">
                                    0 source liée
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="pt-3 flex items-center justify-center gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setActiveTab("schema")}
                          className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm font-semibold"
                        >
                          <GitBranch className="h-3.5 w-3.5" />
                          <span>Explorer le Schéma Graphique</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("details")}
                          className="btn-base btn-outline text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
                        >
                          <User className="h-3.5 w-3.5 text-[var(--gold)]" />
                          <span>Inspecter les Fiches & GEDCOM</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* CASE 2: REAL SOURCES EXIST FOR AT LEAST ONE INDIVIDUAL (DISPLAYED LIKE OPEN DETAILS MODAL) */
                    <div className="space-y-4">
                      {/* MEMBER FILTER PILLS BAR */}
                      {displayPeople.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar text-xs">
                          <span className="text-[11px] font-mono font-bold text-[var(--muted-foreground)] uppercase shrink-0 flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-[var(--gold)]" />
                            <span>Membre :</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => setSelectedSourceMemberId("all")}
                            className={`px-3 py-1 rounded-full font-mono text-xs font-semibold shrink-0 transition-all border cursor-pointer ${
                              selectedSourceMemberId === "all"
                                ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-sm font-bold"
                                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/50"
                            }`}
                          >
                            Tous les membres ({allMemberSources.length})
                          </button>

                          {displayPeople.map((person: any, idx: number) => {
                            const pId = String(person.id ?? `@I${idx + 1}@`);
                            const pName = nameOf(person);
                            const pCount = allMemberSources.filter((d) => d.memberId === pId).length;
                            const isFem = (person.gender || "").toUpperCase().startsWith("F");

                            return (
                              <button
                                key={pId}
                                type="button"
                                onClick={() => setSelectedSourceMemberId(pId)}
                                className={`px-3 py-1 rounded-full font-mono text-xs font-semibold shrink-0 transition-all border cursor-pointer flex items-center gap-1.5 ${
                                  selectedSourceMemberId === pId
                                    ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-sm font-bold"
                                    : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/50"
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    selectedSourceMemberId === pId ? "bg-black" : isFem ? "bg-rose-500" : "bg-emerald-500"
                                  }`}
                                />
                                <span className="truncate max-w-[140px]">{pName}</span>
                                <span
                                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedSourceMemberId === pId
                                      ? "bg-black/20 text-black font-bold"
                                      : "bg-[var(--border)] text-[var(--muted-foreground)]"
                                  }`}
                                >
                                  {pCount}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* SOURCES LIST GRID MATCHING OPEN DETAILS MODAL CARDS (NO UNRELATED COVER PHOTOS) */}
                      {filteredMemberSources.length === 0 ? (
                        <div className="p-8 rounded-xl border border-dashed border-[var(--border)] text-center text-xs text-[var(--muted-foreground)] space-y-3">
                          <FileText className="h-8 w-8 text-[var(--gold)] mx-auto opacity-70" />
                          <p>Aucune source rattachée à ce membre dans sa fenêtre Open details.</p>
                          <button
                            type="button"
                            onClick={() => setSelectedSourceMemberId("all")}
                            className="btn-base btn-gold text-xs py-1.5 px-3 mx-auto cursor-pointer"
                          >
                            Afficher toutes les sources de l&apos;arbre ({allMemberSources.length})
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pb-2">
                          {filteredMemberSources.map((doc) => {
                            const badge = getSourceKindBadge(doc.kind);
                            const isImg = doc.kind === "image";
                            const isAudio = doc.kind === "audio";
                            const isDoc = doc.kind === "document";
                            const linkedMember = displayPeople.find((p: any) => String(p.id) === String(doc.memberId));

                            return (
                              <div
                                key={doc.id}
                                className="rounded-xl border border-[var(--gold)]/30 hover:border-[var(--gold)]/70 bg-[var(--card)] p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 text-start"
                              >
                                <div className="space-y-3">
                                  {/* Badge bar + Direct Open Button (exactly as in Open Details modal) */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider border ${badge.color}`}>
                                        {badge.label}
                                      </span>
                                      {doc.documentCode && (
                                        <span className="text-[10px] font-mono font-bold text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded border border-[var(--gold)]/30 truncate max-w-[160px]">
                                          {doc.documentCode}
                                        </span>
                                      )}
                                    </div>
                                    {doc.url ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openSourceAction({
                                            url: doc.url,
                                            label: doc.label,
                                            kind: doc.kind,
                                            memberName: doc.memberName,
                                            archiveSource: doc.archiveSource,
                                            documentCode: doc.documentCode,
                                          })
                                        }
                                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--gold)]/15 px-2.5 py-1 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/25 transition cursor-pointer shrink-0"
                                        title="Ouvrir cette source"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        <span>Ouvrir</span>
                                      </button>
                                    ) : null}
                                  </div>

                                  {/* Linked Member Strip */}
                                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--background)]/80 border border-[var(--border)]">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                                        (doc.gender || "").toUpperCase().startsWith("F")
                                          ? "bg-rose-600"
                                          : "bg-[#0d9488]"
                                      }`}
                                    >
                                      <User className="h-3 w-3" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[10px] uppercase font-mono font-bold text-[var(--muted-foreground)] leading-none">
                                        Membre rattaché
                                      </div>
                                      <div className="text-xs font-bold text-[var(--foreground)] truncate font-serif mt-0.5">
                                        {doc.memberName}
                                      </div>
                                    </div>
                                    {doc.memberRole && (
                                      <span className="text-[10px] font-mono text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded border border-[var(--gold)]/30 shrink-0 max-w-[130px] truncate">
                                        {doc.memberRole}
                                      </span>
                                    )}
                                  </div>

                                  {/* Source Card Body (Exact Open Details Layout: Icon + Label + Optional Audio Player) */}
                                  <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] space-y-2">
                                    <div className="flex items-start gap-2.5 min-w-0">
                                      <div className="p-1.5 rounded-md bg-[var(--gold)]/10 shrink-0 mt-0.5">
                                        {isImg ? (
                                          <FileText className="h-4 w-4 text-emerald-400" />
                                        ) : isAudio ? (
                                          <Music className="h-4 w-4 text-amber-400" />
                                        ) : isDoc ? (
                                          <FileText className="h-4 w-4 text-blue-400" />
                                        ) : doc.kind === "archive" ? (
                                          <Archive className="h-4 w-4 text-[var(--gold)]" />
                                        ) : (
                                          <Link2 className="h-4 w-4 text-teal-400" />
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs font-semibold text-[var(--foreground)] break-words leading-snug">
                                          {doc.label}
                                        </div>
                                        {doc.archiveSource && !doc.label.includes(doc.archiveSource) && (
                                          <div className="text-[11px] text-[var(--muted-foreground)] font-mono break-words mt-1">
                                            {doc.archiveSource}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {isAudio && doc.url && (
                                      <audio controls src={doc.url} className="w-full h-8 mt-1 rounded-md" />
                                    )}
                                  </div>

                                  {/* Reliability & Details if present on individual */}
                                  {doc.reliability && (
                                    <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                                      <ShieldCheck className="h-3 w-3 shrink-0" />
                                      <span>Fiabilité : {doc.reliability}</span>
                                    </div>
                                  )}
                                  {doc.details && (
                                    <p className="text-xs text-[var(--foreground)]/80 leading-relaxed font-light line-clamp-2">
                                      {doc.details}
                                    </p>
                                  )}
                                </div>

                                {/* Footer Controls */}
                                <div className="pt-2.5 border-t border-[var(--border)] flex items-center gap-2">
                                  {doc.url ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openSourceAction({
                                          url: doc.url,
                                          label: doc.label,
                                          kind: doc.kind,
                                          memberName: doc.memberName,
                                          archiveSource: doc.archiveSource,
                                          documentCode: doc.documentCode,
                                        })
                                      }
                                      className="btn-base btn-gold flex-1 text-xs py-1.5 px-3 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm font-semibold"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      <span>Ouvrir la source</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (linkedMember) setSelectedPerson(linkedMember);
                                        setActiveTab("details");
                                      }}
                                      className="btn-base btn-outline flex-1 text-xs py-1.5 px-3 flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <User className="h-3.5 w-3.5 text-[var(--gold)]" />
                                      <span>Voir la fiche</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (linkedMember) setSelectedPerson(linkedMember);
                                      setActiveTab("schema");
                                    }}
                                    className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/15 text-[var(--gold)] transition-colors cursor-pointer shrink-0"
                                    title="Situer ce membre dans l'arbre interactif"
                                  >
                                    <GitBranch className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PREVIEW MODAL (EXACTLY MATCHING TREES BUILDER DETAILS PREVIEW)            */}
        {/* ========================================================================= */}
        {previewSource && (
          <div
            className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            onClick={() => setPreviewSource(null)}
          >
            <div
              className="flex max-h-[88vh] w-full max-w-[850px] flex-col overflow-hidden rounded-2xl border border-[var(--gold)]/50 bg-[var(--card)] text-[var(--foreground)] shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4 bg-[var(--background)]/90 backdrop-blur-md">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-md bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/35">
                      {previewSource.kind || "SOURCE D'ARCHIVES"}
                    </span>
                    {previewSource.cote && (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-stone-800 text-amber-200 border border-[var(--gold)]/30">
                        {previewSource.cote}
                      </span>
                    )}
                    {previewSource.memberName && (
                      <span className="text-xs font-mono text-[var(--gold)] flex items-center gap-1 font-semibold">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="truncate">{previewSource.memberName}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--foreground)] tracking-wide leading-snug">
                    {maskSourceLabel(previewSource.label, previewSource.url, previewSource.kind)}
                  </h3>
                  {/* Clean Archival Citation - NO raw /assets/gallery/... file path */}
                  <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2 flex-wrap font-mono">
                    {previewSource.repository && (
                      <span className="flex items-center gap-1 truncate max-w-[320px]">
                        <Building className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="truncate">{previewSource.repository}</span>
                      </span>
                    )}
                    {previewSource.date && (
                      <span className="flex items-center gap-1 shrink-0">
                        <span>•</span>
                        <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{previewSource.date}</span>
                        {previewSource.location && <span>({previewSource.location})</span>}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Archive Certifiée</span>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewSource(null)}
                  className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-red-500 hover:bg-black/10 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-red-500/30"
                  title="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center justify-center p-6 bg-[var(--background)]/40">
                {previewSource.kind === "image" || /\.(png|jpe?g|gif|webp)$/i.test(previewSource.url) ? (
                  <img
                    src={previewSource.url}
                    alt={previewSource.label}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-md border border-[var(--gold)]/30 bg-stone-950"
                  />
                ) : previewSource.kind === "audio" || /\.(mp3|wav|ogg|m4a)$/i.test(previewSource.url) ? (
                  <div className="text-center p-6 bg-[var(--card)] rounded-xl border border-[var(--gold)]/30 w-full max-w-md shadow-md">
                    <Music className="w-16 h-16 text-[var(--gold)] mx-auto mb-4 animate-pulse" />
                    <p className="text-sm font-semibold mb-3">{maskSourceLabel(previewSource.label, previewSource.url, previewSource.kind)}</p>
                    <audio controls src={previewSource.url} className="w-full" autoPlay />
                  </div>
                ) : previewSource.url.toLowerCase().endsWith(".pdf") || previewSource.kind === "document" || previewSource.kind === "book" ? (
                  <div className="w-full h-full min-h-[48vh] flex flex-col">
                    <iframe
                      src={previewSource.url}
                      title={maskSourceLabel(previewSource.label, previewSource.url, previewSource.kind)}
                      className="w-full flex-1 min-h-[45vh] border border-[var(--gold)]/30 rounded-lg bg-white"
                    />
                  </div>
                ) : (
                  <div className="text-center p-8 bg-[var(--card)] rounded-xl border border-[var(--gold)]/30 max-w-md">
                    <FileText className="w-16 h-16 text-[var(--gold)] mx-auto mb-4" />
                    <p className="text-sm font-semibold mb-2">{maskSourceLabel(previewSource.label, previewSource.url, previewSource.kind)}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mb-4">
                      Pièce d'archives officielle ou document externe. Cliquez ci-dessous pour ouvrir en plein écran.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3.5 bg-[var(--background)]/60">
                <button
                  type="button"
                  onClick={() => {
                    const memberName = previewSource.memberName;
                    setPreviewSource(null);
                    setActiveTab("schema");
                    if (memberName) {
                      const found = displayPeople.find((p: any) => {
                        const nm = nameOf(p);
                        return nm && (nm === memberName || memberName.includes(nm));
                      });
                      if (found) setSelectedPerson(found);
                    }
                  }}
                  className="btn-base btn-outline text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  <GitBranch className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Voir dans l'Arbre</span>
                </button>

                <div className="flex items-center gap-2">
                  {previewSource.url ? (
                    <button
                      type="button"
                      onClick={() => handleSafeDownloadOrOpen(previewSource.url, previewSource.label)}
                      className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger le Document</span>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setPreviewSource(null)}
                    className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2.5 sm:pt-3 border-t border-[var(--border)] shrink-0">
          <button
            onClick={handleDownloadGedcom}
            className="btn-base btn-gold text-xs py-2 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            <span>{isIndividualModal ? t("download_profile_extract", "Télécharger l'extrait") : t("download_gedcom", "Télécharger GEDCOM 5.5.1")}</span>
          </button>

          <button
            onClick={onClose}
            className="btn-base btn-outline-ink text-xs py-2 px-5 cursor-pointer w-full sm:w-auto text-center"
          >
            {t("close_card", "Fermer")}
          </button>
        </div>
      </div>
    </div>
  );
}
