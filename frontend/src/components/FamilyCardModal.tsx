import React, { useState, useMemo, useEffect } from "react";
import { X, GitBranch, Users, Layers, Download, FileCode, Sparkles, CheckCircle2, AlertCircle, User, ShieldCheck, MapPin, Landmark, Clock, RefreshCcw, Briefcase, FileText } from "lucide-react";
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

  const isIndividualModal = Boolean(individual && !tree);

  // Extract Tree / Individual metadata
  const indName = individual ? `${individual.first_name || individual.firstName || ''} ${individual.last_name || individual.lastName || individual.surname || ''}`.trim() : "";
  const title = tree?.name || tree?.title || indName || "Roots Tunisia Lineage";
  const governorate = tree?.governorate || tree?.region || individual?.birth_place || individual?.birthPlace || "Tunisia";
  const rawPeopleList = Array.isArray(tree?.people) ? tree.people : (individual ? [individual] : []);
  const membersCount = fetchedPeople?.length ?? tree?.people?.length ?? tree?.membersCount ?? (individual ? 1 : 0);
  const generations = tree?.generations ?? (membersCount > 0 ? Math.ceil(Math.log2(membersCount + 1)) : 1);
  const description = tree?.description || tree?.notes || tree?.provenance || "Notice généalogique documentée conservée dans le catalogue des archives de Tunisie.";

  // Initial synchronous check if gedcom text is already attached to tree object
  useEffect(() => {
    if (isIndividualModal) return;
    const rawContent = tree?.gedcom_text || tree?.content || tree?.gedcom_data || tree?.gedcom;
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
  }, [tree?.id, tree?.gedcom_text, tree?.content, tree?.gedcom_data, isIndividualModal]);

  // Dynamically fetch exact GEDCOM data for DB trees so schema matches Tree Builder 100%
  useEffect(() => {
    if (isIndividualModal) return;
    const targetTreeId = tree?.id;
    if (!targetTreeId) return;

    let isMounted = true;
    setLoadingGedcom(true);

    (async () => {
      try {
        try {
          const treeObjRes = await api.get(`/trees/${targetTreeId}`);
          const treeObj = treeObjRes?.data?.data || treeObjRes?.data;
          if (treeObj) {
            const gedText = treeObj.gedcom_text || treeObj.content || treeObj.gedcom_data;
            if (typeof gedText === "string" && gedText.trim().length > 10) {
              const isGedX = treeObj.data_format === "gedcomx" || /^\s*(\{|\<\?xml)/.test(gedText);
              const parsed = isGedX ? parseGedcomX(gedText) : parseGedcom(gedText);
              if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
                setFetchedPeople(parsed);
                setLoadingGedcom(false);
                return;
              }
            }
            if (Array.isArray(treeObj.people) && treeObj.people.length > 0 && isMounted) {
              setFetchedPeople(treeObj.people);
              setLoadingGedcom(false);
              return;
            }
          }
        } catch {
          // Ignore and proceed to raw GEDCOM endpoint
        }

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
          }
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

  // Build fallback normalized schema nodes if direct GEDCOM text is not available
  const normalizedPeople = useMemo(() => {
    if (fetchedPeople && fetchedPeople.length > 0) {
      return fetchedPeople.map((p: any, idx: number) => {
        const id = p.id != null ? String(p.id) : `p-${idx + 1}`;
        const given = p.first_name || p.firstName || p.given || p.names?.en || "Individu";
        const surname = p.last_name || p.lastName || p.surname || "";
        const fullName = p.names?.fr || p.names?.en || `${given} ${surname}`.trim();

        return {
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
          father: p.father ? String(p.father) : null,
          mother: p.mother ? String(p.mother) : null,
          spouse: p.spouse ? String(p.spouse) : null,
          children: Array.isArray(p.children) ? p.children.map(String) : [],
        };
      });
    }

    let list = [...rawPeopleList];

    if (list.length === 0) {
      list = [
        {
          id: "p1",
          firstName: title,
          lastName: "Patrimoine",
          names: { fr: title, en: title },
          gender: "M",
          birthDate: "1880",
          birthPlace: governorate,
          spouse: "p2",
          children: ["p3"],
        },
        {
          id: "p2",
          firstName: "Épouse Lignée",
          lastName: title,
          names: { fr: "Épouse Lignée", en: "Spouse Lineage" },
          gender: "F",
          birthDate: "1885",
          birthPlace: governorate,
          spouse: "p1",
          children: ["p3"],
        },
        {
          id: "p3",
          firstName: "Descendant Répertorié",
          lastName: title,
          names: { fr: "Descendant Répertorié", en: "Registered Descendant" },
          gender: "M",
          birthDate: "1915",
          birthPlace: governorate,
          father: "p1",
          mother: "p2",
        },
      ];
    }

    return list.map((p: any, idx: number) => {
      const id = p.id != null ? String(p.id) : `p-${idx + 1}`;
      const given = p.first_name || p.firstName || p.given || "Individu";
      const surname = p.last_name || p.lastName || p.surname || "";
      const fullName = `${given} ${surname}`.trim();

      return {
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
        father: p.father || p.father_id || null,
        mother: p.mother || p.mother_id || null,
        spouse: p.spouse || p.spouse_id || null,
        children: Array.isArray(p.children) ? p.children.map(String) : [],
      };
    });
  }, [rawPeopleList, title, governorate, fetchedPeople]);

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
              <span>{isIndividualModal ? "Fiche Individuelle Patrimoniale" : "Carte Généalogique Patrimoniale"}</span>
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
        {/* CASE 1: INDIVIDUAL MODAL (SINGLE 3D PATRIMONIAL CARD)    */}
        {/* ======================================================== */}
        {isIndividualModal ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* 3D INDIVIDUAL PATRIMONIAL CARD */}
            <div className="perspective-1000">
              <div className="transform-gpu transition-all duration-500 rounded-xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] p-6 text-white border-2 border-[var(--gold)]/80 shadow-2xl relative overflow-hidden space-y-4">
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none font-serif text-9xl font-bold text-[var(--gold)]">
                  جذور
                </div>

                <div className="flex items-center justify-between border-b border-[var(--gold)]/30 pb-3">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)] flex items-center gap-1.5">
                    <User className="h-4 w-4 text-[var(--gold)]" />
                    <span>Fiche Individuelle Répertoriée</span>
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-[0.68rem] font-mono font-bold bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40">
                    {governorate}
                  </span>
                </div>

                {/* INDIVIDUAL IDENTITY HERO */}
                <div className="flex items-start gap-4 pt-1">
                  <div className="h-16 w-16 rounded-2xl bg-[var(--gold)]/20 border-2 border-[var(--gold)]/60 flex items-center justify-center shrink-0 shadow-lg text-[var(--gold)] font-bold text-2xl font-serif">
                    {individual.gender === "F" ? "♀" : "♂"}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-bold text-amber-100 tracking-wide">
                      {indName}
                    </h3>
                    <p className="text-xs text-slate-300 font-light flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-[var(--gold)]" />
                      <span>{individual.occupation || individual.profession || "Notable & Personnalité Patrimoniale"}</span>
                    </p>
                  </div>
                </div>

                {/* METADATA GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-black/40 border border-[var(--gold)]/30 space-y-1.5">
                    <span className="text-[0.65rem] text-slate-400 uppercase block font-semibold">Naissance & Origine</span>
                    <p className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span>{individual.birth_date || individual.birthDate || "Année non spécifiée"}</span>
                    </p>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" />
                      <span>{individual.birth_place || individual.birthPlace || governorate}</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-[var(--gold)]/30 space-y-1.5">
                    <span className="text-[0.65rem] text-slate-400 uppercase block font-semibold">Statut Vital & Décès</span>
                    <p className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{individual.death_date || individual.deathDate || "Vivant ou non répertorié"}</span>
                    </p>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[var(--gold)]" />
                      <span>{individual.death_place || individual.deathPlace || "Archives Nationales"}</span>
                    </p>
                  </div>
                </div>

                {/* ARCHIVES / PROVENANCE NOTICE */}
                <div className="p-3 rounded-lg bg-black/30 border border-[var(--gold)]/20 text-xs text-slate-300 leading-relaxed font-light flex items-start gap-2">
                  <FileText className="h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" />
                  <span>
                    Notice enregistrée au catalogue officiel des individus de Tunisie. Document d'archive certifié conservé sous la référence administrative patrimoniale.
                  </span>
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
                      {normalizedPeople.length} Cartes Liées
                    </span>
                  </div>
                </div>

                <div className="h-[540px] sm:h-[600px] w-full rounded-xl overflow-hidden border-2 border-[var(--gold)]/60 relative bg-[#0b1726] shadow-2xl">
                  <TreesBuilder
                    people={normalizedPeople}
                    rawPeople={normalizedPeople}
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

        {/* GEDCOM REQUEST FORM */}
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
