import { getTreeMetrics } from "../../utils/treeMetrics";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Users, Eye, MapPin } from "lucide-react";
import FamilyCardModal from "../FamilyCardModal";
import { useTranslation } from "../../context/TranslationContext";

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
  people_count?: number;
  membersCount?: number;
  generations?: number;
  isLocalized?: boolean;
}

export const featuredTrees: TreeRecord[] = [];

const GOV_KEY_LOOKUP: Record<string, string> = {
  tunis: "gov_name_tunis",
  ariana: "gov_name_ariana",
  "ben arous": "gov_name_ben_arous",
  manouba: "gov_name_manouba",
  "la manouba": "gov_name_manouba",
  nabeul: "gov_name_nabeul",
  zaghouan: "gov_name_zaghouan",
  bizerte: "gov_name_bizerte",
  beja: "gov_name_beja",
  "béja": "gov_name_beja",
  jendouba: "gov_name_jendouba",
  "le kef": "gov_name_le_kef",
  kef: "gov_name_le_kef",
  siliana: "gov_name_siliana",
  sousse: "gov_name_sousse",
  monastir: "gov_name_monastir",
  mahdia: "gov_name_mahdia",
  sfax: "gov_name_sfax",
  kairouan: "gov_name_kairouan",
  kasserine: "gov_name_kasserine",
  "sidi bouzid": "gov_name_sidi_bouzid",
  gafsa: "gov_name_gafsa",
  tozeur: "gov_name_tozeur",
  kebili: "gov_name_kebili",
  "kébili": "gov_name_kebili",
  gabes: "gov_name_gabes",
  "gabès": "gov_name_gabes",
  medenine: "gov_name_medenine",
  "médenine": "gov_name_medenine",
  tataouine: "gov_name_tataouine",
  tunisia: "tunisia",
  tunisie: "tunisia",
};

export function TreeCard({ tree }: { tree: TreeRecord }) {
  const { t, isRtl } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const rawTitle = (tree.name || tree.title || "").trim();
  const rawSummary = (tree.description || tree.notes || tree.provenance || tree.summary || "").trim();

  // Completely exclude phantom or dummy test trees
  if (/^new\s+family\s+tree$/i.test(rawTitle) || /genealogical\s+tree\s+uploaded\s+via\s+admin/i.test(rawSummary)) {
    return null;
  }

  const isGenericTitle = /^(my\s+family\s+tree|family\s+tree|arbre\s+g[ée]n[ée]alogique|default\s+tree)/i.test(rawTitle);
  const titleStr = tree.isLocalized
    ? rawTitle
    : !rawTitle || isGenericTitle || (isRtl && !/[\u0600-\u06FF]/.test(rawTitle))
      ? `${t("family_tree")} #${tree.id}`
      : rawTitle;

  // Only ever show the real author of the tree. Never invent an institution
  // ("laboratory") when the owner is missing or a generic account label.
  const rawOwner = (typeof tree.owner === "string" ? tree.owner : tree.owner?.full_name || "").trim();
  const ownerStr = /^(admin|super\s*admin|user|researcher|roots\s+tunisia|laboratoire.*|laborator.*)$/i.test(rawOwner) ? "" : rawOwner;

  const summaryStr = rawSummary;

  const rawLocation = (tree.governorate || tree.region || "").trim();
  const govKey = GOV_KEY_LOOKUP[rawLocation.toLowerCase()];
  const locationStr = tree.isLocalized
    ? rawLocation
    : govKey
      ? t(govKey)
      : !rawLocation || (isRtl && !/[\u0600-\u06FF]/.test(rawLocation))
        ? t("tunisia")
        : rawLocation;

  const { individuals: members, generations: gens } = getTreeMetrics(tree);

  return (
    <>
      <article className="surface-card frame-gold flex h-full flex-col p-5 sm:p-6 text-start transition-transform hover:-translate-y-1 rounded-lg bg-[var(--card)] border border-[var(--gold)]/40">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-[var(--gold)]">{t("family_and_lineage")}</p>
          <Link
            to={`/gallery/trees?q=${encodeURIComponent(locationStr)}`}
            className="rounded-sm border border-[var(--gold)]/50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)] bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 flex items-center gap-1 transition-colors"
          >
            <MapPin className="h-3 w-3 text-[var(--gold)]" />
            <span>{locationStr}</span>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="mt-3 text-start font-serif text-xl font-bold leading-snug text-[var(--foreground)] hover:text-[var(--gold)] transition-colors cursor-pointer block"
          title="Cliquer pour ouvrir la carte et le schéma de cet arbre"
        >
          {titleStr}
        </button>
        {ownerStr ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            {t("by_author")} {ownerStr}
          </p>
        ) : null}
        <p className="mt-3 flex-1 text-xs leading-relaxed text-[var(--foreground)]/80 line-clamp-3">{summaryStr}</p>
        
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[var(--foreground)]">
            <Layers className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span><strong>{t("generations_label")}:</strong> {gens}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--foreground)]">
            <Users className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span><strong>{t("individuals_label")}:</strong> {members}</span>
          </div>
        </div>

        <p className="mt-3 text-[0.68rem] text-[var(--muted-foreground)] font-mono">{t("standard_gedcom")}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-base btn-gold px-4 py-2 text-[0.65rem] flex items-center gap-1.5 cursor-pointer w-full justify-center"
          >
            <Eye className="h-3.5 w-3.5" /> {t("show_3d_card_gedcom")}
          </button>
        </div>
      </article>

      {showModal && (
        <FamilyCardModal
          tree={{
            ...tree,
            name: titleStr,
            title: titleStr,
            description: summaryStr,
            governorate: locationStr,
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
