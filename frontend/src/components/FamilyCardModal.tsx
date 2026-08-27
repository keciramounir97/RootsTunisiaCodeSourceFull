import React, { useState, useMemo, useEffect, useRef } from "react";
import { X, GitBranch, Users, Layers, Download, FileCode, Sparkles, CheckCircle2, AlertCircle, User, ShieldCheck, MapPin, Landmark, Clock, RefreshCcw, Briefcase, FileText, Link2, ExternalLink } from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import TreesBuilder, { parseGedcom, parseGedcomX } from "../admin/components/TreesBuilder";

interface FamilyCardModalProps {
  tree?: any;
  individual?: any;
  onClose: () => void;
}

export default function FamilyCardModal({ tree, individual, onClose }: FamilyCardModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"schema" | "details">("schema");
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [fetchedPeople, setFetchedPeople] = useState<any[] | null>(null);
  const [loadingGedcom, setLoadingGedcom] = useState(false);

  // 3D Card Tilt State for Individual Modal (matching admin page Individuals.tsx)
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

  const isIndividualModal = Boolean(individual && !tree);

  // Extract Tree / Individual metadata
  const indName = individual ? `${individual.first_name || individual.firstName || ''} ${individual.last_name || individual.lastName || individual.surname || ''}`.trim() : "";
  const title = tree?.name || tree?.title || indName || "Roots Tunisia Lineage";
  const governorate = tree?.governorate || tree?.region || individual?.birth_place || individual?.birthPlace || "Tunisia";
  const rawPeopleList = Array.isArray(tree?.people) ? tree.people : (individual ? [individual] : []);
  const description = tree?.description || tree?.notes || tree?.provenance || "Notice généalogique documentée conservée dans le catalogue des archives de Tunisie.";

  // Initial synchronous check if GEDCOM text is already attached to tree object
  useEffect(() => {
    if (isIndividualModal) return;
    const rawContent = tree?.gedcom_text || tree?.content || tree?.gedcom_data || tree?.gedcom || tree?.gedcomText;
    if (typeof rawContent === "string" && rawContent.trim().length > 10) {
      try {
        const isGedcomX = (tree?.data_format || "gedcom") === "gedcomx" || /^\s*(\{|\<\?xml)/.test(rawContent);
        const parsed = isGedcomX ? parseGedcomX(rawContent) : parseGedcom(rawContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFetchedPeople(parsed);
        }
      } catch (e) {
        console.warn("Error parsing pre-loaded tree GEDCOM text:", e);
      }
    }
  }, [tree?.id, tree?.gedcom_text, tree?.content, tree?.gedcom_data, tree?.gedcomText, isIndividualModal]);

  // Dynamically fetch exact GEDCOM data for DB trees so schema matches Tree Builder 100%
  useEffect(() => {
    if (isIndividualModal) return;
    const targetTreeId = tree?.id;
    if (!targetTreeId) return;

    let isMounted = true;
    setLoadingGedcom(true);

    (async () => {
      try {
        // Try raw GEDCOM text endpoints (matching admin Trees.tsx)
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

        const rawText = typeof res?.data === "string"
          ? res.data
          : (res?.data && (res.data as any).data != null ? String((res.data as any).data) : "");

        if (rawText && rawText.trim().length > 10 && isMounted) {
          const isGedcomX = (tree?.data_format || "gedcom") === "gedcomx" || /^\s*(\{|\<\?xml)/.test(rawText);
          const parsed = isGedcomX ? parseGedcomX(rawText) : parseGedcom(rawText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFetchedPeople(parsed);
            setLoadingGedcom(false);
            return;
          }
        }

        // Secondary fallback: GET /trees/:id object
        try {
          const treeObjRes = await api.get(`/trees/${targetTreeId}`);
          const treeObj = treeObjRes?.data?.data || treeObjRes?.data;
          if (treeObj && isMounted) {
            const gedText = treeObj.gedcom_text || treeObj.content || treeObj.gedcom_data;
            if (typeof gedText === "string" && gedText.trim().length > 10) {
              const isGedX = treeObj.data_format === "gedcomx" || /^\s*(\{|\<\?xml)/.test(gedText);
              const parsed = isGedX ? parseGedcomX(gedText) : parseGedcom(gedText);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setFetchedPeople(parsed);
                setLoadingGedcom(false);
                return;
              }
            }
            if (Array.isArray(treeObj.people) && treeObj.people.length > 0) {
              setFetchedPeople(treeObj.people);
            }
          }
        } catch {
          // Ignore
        }
      } catch (err) {
        console.warn("Could not fetch GEDCOM schema for modal:", err);
      } finally {
        if (isMounted) setLoadingGedcom(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [tree?.id, tree?.data_format, isIndividualModal]);

  // Compute final linked graph nodes for D3 Tree Builder canvas
  const displayPeople = useMemo(() => {
    // 1. Direct parsed GEDCOM array (exact match with admin TreeBuilder!)
    if (fetchedPeople && fetchedPeople.length > 0) {
      return fetchedPeople;
    }

    // 2. DB people list normalization with linked relationship mapping
    let list = [...rawPeopleList];

    if (list.length > 0 && typeof list[0] === 'object' && (list[0].id != null || list[0].first_name || list[0].firstName)) {
      return list.map((p: any, idx: number) => {
        const id = p.id != null ? String(p.id) : `@I${idx + 1}@`;
        const given = p.first_name || p.firstName || p.given || "Individu";
        const surname = p.last_name || p.lastName || p.surname || "";
        const fullName = `${given} ${surname}`.trim();
        const father = p.father || p.father_id || p.fatherId ? String(p.father || p.father_id || p.fatherId) : null;
        const mother = p.mother || p.mother_id || p.motherId ? String(p.mother || p.mother_id || p.motherId) : null;
        const spouse = p.spouse || p.spouse_id || p.spouseId ? String(p.spouse || p.spouse_id || p.spouseId) : null;
        const children = Array.isArray(p.children) ? p.children.map(String) : [];

        return {
          ...p,
          id,
          given,
          surname,
          names: { fr: fullName, en: fullName },
          gender: (p.gender || "M").toUpperCase().startsWith("F") ? "F" : "M",
          birthDate: p.birth_date || p.birthDate || p.birthYear || "",
          birthPlace: p.birth_place || p.birthPlace || "",
          deathDate: p.death_date || p.deathDate || p.deathYear || "",
          deathPlace: p.death_place || p.deathPlace || "",
          occupation: p.occupation || p.profession || "",
          father,
          mother,
          spouse,
          children,
        };
      });
    }

    // 3. Linked sample lineage graph fallback (Father + Mother couple, connected to Child)
    const p1Id = "p1";
    const p2Id = "p2";
    const p3Id = "p3";

    return [
      {
        id: p1Id,
        given: title,
        surname: "Patrimoine",
        names: { fr: `${title} (Patrimoine)`, en: title },
        gender: "M",
        birthDate: "1880",
        birthPlace: governorate,
        spouse: p2Id,
        children: [p3Id],
      },
      {
        id: p2Id,
        given: "Lalla Fatma",
        surname: title,
        names: { fr: `Lalla Fatma ${title}`, en: `Lalla Fatma ${title}` },
        gender: "F",
        birthDate: "1885",
        birthPlace: governorate,
        spouse: p1Id,
        children: [p3Id],
      },
      {
        id: p3Id,
        given: "Sidi Mohamed",
        surname: title,
        names: { fr: `Sidi Mohamed ${title}`, en: `Sidi Mohamed ${title}` },
        gender: "M",
        birthDate: "1915",
        birthPlace: governorate,
        father: p1Id,
        mother: p2Id,
      },
    ];
  }, [rawPeopleList, title, governorate, fetchedPeople]);

  const membersCount = displayPeople.length;
  const generations = tree?.generations ?? (membersCount > 0 ? Math.ceil(Math.log2(membersCount + 1)) : 1);

  const handleDownloadGedcom = async () => {
    if (!tree?.id) {
      const gedcomText = `0 HEAD\n1 SOUR RootsTunisia\n1 GEDC\n2 VERS 5.5.1\n1 CHAR UTF-8\n0 @I1@ INDI\n1 NAME ${title}\n0 TRLR\n`;
      const blob = new Blob([gedcomText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.ged`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    try {
      window.open(`/api/trees/${tree.id}/gedcom`, "_blank");
    } catch {
      setShowRequestForm(true);
    }
  };

  const handleSubmitDownloadRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setRequestStatus("loading");
      setStatusMessage("");
      await api.post("/download-requests", {
        item_type: tree ? "tree" : "individual",
        item_id: tree?.id || individual?.id || 1,
        reason: requestReason.trim() || "Genealogical lineage research and record verification.",
      });
      setRequestStatus("success");
      setStatusMessage("Demande transmise aux archivistes généalogistes !");
    } catch (err: any) {
      setRequestStatus("error");
      setStatusMessage(err?.response?.data?.message || "La demande est en cours de traitement.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="surface-card frame-gold relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[var(--card)] p-5 sm:p-7 shadow-2xl space-y-5 max-h-[94vh] overflow-y-auto border-2 border-[var(--gold)]/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-[var(--background)] p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/20 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* MODAL HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--gold)]/30 pb-3 pr-10">
          <div>
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)] flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-[var(--gold)]" />
              <span>{isIndividualModal ? "Carte Fiche Individuelle" : "Carte Généalogique Patrimoniale"}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--foreground)] tracking-wide">
              {title}
            </h2>
          </div>

          {/* Tab Switches (Tree Modal Only) */}
          {!isIndividualModal && (
            <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded-xl border border-[var(--gold)]/40">
              <button
                onClick={() => setActiveTab("schema")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "schema"
                    ? "bg-[var(--gold)] text-black shadow-md font-bold"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <GitBranch className="h-4 w-4" />
                <span>Schéma Graphique de l'Arbre</span>
              </button>

              <button
                onClick={() => setActiveTab("details")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "details"
                    ? "bg-[var(--gold)] text-black shadow-md font-bold"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <FileCode className="h-4 w-4" />
                <span>Fiche & GEDCOM</span>
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* CASE 1: INDIVIDUAL MODAL (EXACT MATCH WITH ADMIN PAGE)  */}
        {/* ======================================================== */}
        {isIndividualModal ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* CARD HERO IDENTICAL TO ADMIN PAGE INDIVIDUALS.TSX */}
            <div className="p-5 rounded-2xl border border-[var(--gold)]/40 bg-gradient-to-br from-[var(--background)] via-[var(--card)] to-[var(--background)] shadow-xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-serif font-bold text-white shadow-md border-2 border-[var(--gold)]/60 ${
                      individual.gender === "F" ? "bg-rose-600" : "bg-[#0d9488]"
                    }`}
                  >
                    {indName ? indName.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[var(--foreground)]">
                      {indName}
                    </h3>
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

              {/* 3D TILT CARD SURFACE */}
              <div
                ref={previewSurfaceRef}
                onMouseMove={updatePreviewTilt}
                onMouseLeave={resetPreviewTilt}
                className="space-y-3 p-5 rounded-xl border border-[var(--gold)]/30 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] text-white transition-transform duration-200 shadow-2xl relative overflow-hidden"
                style={{
                  transform: `perspective(1000px) rotateX(${previewTilt.y}deg) rotateY(${previewTilt.x}deg) scale(${previewTilt.active ? 1.01 : 1})`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none font-serif text-8xl font-bold text-[var(--gold)]">
                  جذور
                </div>

                <div className="flex items-center justify-between text-xs border-b border-[var(--gold)]/20 pb-2">
                  <span className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--gold)] flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>Carte Individuelle 3D</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[0.65rem] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Document Registré</span>
                  </span>
                </div>

                {/* VITAL INFORMATION GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 font-mono">
                  <div className="p-3 rounded-lg bg-black/40 border border-[var(--gold)]/30 space-y-1">
                    <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">Naissance</span>
                    <span className="font-bold text-white block flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>{individual.birth_date || individual.birthDate || "Date inconnue"}</span>
                    </span>
                    <span className="text-slate-300 block text-[11px] flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[var(--gold)]" />
                      <span>{individual.birth_place || individual.birthPlace || governorate}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-[var(--gold)]/30 space-y-1">
                    <span className="text-[0.65rem] text-slate-400 block uppercase font-bold">Décès</span>
                    <span className="font-bold text-white block flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{individual.death_date || individual.deathDate || "Vivant / Non répertorié"}</span>
                    </span>
                    <span className="text-slate-300 block text-[11px] flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[var(--gold)]" />
                      <span>{individual.death_place || individual.deathPlace || "N/A"}</span>
                    </span>
                  </div>
                </div>

                {/* NOTES / DETAILS */}
                {individual.details && (
                  <div className="pt-1">
                    <span className="text-[0.65rem] text-slate-400 uppercase font-bold block mb-1">Notice & Détails</span>
                    <p className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg border border-[var(--gold)]/20 leading-relaxed font-light">
                      {individual.details}
                    </p>
                  </div>
                )}

                <div className="text-[10px] uppercase tracking-[0.2em] text-center text-slate-400 pt-1">
                  Survolez la carte avec la souris pour faire pivoter en 3D
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* CASE 2: TREE MODAL (LINKED D3 CARDS SCHEMA & DETAILS)    */
          /* ======================================================== */
          <>
            {/* TAB 1: INTERACTIVE D3 LINKED CARDS SCHEMA */}
            {activeTab === "schema" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] font-mono px-1">
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="h-4 w-4 text-[var(--gold)]" />
                    <span>Schéma interactif d'arborescence (Molette pour Zoom, Glisser pour Pan)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {loadingGedcom && (
                      <span className="text-[0.68rem] text-[var(--gold)] animate-pulse flex items-center gap-1">
                        <RefreshCcw className="h-3 w-3 animate-spin" /> Chargement GEDCOM...
                      </span>
                    )}
                    <span className="bg-[var(--gold)]/10 text-[var(--gold)] px-2.5 py-0.5 rounded-full font-bold">
                      {displayPeople.length} Cartes Liées
                    </span>
                  </div>
                </div>

                <div className="h-[540px] sm:h-[600px] w-full rounded-xl overflow-hidden border-2 border-[var(--gold)]/60 relative bg-[#0b1726] shadow-2xl">
                  <TreesBuilder
                    people={displayPeople}
                    rawPeople={displayPeople}
                    readOnly={true}
                    canDownloadDirectly={true}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: TREE FICHE & GEDCOM ACCESS */}
            {activeTab === "details" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="perspective-1000">
                  <div className="transform-gpu transition-all duration-500 rounded-xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] p-6 text-white border-2 border-[var(--gold)]/70 shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none font-serif text-9xl font-bold text-[var(--gold)]">
                      جذور
                    </div>

                    <div className="flex items-center justify-between border-b border-[var(--gold)]/30 pb-3">
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)] flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" />
                        <span>{governorate}</span>
                      </span>
                      <span className="px-3 py-0.5 rounded-full text-[0.65rem] font-mono font-bold bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40">
                        GEDCOM 5.5.1 UTF-8
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <h3 className="text-2xl font-serif font-bold text-amber-100 tracking-wide">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {description}
                      </p>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 flex items-center gap-2">
                          <Layers className="h-4 w-4 text-[var(--gold)]" />
                          <div>
                            <span className="text-[0.65rem] text-slate-400 block uppercase">Générations</span>
                            <strong className="text-sm text-white">{generations}</strong>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 flex items-center gap-2">
                          <Users className="h-4 w-4 text-[var(--gold)]" />
                          <div>
                            <span className="text-[0.65rem] text-slate-400 block uppercase">Personnes</span>
                            <strong className="text-sm text-white">{membersCount}</strong>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-black/40 border border-[var(--gold)]/30 flex items-center gap-2 col-span-2 sm:col-span-1">
                          <FileCode className="h-4 w-4 text-teal-400" />
                          <div>
                            <span className="text-[0.65rem] text-slate-400 block uppercase">Registre</span>
                            <strong className="text-xs text-teal-300">Archives Tunisiennes</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* GEDCOM / ACCESS REQUEST FORM */}
        {showRequestForm && (
          <form onSubmit={handleSubmitDownloadRequest} className="space-y-3 p-4 rounded-xl bg-[var(--background)] border border-[var(--gold)]/40 animate-in fade-in">
            <h4 className="font-semibold text-xs text-[var(--foreground)] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
              <span>Demande d'Accès aux Archives ({isIndividualModal ? "Individu" : "Arbre"})</span>
            </h4>
            <textarea
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Indiquez le motif de votre recherche généalogique..."
              className="w-full p-2.5 text-xs rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              rows={2}
            />
            <button
              type="submit"
              disabled={requestStatus === "loading"}
              className="btn-base btn-gold text-xs py-2 px-4 w-full flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Envoyer la Demande d'Accès</span>
            </button>
          </form>
        )}

        {statusMessage && (
          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${requestStatus === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'}`}>
            {requestStatus === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* MODAL ACTIONS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
          <button
            onClick={handleDownloadGedcom}
            className="btn-base btn-gold text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{isIndividualModal ? "Télécharger Fiche / Extrait" : "Télécharger / Demander GEDCOM"}</span>
          </button>

          <button
            onClick={onClose}
            className="btn-base btn-outline-ink text-xs py-2.5 px-5 cursor-pointer"
          >
            Fermer la Carte
          </button>
        </div>
      </div>
    </div>
  );
}
