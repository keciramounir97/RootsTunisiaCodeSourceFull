import { useState, useEffect, useMemo, useRef } from "react";
import { ExternalLink, FileText, Plus, X, Trash2, Link2 } from "lucide-react";
import { api } from "../api/client";
import { getApiRoot } from "../api/helpers";
import { useTranslation } from "../context/TranslationContext";

interface PersonLink {
  id: number;
  person_id: number;
  label: string;
  url: string;
  type: "external" | "document";
  document_id?: number | null;
  created_at?: string;
}

interface PersonLinksPanelProps {
  personId: number | string | null;
  personName: string;
  treeId?: number | string;
  isPublicTree?: boolean;
  isAuthenticated?: boolean;
  treeSourceLinks?: string[];
  onClose: () => void;
}

export default function PersonLinksPanel({
  personId,
  personName,
  isPublicTree = true,
  isAuthenticated = false,
  treeSourceLinks = [],
  onClose,
}: PersonLinksPanelProps) {
  const { t } = useTranslation();
  const [links, setLinks] = useState<PersonLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const hasTreeSourceLinks = Array.isArray(treeSourceLinks) && treeSourceLinks.length > 0;

  // Numeric person id — only real persons from DB have numeric IDs
  const numericId = personId ? Number(personId) : null;
  const isRealPerson = numericId && Number.isFinite(numericId) && numericId > 0;

  const treeLinks = useMemo(
    () =>
      treeSourceLinks
        .map((raw, index) => {
          const value = String(raw || "").trim();
          if (!value) return null;
          const parts = value.split(" | ");
          const label = (parts.length > 1 ? parts[0] : value).trim();
          let url = (parts.length > 1 ? parts.slice(1).join(" | ") : value).trim();
          if (!/^https?:\/\//i.test(url) && url) {
            const pathname = url.startsWith("/") ? url : `/${url}`;
            url = `${getApiRoot().replace(/\/+$/, "")}${pathname}`;
          }
          if (!url) return null;
          return {
            id: index + 1,
            label: label || url,
            url,
            type: /\/uploads\//i.test(url) ? "document" : "external",
          } as PersonLink;
        })
        .filter(Boolean) as PersonLink[],
    [treeSourceLinks],
  );

  useEffect(() => {
    if (hasTreeSourceLinks) {
      setLinks(treeLinks);
      setLoading(false);
      setError("");
      return;
    }
    if (!isRealPerson) {
      setLinks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const endpoint = isAuthenticated && !isPublicTree
      ? `/my/people/${numericId}/links`
      : `/people/${numericId}/links`;
    api.get(endpoint)
      .then((res) => {
        setLinks(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        // 403/404 gracefully — just show empty
        if (err?.response?.status === 403 || err?.response?.status === 404) {
          setLinks([]);
        } else {
          setError(t("person_links_error", "Could not load links."));
        }
      })
      .finally(() => setLoading(false));
  }, [hasTreeSourceLinks, isAuthenticated, isRealPerson, numericId, treeLinks, treeSourceLinks]);

  const handleAdd = async () => {
    if (!newLabel.trim() || !newUrl.trim()) {
      setAddError(t("person_link_required", "Label and URL are required."));
      return;
    }
    setAdding(true);
    setAddError("");
    try {
      const res = await api.post(`/my/people/${numericId}/links`, {
        label: newLabel.trim(),
        url: newUrl.trim(),
        type: "external",
      });
      setLinks((prev) => [...prev, res.data]);
      setNewLabel("");
      setNewUrl("");
      setShowAddForm(false);
    } catch (err: any) {
      setAddError(err?.response?.data?.message || t("person_link_add_failed", "Failed to add link."));
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (linkId: number) => {
    try {
      await api.delete(`/my/people/${numericId}/links/${linkId}`);
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
    } catch {
      // silent fail
    }
  };

  // Suggested curated resources for historical figures
  const suggestedSources = [
    { label: "BnF Gallica — Archives nationales", url: "https://gallica.bnf.fr/", type: "archive" },
    { label: "Archives Nationales de Tunisie", url: "http://www.archives.nat.tn/", type: "archive" },
    { label: "Archives Nationales du Maroc", url: "https://www.archivesnationales.ma/", type: "archive" },
    { label: "Archives Nationales d'Algérie", url: "https://archives.gov.dz/", type: "archive" },
    { label: "ANOM — Archives d'Outre-Mer (France)", url: "https://anom.archivesnationales.culture.gouv.fr/", type: "archive" },
    { label: "Ottoman State Archives (Osmanlı Arşivi)", url: "https://www.devletarsivleri.gov.tr/", type: "archive" },
    { label: "WorldCat — Library Catalog", url: "https://www.worldcat.org/", type: "catalog" },
    { label: "FamilySearch — Genealogy Records", url: "https://www.familysearch.org/", type: "genealogy" },
  ];

  return (
    <div
      ref={panelRef}
      className="h-full flex flex-col overflow-hidden"
      style={{ minWidth: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--brand-teal)] text-white shrink-0">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--brand-gold)] font-semibold">
            {t("person_links_title", "Related Sources")}
          </p>
          <h3 className="font-bold font-cinzel truncate text-sm">{personName}</h3>
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
          aria-label={t("close", "Close")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Linked documents / external URLs */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--brand-gold)] mb-2 flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5" />
            {t("person_links_linked", "Linked Sources")}
          </p>

          {loading ? (
            <div className="text-sm opacity-60 animate-pulse">{t("loading", "Loading…")}</div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : links.length === 0 ? (
            <div className="text-sm opacity-50 italic">
              {hasTreeSourceLinks
                ? t("person_links_empty", "No sources linked yet.")
                : !isRealPerson
                ? t("person_links_mock_notice", "Links are only available for persons saved in the database.")
                : t("person_links_empty", "No sources linked yet.")}
            </div>
          ) : (
            <ul className="space-y-2">
              {links.map((link) => (
                <li
                  key={link.id}
                  className="flex items-start gap-2 group rounded-lg p-2 hover:bg-[var(--brand-teal)]/5 transition-colors"
                >
                  {link.type === "document" ? (
                    <FileText className="w-4 h-4 text-[var(--brand-gold)] mt-0.5 shrink-0" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-[var(--brand-gold)] mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm font-medium text-[var(--brand-teal)] dark:text-[var(--gold-light)] hover:underline truncate block"
                    >
                      {link.label}
                    </a>
                    <p className="text-[10px] opacity-50 truncate">{link.url}</p>
                  </div>
                  {isAuthenticated && (
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-500 transition-all"
                      aria-label={t("person_link_remove", "Remove link")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add link form (authenticated only) */}
        {isAuthenticated && isRealPerson && (
          <div>
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 text-sm text-[var(--brand-gold)] hover:text-[var(--gold-light)] transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                {t("person_add_link", "Add a source link")}
              </button>
            ) : (
              <div className="space-y-2 rounded-xl border border-[var(--border-color)] p-3 bg-[var(--paper-color)]">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder={t("person_link_label", "Label (e.g. Gallica document)")}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--brand-gold)]"
                />
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder={t("person_link_url", "https://...")}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-color)] bg-transparent focus:outline-none focus:ring-1 focus:ring-[var(--brand-gold)]"
                />
                {addError && <p className="text-xs text-red-500">{addError}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="flex-1 py-1.5 rounded-lg bg-[var(--brand-gold)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
                  >
                    {adding ? t("saving", "Saving…") : t("person_link_add_btn", "Add Link")}
                  </button>
                  <button
                    onClick={() => { setShowAddForm(false); setAddError(""); setNewLabel(""); setNewUrl(""); }}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-sm hover:opacity-70 transition"
                  >
                    {t("cancel", "Cancel")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suggested curated sources */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--brand-gold)] mb-2 flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" />
            {t("person_links_suggested", "Suggested Archives & Sources")}
          </p>
          <ul className="space-y-1.5">
            {suggestedSources.map((src) => (
              <li key={src.url}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 text-xs text-[var(--brand-teal)] dark:text-[var(--gold-light)]/80 hover:text-[var(--brand-gold)] hover:underline transition-colors"
                >
                  <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
