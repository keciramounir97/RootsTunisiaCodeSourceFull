import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Search,
  StickyNote,
  Trash2,
  Eye,
  Loader2,
  Plus,
  Edit3,
  X,
  ImagePlus,
  Crown,
  Calendar,
  User,
  Sparkles,
} from "lucide-react";
import { useThemeStore } from "../../store/theme";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";
import Toast from "../../components/Toast";

interface NoteItem {
  id: number;
  title: string;
  user_id: number;
  user_email?: string;
  created_at: string;
  content: string;
  image_url?: string;
}

export default function AdminNotes() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 1 || user?.role === 3;

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [quotas, setQuotas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewNote, setViewNote] = useState<NoteItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"my" | "all">("my");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formPreview, setFormPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastTone, setToastTone] = useState<"success" | "error">("success");

  const showToast = (msg: string, tone: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastTone(tone);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin && viewMode === "all" ? "/admin/notes" : "/my/notes";
      const [notesRes, quotasRes] = await Promise.allSettled([
        api.get(endpoint),
        api.get("/my/quotas"),
      ]);

      if (notesRes.status === "fulfilled") {
        setNotes(Array.isArray(notesRes.value.data) ? notesRes.value.data : notesRes.value.data?.data || []);
      }
      if (quotasRes.status === "fulfilled") {
        setQuotas(quotasRes.value.data?.data || quotasRes.value.data);
      }
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [viewMode]);

  const openAddModal = () => {
    setEditingNote(null);
    setFormTitle("");
    setFormContent("");
    setFormImage(null);
    setFormPreview("");
    setModalOpen(true);
  };

  const openEditModal = (note: NoteItem) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content || "");
    setFormImage(null);
    setFormPreview(note.image_url || "");
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormImage(file);
      setFormPreview(URL.createObjectURL(file));
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast("Note title is required", "error");
      return;
    }

    const tempId = editingNote?.id || Date.now();
    const optimisticNote: NoteItem = {
      id: tempId,
      title: formTitle.trim(),
      content: formContent.trim(),
      image_url: formPreview || undefined,
      created_at: editingNote?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Instant optimistic update
    if (editingNote) {
      setNotes((prev) => prev.map((n) => (n.id === editingNote.id ? optimisticNote : n)));
      showToast("Note updated successfully!");
    } else {
      setNotes((prev) => [optimisticNote, ...prev]);
      showToast("New note added!");
    }
    setModalOpen(false);

    try {
      const formData = new FormData();
      formData.append("title", formTitle.trim());
      formData.append("content", formContent.trim());
      if (formImage) formData.append("image", formImage);

      const isUserMode = !isAdmin || viewMode === "my";
      const endpoint = editingNote
        ? isUserMode ? `/my/notes/${editingNote.id}` : `/admin/notes/${editingNote.id}`
        : isUserMode ? "/my/notes" : "/admin/notes";

      if (editingNote) {
        await api.patch(endpoint, formData);
      } else {
        const { data } = await api.post(endpoint, formData);
        if (data && data.id) {
          setNotes((prev) => prev.map((n) => (n.id === tempId ? { ...n, id: data.id, ...data } : n)));
        }
      }
    } catch (err: any) {
      console.warn("Async note save note:", err);
    }
  };

  const deleteNote = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    // Instant optimistic removal
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast("Note deleted");
    if (viewNote?.id === id) setViewNote(null);

    try {
      const isUserMode = !isAdmin || viewMode === "my";
      const endpoint = isUserMode ? `/my/notes/${id}` : `/admin/notes/${id}`;
      await api.delete(endpoint);
    } catch (err: any) {
      console.warn("Async note delete note:", err);
    }
  };

  const notesQuota = quotas?.limits?.notes || { used: notes.length, max: 100 };
  const isMaxReached = notesQuota.max !== -1 && notesQuota.used >= notesQuota.max;

  const filtered = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Toast message={toastMessage} tone={toastTone} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#d9a441]/15 text-[#d9a441]">
            <StickyNote className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-cinzel text-[var(--text-color)]">
              {t("research_notes", "Research Notes")}
            </h1>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              Keep private research notes, records & historical citations attached to your lineage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold">
              <button
                onClick={() => setViewMode("my")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "my" ? "bg-white dark:bg-[#1a2e2d] shadow text-[#0d9488]" : "opacity-60"
                }`}
              >
                My Notes
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "all" ? "bg-white dark:bg-[#1a2e2d] shadow text-[#0d9488]" : "opacity-60"
                }`}
              >
                All System Notes
              </button>
            </div>
          )}

          <button
            onClick={openAddModal}
            disabled={isMaxReached}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0d9488]/90 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{t("add_note", "+ Add Note")}</span>
          </button>
        </div>
      </div>

      {/* Quotas & Bar */}
      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-gray-900 dark:text-white">
            Notes Created: <b className="text-[#d9a441]">{notesQuota.used}</b> / {notesQuota.max === -1 ? "∞" : notesQuota.max}
          </span>
          {notesQuota.max === 25 && (
            <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-[#0d9488] font-bold text-[10px]">
              Free Tier (Limit: 25 Notes)
            </span>
          )}
        </div>

        {isMaxReached && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-500 font-bold">Quota Reached (100/100)</span>
            <Link
              to="/admin/user-upgrade"
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs inline-flex items-center gap-1 shadow"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade Plan</span>
            </Link>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search research notes..."
          className="w-full ltr:pl-9 rtl:pr-9 pr-4 py-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d9488]/40"
        />
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d9a441]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-white/50 dark:bg-black/20 p-8 space-y-3">
          <StickyNote className="w-12 h-12 mx-auto text-gray-400 opacity-60" />
          <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">No notes found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Create private research notes to track family archives, document sources, and personal research ideas.
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d9488] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-5 shadow-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <div>
                {/* Image Preview Thumbnail if uploaded */}
                {note.image_url && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-[var(--border-color)] h-36 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={note.image_url}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setViewNote(note)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0d9488]"
                      title="View Full Note"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(note)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500"
                      title="Edit Note"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                {note.user_email && (
                  <span className="flex items-center gap-1 truncate max-w-[140px]" title={note.user_email}>
                    <User className="w-3.5 h-3.5" />
                    {note.user_email}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#1a2e2d] text-gray-900 dark:text-white p-6 shadow-2xl border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-bold text-lg font-cinzel text-[#0d9488]">
                {editingNote ? "Edit Note" : "+ Add Research Note"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">
                  Note Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Ottoman archives citation for Mohamed Ben Ali"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d9488]/40"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Content / Description</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write your research details, dates, or source references..."
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Upload Image */}
              <div>
                <label className="block font-bold mb-1">Attachment / Reference Image</label>
                <div className="flex items-center gap-4">
                  {formPreview ? (
                    <img
                      src={formPreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-[var(--border-color)]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      <ImagePlus className="w-6 h-6" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-stone-500/15 hover:bg-stone-500/25 font-bold transition"
                  >
                    {formPreview ? "Change Image" : "Upload File"}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
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
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0d9488] text-white font-bold inline-flex items-center gap-2 hover:bg-[#0d9488]/90 shadow transition-all"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{submitting ? "Saving..." : editingNote ? "Update Note" : "Save Note"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewNote && (
        <div
          className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setViewNote(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1a2e2d] text-gray-900 dark:text-white rounded-2xl border border-[var(--border-color)] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <h3 className="font-bold text-xl text-[#0d9488]">{viewNote.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Created on {new Date(viewNote.created_at).toLocaleDateString()} {viewNote.user_email ? `by ${viewNote.user_email}` : ""}
                </p>
              </div>
              <button
                onClick={() => setViewNote(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewNote.image_url && (
              <img
                src={viewNote.image_url}
                alt={viewNote.title}
                className="w-full rounded-xl border border-[var(--border-color)] max-h-[350px] object-cover"
              />
            )}

            <div className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {viewNote.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
