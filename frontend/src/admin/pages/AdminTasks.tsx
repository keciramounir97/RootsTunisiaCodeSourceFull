import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Search,
  ListChecks,
  Trash2,
  Check,
  User,
  Loader2,
  Plus,
  Edit3,
  X,
  ImagePlus,
  Eye,
  Crown,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useThemeStore } from "../../store/theme";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";
import Toast from "../../components/Toast";

interface TaskItem {
  id: number;
  title: string;
  description?: string;
  user_id: number;
  user_email?: string;
  status: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  image_url?: string;
  created_at: string;
}

export default function AdminTasks() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 1 || user?.role === 3;

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [quotas, setQuotas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "in_progress" | "done">("all");
  const [viewMode, setViewMode] = useState<"my" | "all">("my");

  const [viewTask, setViewTask] = useState<TaskItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStatus, setFormStatus] = useState<"todo" | "in_progress" | "done">("todo");
  const [formPriority, setFormPriority] = useState<"low" | "medium" | "high">("medium");
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

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin && viewMode === "all" ? "/admin/tasks" : "/my/tasks";
      const [tasksRes, quotasRes] = await Promise.allSettled([
        api.get(endpoint),
        api.get("/my/quotas"),
      ]);

      if (tasksRes.status === "fulfilled") {
        setTasks(Array.isArray(tasksRes.value.data) ? tasksRes.value.data : tasksRes.value.data?.data || []);
      }
      if (quotasRes.status === "fulfilled") {
        setQuotas(quotasRes.value.data?.data || quotasRes.value.data);
      }
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [viewMode]);

  const openAddModal = () => {
    setEditingTask(null);
    setFormTitle("");
    setFormDesc("");
    setFormStatus("todo");
    setFormPriority("medium");
    setFormImage(null);
    setFormPreview("");
    setModalOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description || "");
    setFormStatus(task.status);
    setFormPriority(task.priority || "medium");
    setFormImage(null);
    setFormPreview(task.image_url || "");
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
      showToast("Task title is required", "error");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", formTitle.trim());
      formData.append("description", formDesc.trim());
      formData.append("status", formStatus);
      formData.append("priority", formPriority);
      if (formImage) formData.append("image", formImage);

      const isUserMode = !isAdmin || viewMode === "my";
      const endpoint = editingTask
        ? isUserMode ? `/my/tasks/${editingTask.id}` : `/admin/tasks/${editingTask.id}`
        : isUserMode ? "/my/tasks" : "/admin/tasks";

      if (editingTask) {
        await api.patch(endpoint, formData);
        showToast("Task updated successfully!");
      } else {
        await api.post(endpoint, formData);
        showToast("New task created!");
      }

      setModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save task", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (task: TaskItem) => {
    const nextStatus: TaskItem["status"] =
      task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : "todo";

    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    try {
      const isUserMode = !isAdmin || viewMode === "my";
      const endpoint = isUserMode ? `/my/tasks/${task.id}` : `/admin/tasks/${task.id}`;
      await api.patch(endpoint, { status: nextStatus });
      showToast(`Task status updated to ${nextStatus.replace("_", " ")}`);
    } catch {
      fetchTasks();
    }
  };

  const deleteTask = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const isUserMode = !isAdmin || viewMode === "my";
      const endpoint = isUserMode ? `/my/tasks/${id}` : `/admin/tasks/${id}`;
      await api.delete(endpoint);
      showToast("Task deleted");
      if (viewTask?.id === id) setViewTask(null);
      fetchTasks();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Delete failed", "error");
    }
  };

  const tasksQuota = quotas?.limits?.tasks || { used: tasks.length, max: 100 };
  const isMaxReached = tasksQuota.max !== -1 && tasksQuota.used >= tasksQuota.max;

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TaskItem["status"]) => {
    switch (status) {
      case "todo":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            To Do
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            In Progress
          </span>
        );
      case "done":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green-500/15 text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            Done
          </span>
        );
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "high":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">High Priority</span>;
      case "medium":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Med Priority</span>;
      case "low":
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Low Priority</span>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Toast message={toastMessage} tone={toastTone} />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#d9a441]/15 text-[#d9a441]">
            <ListChecks className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-cinzel text-[var(--text-color)]">
              {t("research_tasks", "Research Tasks")}
            </h1>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              Track genealogy tasks e.g. "Find birth record", "Verify marriage", "Check civil registers".
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
                My Tasks
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "all" ? "bg-white dark:bg-[#1a2e2d] shadow text-[#0d9488]" : "opacity-60"
                }`}
              >
                All System Tasks
              </button>
            </div>
          )}

          <button
            onClick={openAddModal}
            disabled={isMaxReached}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0d9488]/90 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{t("add_task", "+ Add Task")}</span>
          </button>
        </div>
      </div>

      {/* Quotas & Limit Bar */}
      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-bold text-gray-900 dark:text-white">
            Tasks Created: <b className="text-[#d9a441]">{tasksQuota.used}</b> / {tasksQuota.max === -1 ? "∞" : tasksQuota.max}
          </span>
          {tasksQuota.max === 100 && (
            <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-[#0d9488] font-bold text-[10px]">
              Free Tier (Limit: 100 Tasks)
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

      {/* Controls Bar: Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold shrink-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === "all" ? "bg-white dark:bg-[#1a2e2d] shadow text-[#0d9488]" : "opacity-60"
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter("todo")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === "todo" ? "bg-white dark:bg-[#1a2e2d] shadow text-[#0d9488]" : "opacity-60"
            }`}
          >
            To Do ({tasks.filter((t) => t.status === "todo").length})
          </button>
          <button
            onClick={() => setStatusFilter("in_progress")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === "in_progress" ? "bg-white dark:bg-[#1a2e2d] shadow text-[#0d9488]" : "opacity-60"
            }`}
          >
            In Progress ({tasks.filter((t) => t.status === "in_progress").length})
          </button>
          <button
            onClick={() => setStatusFilter("done")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === "done" ? "bg-white dark:bg-[#1a2e2d] shadow text-[#0d9488]" : "opacity-60"
            }`}
          >
            Completed ({tasks.filter((t) => t.status === "done").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full ltr:pl-9 rtl:pr-9 pr-4 py-2.5 text-xs rounded-xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d9488]/40"
          />
        </div>
      </div>

      {/* Tasks List Grid */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d9a441]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-white/50 dark:bg-black/20 p-8 space-y-3">
          <ListChecks className="w-12 h-12 mx-auto text-gray-400 opacity-60" />
          <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">No tasks found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Organize your research action items e.g. "Obtain death certificate from Archives Nationales", "Verify birth year".
          </p>
          <button
            onClick={openAddModal}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d9488] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Task</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-5 shadow-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all relative overflow-hidden group"
            >
              <div>
                {/* Image Attachment Preview */}
                {task.image_url && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-[var(--border-color)] h-36 bg-gray-100 dark:bg-gray-800">
                    <img
                      src={task.image_url}
                      alt={task.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Status & Priority Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setViewTask(task)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#0d9488]"
                      title="View Task Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500"
                      title="Edit Task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1 mb-1">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Action & Footer */}
              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleStatus(task)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-[11px] font-bold text-gray-700 dark:text-gray-200 hover:bg-[#0d9488] hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  <span>Cycle Status</span>
                </button>

                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#1a2e2d] text-gray-900 dark:text-white p-6 shadow-2xl border border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-bold text-lg font-cinzel text-[#0d9488]">
                {editingTask ? "Edit Research Task" : "+ Add Research Task"}
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
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Find birth certificate for Mohamed Ben Ali"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0d9488]/40"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description / Notes</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Details, archive location, record reference..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e: any) => setFormPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              {/* Upload Image Attachment */}
              <div>
                <label className="block font-bold mb-1">Attachment Image</label>
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
                  <span>{submitting ? "Saving..." : editingTask ? "Update Task" : "Save Task"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Task Modal */}
      {viewTask && (
        <div
          className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setViewTask(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1a2e2d] text-gray-900 dark:text-white rounded-2xl border border-[var(--border-color)] p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(viewTask.status)}
                  {getPriorityBadge(viewTask.priority)}
                </div>
                <h3 className="font-bold text-xl text-[#0d9488]">{viewTask.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Created on {new Date(viewTask.created_at).toLocaleDateString()} {viewTask.user_email ? `by ${viewTask.user_email}` : ""}
                </p>
              </div>
              <button
                onClick={() => setViewTask(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewTask.image_url && (
              <img
                src={viewTask.image_url}
                alt={viewTask.title}
                className="w-full rounded-xl border border-[var(--border-color)] max-h-[350px] object-cover"
              />
            )}

            {viewTask.description && (
              <div className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {viewTask.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
