import { useState } from "react";
import { Download, GitBranch, Layers, Users, Eye, MapPin } from "lucide-react";
import FamilyCardModal from "../FamilyCardModal";

export interface TreeRecord {
  id: number | string;
  title?: string;
  name?: string;
  owner?: string | { full_name?: string };
  summary?: string;
  description?: string;
  notes?: string;
  provenance?: string;
  archive?: string;
  code?: string;
  region?: string;
  governorate?: string;
  people?: any[];
  membersCount?: number;
  generations?: number;
}

export function TreeCard({ tree }: { tree: TreeRecord }) {
  const [showModal, setShowModal] = useState(false);

  const titleStr = tree.name || tree.title || `Arbre Familial #${tree.id}`;
  const ownerStr = typeof tree.owner === "string" ? tree.owner : (tree.owner?.full_name || "Recherche Patrimoniale");
  const summaryStr = tree.description || tree.notes || tree.provenance || tree.summary || "Arbre généalogique numérisé et documenté.";
  const locationStr = tree.governorate || tree.region || "Tunisie";
  const members = tree.people?.length ?? tree.membersCount ?? 0;
  const gens = tree.generations ?? (members > 0 ? Math.ceil(Math.log2(members + 1)) : 1);

  return (
    <>
      <article className="surface-card frame-gold flex flex-col p-6 transition-transform hover:-translate-y-1 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-[var(--gold)]">Famille & Lignée</p>
          <span className="rounded-sm border border-[var(--gold)]/50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)] bg-[var(--gold)]/10 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[var(--gold)]" />
            <span>{locationStr}</span>
          </span>
        </div>
        <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-[var(--foreground)]">{titleStr}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          Par {ownerStr}
        </p>
        <p className="mt-3 flex-1 text-xs leading-relaxed text-[var(--foreground)]/80 line-clamp-3">{summaryStr}</p>
        
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[var(--foreground)]">
            <Layers className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span><strong>Générations:</strong> {gens}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--foreground)]">
            <Users className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span><strong>Individus:</strong> {members}</span>
          </div>
        </div>

        <p className="mt-3 text-[0.68rem] text-[var(--muted-foreground)] font-mono">Standard GEDCOM 5.5.1 UTF-8</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-base btn-gold px-4 py-2 text-[0.65rem] flex items-center gap-1.5 cursor-pointer w-full justify-center"
          >
            <Eye className="h-3.5 w-3.5" /> Afficher la Carte 3D & GEDCOM
          </button>
        </div>
      </article>

      {showModal && (
        <FamilyCardModal
          tree={tree}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
