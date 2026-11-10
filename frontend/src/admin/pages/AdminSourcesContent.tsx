import { useState } from "react";
import SinglePageContentManager from "./SinglePageContentManager";
import PublicCardsManager from "./PublicCardsManager";
import { Layout, Compass } from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";

export default function AdminSourcesContent() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"cms" | "cards">("cms");

  return (
    <div className="space-y-5">
      {/* Top Selector: CMS Studio Editor vs Registered Documentary Sources */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit shadow-md">
        <button
          type="button"
          onClick={() => setTab("cms")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            tab === "cms"
              ? "bg-[var(--gold)] text-black shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>{t("sources_cms_tab", "Éditeur CMS de la Page Sources (Bannières & Textes)")}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab("cards")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            tab === "cards"
              ? "bg-[var(--gold)] text-black shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t("sources_cards_tab", "Fiches & Références des Sources (Sijillat)")}</span>
        </button>
      </div>

      {/* Body View */}
      {tab === "cms" ? (
        <SinglePageContentManager pageId="sources" />
      ) : (
        <PublicCardsManager kind="source" />
      )}
    </div>
  );
}
