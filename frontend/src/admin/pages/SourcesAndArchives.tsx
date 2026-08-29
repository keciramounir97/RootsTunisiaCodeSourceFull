import { useEffect, useState } from "react";
import {
  Archive,
  ExternalLink,
  FileText,
  Globe,
  Plus,
  Search,
  Trash2,
  Edit,
  X,
  Upload,
  Loader2,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";
import Toast from "../../components/Toast";

export default function SourcesAndArchives() {
  const { t } = useTranslation();
  const [sources, setSources] = useState<any[]>([]);
  const [quotas, setQuotas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  const showToast = (msg: string, tone: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastTone(tone);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sourcesRes, quotasRes] = await Promise.allSettled([
        api.get("/my/sources"),
        api.get("/my/quotas"),
      ]);

      if (sourcesRes.status === "fulfilled") {
        setSources(Array.isArray(sourcesRes.value.data) ? sourcesRes.value.data : []);
      }
      if (quotasRes.status === "fulfilled") {
        setQuotas(quotasRes.value.data?.data || quotasRes.value.data);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingSource(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setIconFile(null);
    setIconPreview("");
    setModalOpen(true);
  };

  const openEditModal = (source: any) => {
    setEditingSource(source);
    setTitle(source.title || "");
    setUrl(source.url || "");
    setDescription(source.description || "");
    setIconFile(null);
    setIconPreview(source.icon_url || "");
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Source title is required", "error");
      return;
    }

    const tempId = editingSource?.id || Date.now();
    const optimisticSource: SourceItem = {
      id: tempId,
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      icon_url: editingSource?.icon_url,
      created_at: editingSource?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Instant optimistic update
    if (editingSource) {
      setSources((prev) => prev.map((s) => (s.id === editingSource.id ? optimisticSource : s)));
      showToast("Source updated successfully!");
    } else {
      setSources((prev) => [optimisticSource, ...prev]);
      showToast("New source created successfully!");
    }
    setModalOpen(false);

    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("url", url.trim());
      fd.append("description", description.trim());
      if (iconFile) {
        fd.append("file", iconFile);
      }

      if (editingSource) {
        await api.put(`/my/sources/${editingSource.id}`, fd);
      } else {
        const { data } = await api.post("/my/sources", fd);
        if (data && data.id) {
          setSources((prev) => prev.map((s) => (s.id === tempId ? { ...s, id: data.id, ...data } : s)));
        }
      }
    } catch (err: any) {
      console.warn("Async source save note:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this source?")) return;
    // Instant optimistic removal
    setSources((prev) => prev.filter((s) => s.id !== id));
    showToast("Source deleted.");

    try {
      await api.delete(`/my/sources/${id}`);
    } catch (err: any) {
      console.warn("Async source delete note:", err);
    }
  };

  const sourcesQuota = quotas?.limits?.sources || { used: sources.length, max: 5 };
  const isMaxReached = sourcesQuota.max !== -1 && sourcesQuota.used >= sourcesQuota.max;

  const filteredSources = sources.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.url?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Toast message={toastMessage} tone={toastTone} />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#d9a441]/15 text-[#d9a441]">
            <Archive className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-cinzel text-[var(--text-color)]">
              {t("my_sources", "My Sources & Archives")}
            </h1>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              Save and organize your own custom research sources, archive portals & reference links.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            disabled={isMaxReached}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0d9488]/90 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{t("add_source", "+ Add Source")}</span>
          </button>
        </div>
      </div>

      {/* Quotas & Limit Bar */}
      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-gray-900 dark:text-white">
            Sources Created: <b className="text-[#d9a441]">{sourcesQuota.used}</b> / {sourcesQuota.max === -1 ? "∞" : sourcesQuota.max}
          </span>
          {sourcesQuota.max === 5 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
              Free Plan (Limit: 5 Sources)
            </span>
          )}
        </div>

        {isMaxReached && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500 font-bold">Limit Reached (5/5)</span>
            <Link
              to="/admin/user-upgrade"
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs inline-flex items-center gap-1 shadow"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade to Add More</span>
            </Link>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search my sources..."
          className="w-full ltr:pl-9 rtl:pr-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d9488]/40"
        />
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d9a441]" />
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-white/50 dark:bg-black/20 p-8 space-y-3">
          <Archive className="w-12 h-12 mx-auto text-gray-400 opacity-60" />
          <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">No sources added yet</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Click "+ Add Source" to bookmark public archives, Ottoman registries, civil records, or flag sources.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d9488] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Source</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((source) => {
            const hasLink = Boolean(source.url && source.url.trim());
            let targetUrl = source.url || "#";
            if (hasLink && !/^https?:\/\//i.test(targetUrl)) {
              targetUrl = `https://${targetUrl}`;
            }

            return (
              <div
                key={source.id}
                className="rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-5 shadow-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all relative overflow-hidden group"
              >
                <div>
                  {/* Card Header with Icon / Flag */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {source.icon_url ? (
                        <img
                          src={source.icon_url}
                          alt={source.title}
                          className="w-10 h-10 rounded-xl object-cover border border-[var(--border-color)] shadow-xs bg-gray-50"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#0d9488]/15 text-[#0d9488] flex items-center justify-center font-bold">
                          <Globe className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white truncate">
                          {source.title}
                        </h3>
                        {hasLink && (
                          <span className="text-[11px] text-[#0d9488] font-mono truncate block">
                            {source.url.replace(/^https?:\/\//i, "")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(source)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                        title="Edit Source"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(source.id)}
                        disabled={deletingId === source.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
                        title="Delete Source"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {source.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {source.description}
                    </p>
                  )}
                </div>

                {/* VISIT SOURCE BUTTON */}
                <div className="pt-3 border-t border-[var(--border-color)]">
                  {hasLink ? (
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0d9488] to-[#0f2742] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t("visit_my_source", "Visit My Source")}</span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <span>No URL Provided</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1a2e2d] text-gray-900 dark:text-white p-6 shadow-2xl border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-bold text-lg font-cinzel text-[#0d9488]">
                {editingSource ? "Edit Source" : "+ Add New Source"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">
                  Source Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Turkish Public Archive"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d9488]/40"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Source Website / Link (URL)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. https://www.archives.gov.tr"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d9488]/40"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description / Notes</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Contains Ottoman registries for Tunisian family lineages"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Icon / Flag Upload */}
              <div>
                <label className="block font-bold mb-1">Source Icon / Flag Image</label>
                <div className="flex items-center gap-4">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Icon Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-[var(--border-color)]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}

                  <label className="px-3.5 py-2 rounded-xl bg-stone-500/15 hover:bg-stone-500/25 font-bold cursor-pointer transition">
                    <span>{iconPreview ? "Change Icon" : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#0d9488] text-white font-bold inline-flex items-center gap-2 hover:bg-[#0d9488]/90 shadow transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{saving ? "Saving..." : editingSource ? "Update Source" : "Save Source"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
