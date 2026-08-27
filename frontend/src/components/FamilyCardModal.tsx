import React, { useState } from "react";
import { X, GitBranch, Users, Layers, Download, FileCode, Sparkles, CheckCircle2, AlertCircle, User, ShieldCheck } from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";

interface FamilyCardModalProps {
  tree?: any;
  individual?: any;
  onClose: () => void;
}

export default function FamilyCardModal({ tree, individual, onClose }: FamilyCardModalProps) {
  const { t } = useTranslation();
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Extract Tree details
  const title = tree?.name || tree?.title || (individual ? `Card: ${individual.first_name || individual.firstName} ${individual.last_name || individual.lastName}` : "Roots Tunisia Lineage");
  const governorate = tree?.governorate || tree?.region || individual?.birth_place || "Tunisia";
  const peopleList = Array.isArray(tree?.people) ? tree.people : (individual ? [individual] : []);
  const membersCount = tree?.people?.length ?? tree?.membersCount ?? (individual ? 1 : 0);
  const generations = tree?.generations ?? (membersCount > 0 ? Math.ceil(Math.log2(membersCount + 1)) : 1);
  const description = tree?.description || tree?.notes || tree?.provenance || "Notice généalogique documentée conservée dans le catalogue des archives de Tunisie.";

  const handleDownloadGedcom = async () => {
    if (!tree?.id) {
      // Create instant client GEDCOM text download if mock/transient
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
      // Direct GET download call
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
        item_type: "tree",
        item_id: tree?.id || 1,
        reason: requestReason.trim() || "Genealogical lineage research and GEDCOM verification.",
      });
      setRequestStatus("success");
      setStatusMessage("Demande d'accès au fichier GEDCOM transmise aux archivistes !");
    } catch (err: any) {
      setRequestStatus("error");
      setStatusMessage(err?.response?.data?.message || "La demande est en cours de traitement.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="surface-card frame-gold relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[var(--card)] p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto border-2 border-[var(--gold)]/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-[var(--background)] p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/20 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 3D HERITAGE FAMILY CARD PREVIEW HERO */}
        <div className="perspective-1000 py-2">
          <div className="transform-gpu transition-all duration-500 hover:rotate-x-2 hover:rotate-y-2 hover:scale-[1.01] rounded-xl bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] p-6 text-white border-2 border-[var(--gold)]/70 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(217,119,6,0.3)] relative overflow-hidden">
            {/* Background Seal watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none font-serif text-9xl font-bold text-[var(--gold)]">
              جذور
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-[var(--gold)]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--gold)] animate-pulse" />
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  🏛️ Carte Généalogique Patrimoniale
                </span>
              </div>
              <span className="px-3 py-0.5 rounded-full text-[0.65rem] font-mono font-bold bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40">
                📍 {governorate}
              </span>
            </div>

            {/* Card Body */}
            <div className="mt-4 space-y-3">
              <h2 className="text-2xl font-serif font-bold text-amber-100 tracking-wide leading-tight">
                {title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                {description}
              </p>

              {/* Generational & Member Metrics */}
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
                    <span className="text-[0.65rem] text-slate-400 block uppercase">Norme GEDCOM</span>
                    <strong className="text-xs text-teal-300">5.5.1 UTF-8</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDIVIDUAL DETAILS SECTION (if Individual view) */}
        {individual && (
          <div className="space-y-3 rounded-xl bg-[var(--background)] p-4 border border-[var(--border)]">
            <h3 className="font-semibold text-sm text-[var(--foreground)] uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4 text-[var(--gold)]" />
              <span>Fiche Individuelle : {individual.first_name || individual.firstName} {individual.last_name || individual.lastName || individual.surname}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[var(--card)] border border-[var(--border)] space-y-1">
                <span className="text-[0.68rem] text-[var(--muted-foreground)] uppercase block font-mono">Naissance & Origine</span>
                <p className="font-bold text-[var(--foreground)]">
                  ✳️ {individual.birth_date || individual.birthDate || "Date non spécifiée"}
                </p>
                <p className="text-[0.72rem] text-[var(--muted-foreground)]">
                  📍 {individual.birth_place || individual.birthPlace || governorate}
                </p>
              </div>

              <div className="p-2.5 rounded bg-[var(--card)] border border-[var(--border)] space-y-1">
                <span className="text-[0.68rem] text-[var(--muted-foreground)] uppercase block font-mono">Statut Vital & Décès</span>
                <p className="font-bold text-[var(--foreground)]">
                  ✝️ {individual.death_date || individual.deathDate || "Vivant ou non enregistré"}
                </p>
                <p className="text-[0.72rem] text-[var(--muted-foreground)]">
                  📍 {individual.death_place || individual.deathPlace || "N/A"}
                </p>
              </div>
            </div>

            {individual.occupation && (
              <p className="text-xs text-[var(--foreground)]">
                <strong>Profession / Activité :</strong> {individual.occupation}
              </p>
            )}
          </div>
        )}

        {/* INDIVIDUALS IN TREE LIST */}
        {!individual && peopleList.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[var(--gold)]" />
              <span>Individus Répertoriés ({peopleList.length})</span>
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1.5 pe-1">
              {peopleList.map((person: any, idx: number) => (
                <div
                  key={person.id || idx}
                  className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[var(--foreground)]">
                      {person.first_name || person.firstName} {person.last_name || person.lastName || person.surname}
                    </span>
                    {(person.birth_date || person.birth_place) && (
                      <p className="text-[0.68rem] text-[var(--muted-foreground)]">
                        ✳️ {person.birth_date || "N/A"} {person.birth_place ? `• ${person.birth_place}` : ""}
                      </p>
                    )}
                  </div>
                  <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] font-mono font-bold">
                    {person.gender === 'F' ? '♀ Femme' : '♂ Homme'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GEDCOM REQUEST FORM */}
        {showRequestForm && (
          <form onSubmit={handleSubmitDownloadRequest} className="space-y-3 p-4 rounded-xl bg-[var(--background)] border border-[var(--gold)]/40 animate-in fade-in">
            <h4 className="font-semibold text-xs text-[var(--foreground)] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
              <span>Demande d'Accès au Fichier GEDCOM</span>
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
              className="btn-base btn-gold text-xs py-2 px-4 w-full flex items-center justify-center gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Envoyer la Demande de Téléchargement GEDCOM</span>
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
            className="btn-base btn-gold text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger / Demander GEDCOM</span>
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
