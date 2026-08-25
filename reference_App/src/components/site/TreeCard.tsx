import { Link } from "@tanstack/react-router";
import { Download, GitBranch } from "lucide-react";

export interface TreeRecord {
  id: number;
  title: string;
  owner: string;
  summary: string;
  archive: string;
  code: string;
  region: string;
}

export const featuredTrees: TreeRecord[] = [
  {
    id: 301,
    title: "La famille Ben Ayed de Tunis : Reconstitution généalogique (1780–1930)",
    owner: "Karim Admin",
    summary:
      "Marchands et caïds du Souk El Attarine : chronique d'une famille beldi entre le Bardo et la Medina.",
    archive: "Archives Nationales de Tunisie · Série Beylicale",
    code: "ANT-BEY-1147",
    region: "Tunis",
  },
  {
    id: 302,
    title: "Le lignage Bouazizi de Sidi Bouzid : terres, tribu et registres habous",
    owner: "Amel Trabelsi",
    summary:
      "Une lignée de fellahs du centre tunisien reconstituée à partir des registres habous et de la mémoire tribale.",
    archive: "Registres Habous · Jemmal",
    code: "HAB-SB-0421",
    region: "Sidi Bouzid",
  },
  {
    id: 303,
    title: "The Cohen-Guetta family of Djerba (1810–1965)",
    owner: "Sami Guetta",
    summary:
      "A Djerbian Jewish lineage traced through Hara Sghira registers, ketubot, and migration papers to Marseille.",
    archive: "Djerba Community Registers",
    code: "DJ-CG-0092",
    region: "Djerba",
  },
  {
    id: 304,
    title: "Famille El Materi de Kairouan : oulémas et fondations pieuses",
    owner: "Nadia Ben Salah",
    summary:
      "Chaîne de savants attachés à la Grande Mosquée de Kairouan, documentée par les sijillat du tribunal charaïque.",
    archive: "Tribunal Charaïque de Kairouan",
    code: "KR-CHA-0378",
    region: "Kairouan",
  },
  {
    id: 305,
    title: "Les Zarrouk de Sfax : oléiculture et commerce méditerranéen",
    owner: "Hichem Zarrouk",
    summary:
      "Actes notariés, registres de port et photographies de studio retraçant six générations sfaxiennes.",
    archive: "Archives Municipales de Sfax",
    code: "SFX-MUN-2211",
    region: "Sfax",
  },
  {
    id: 306,
    title: "Branche Ben Hassine de Nefta : oasis, palmeraie et nomadisme",
    owner: "Mongi Ben Hassine",
    summary:
      "Reconstitution d'une lignée du Djérid croisant recensements coloniaux et généalogies orales.",
    archive: "Recensements du Protectorat · Tozeur",
    code: "PRO-TZR-0765",
    region: "Nefta",
  },
];

export function TreeCard({ tree }: { tree: TreeRecord }) {
  return (
    <article className="surface-card flex flex-col p-6 transition-transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Family Trees</p>
        <span className="rounded-sm border border-gold/50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold">
          Public
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl leading-snug text-foreground">{tree.title}</h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {tree.owner} · {tree.region}
      </p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{tree.summary}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-gold/25 pt-4 text-xs">
        <div>
          <dt className="font-bold uppercase tracking-[0.14em] text-gold">Archive Source</dt>
          <dd className="mt-1 text-muted-foreground">{tree.archive}</dd>
        </div>
        <div>
          <dt className="font-bold uppercase tracking-[0.14em] text-gold">Document Code</dt>
          <dd className="mt-1 text-muted-foreground">{tree.code}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">Saved with GEDCOM 5.5.1</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/genealogy-gallery" className="btn-base btn-red px-4 py-2 text-[0.65rem]">
          <GitBranch className="h-3.5 w-3.5" /> View Tree
        </Link>
        <Link to="/subscriptions" className="btn-base btn-outline-ink px-4 py-2 text-[0.65rem]">
          <Download className="h-3.5 w-3.5" /> Request Download
        </Link>
      </div>
    </article>
  );
}
