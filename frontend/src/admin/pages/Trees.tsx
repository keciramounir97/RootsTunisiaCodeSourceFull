import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  Archive,
  Download,
  Eye,
  FileEdit,
  FileText,
  FolderGit2,
  GitBranch,
  Lock,
  Network,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { useThemeStore } from "../../store/theme";

import { api } from "../../api/client";
import {
  getApiErrorMessage,
  getGedcomLoadErrorMessage,
  normalizeTree,
  requestWithFallback,
  shouldFallbackRoute,
} from "../../api/helpers";

import { useLanguage } from "../../i18n";

import Toast from "../../components/Toast";
import ErrorBoundary from "../../components/ErrorBoundary";

import TreesBuilder, {
  buildGedcom,
  buildGedcom7,
  parseGedcom,
  parseGedcomX,
  buildGedcomXJson,
  buildGedcomXXml,
} from "../components/TreesBuilder";

import { useAuth } from "../components/AuthContext";

const MAX_GEDCOM_BYTES = 50 * 1024 * 1024;

export default function Trees() {
  const { theme } = useThemeStore();
  const { language: locale, t } = useLanguage();
  const { user } = useAuth();

  const isDark = theme === "dark";
  const isAdmin = user?.role === 1 || user?.role === 3;

  const pageBg = isDark ? "bg-[#071827]" : "bg-[#f5f1e8]";
  const text = isDark ? "text-white" : "text-[#162238]";
  const card = isDark ? "bg-[#0f1f33]" : "bg-white";
  const border = isDark ? "border-[#1a3048]" : "border-[#e8e4dc]";
  const metaPanel = isDark
    ? "bg-[#1a3048]/50 border-[#1a3048]"
    : "bg-[#24766f]/5 border-[#e8e4dc]";

  const hoverRow = isDark ? "hover:bg-white/5" : "hover:bg-black/[0.02]";
  const inputBg = isDark ? "bg-[#0f1f33]" : "bg-white";
  const inputText = isDark ? "text-[#f8f5ef]" : "text-[#162238]";

  const [tab, setTab] = useState("my"); // my | public
  const [q, setQ] = useState("");
  const [myTrees, setMyTrees] = useState<any[]>([]);
  const [publicTrees, setPublicTrees] = useState<any[]>([]);
  const [loadingTrees, setLoadingTrees] = useState(true);
  const [treesError, setTreesError] = useState("");
  const [selectedTree, setSelectedTree] = useState<any>(null);
  const [selectedScope, setSelectedScope] = useState<any>(null); // "my" | "public" | null
  const [loadingGedcom, setLoadingGedcom] = useState(false);
  const [gedcomError, setGedcomError] = useState("");
  const [people, setPeople] = useState<any[]>([]);

  // TWO INDEPENDENT RIGHT-SIDE SIDEBAR DRAWERS
  const [treesListDrawerOpen, setTreesListDrawerOpen] = useState(false);
  const [treeFormDrawerOpen, setTreeFormDrawerOpen] = useState(false);

  const [drawerMode, setDrawerMode] = useState<"form" | "code">("form");
  const [gedcomCodeDraft, setGedcomCodeDraft] = useState("");
  const [saveFormat, setSaveFormat] = useState("gedcom");
  const [treeForm, setTreeForm] = useState({
    title: "",
    description: "",
    category: "",
    archiveSource: "",
    documentCode: "",
    isPublic: isAdmin,
    saveToDb: true,
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [autoSaveNotice, setAutoSaveNotice] = useState("");
  const [autoSaving, setAutoSaving] = useState(false);
  const [deletingTree, setDeletingTree] = useState(false);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSavePeopleRef = useRef<any[] | null>(null);
  const autoSaveInFlightRef = useRef(false);
  const peopleDirtyRef = useRef(false);

  const refreshLists = useCallback(async ({ notify = false } = {}) => {
    setLoadingTrees(true);
    setTreesError("");
    setSaveError("");

    const mergeById = (list: any[]) => {
      const map = new Map();
      list.forEach((t: any) => {
        if (!t) return;
        map.set(String(t.id), t);
      });
      return Array.from(map.values());
    };

    let loadError = "";

    try {
      const shouldFallbackAdminRead = (err: any) =>
        shouldFallbackRoute(err) ||
        err?.response?.status === 401 ||
        err?.response?.status === 403 ||
        err?.response?.status === 500;

      const myRequest = isAdmin
        ? () => api.get("/admin/trees")
        : () => api.get("/my/trees");

      const [mineRes, pubRes] = await Promise.allSettled([
        myRequest(),
        api.get("/trees"),
      ]);

      if (mineRes.status === "fulfilled") {
        const rawMine = mineRes.value?.data;
        const mineList = Array.isArray(rawMine) ? rawMine : Array.isArray(rawMine?.data) ? rawMine.data : [];
        const liveMine = mineList.map((t: any) =>
          normalizeTree(t, {
            isPublic: !!t?.is_public || !!t?.isPublic,
          }),
        );
        setMyTrees(mergeById(liveMine));
      }

      if (pubRes.status === "fulfilled") {
        const rawPub = pubRes.value?.data;
        const pubList = Array.isArray(rawPub) ? rawPub : Array.isArray(rawPub?.data) ? rawPub.data : [];
        const livePublic = pubList.map((t: any) => normalizeTree(t, { isPublic: true }));
        setPublicTrees(mergeById(livePublic));
      }

      const err =
        mineRes.status === "rejected"
          ? mineRes.reason
          : pubRes.status === "rejected"
          ? pubRes.reason
          : null;

      if (err) {
        loadError = getApiErrorMessage(err, "Failed to load trees");
        setTreesError(loadError);
        setSaveError(loadError);
      } else if (notify) {
        setSaveSuccess(t("legacy.trees_loaded", "Trees loaded."));
      }
    } finally {
      setLoadingTrees(false);
    }
  }, [isAdmin, t]);

  useEffect(() => {
    void refreshLists({ notify: true });
  }, [refreshLists]);

  useEffect(() => {
    if (!saveSuccess) return;
    const timer = setTimeout(() => setSaveSuccess(""), 3500);
    return () => clearTimeout(timer);
  }, [saveSuccess]);

  useEffect(() => {
    if (!saveError) return;
    const timer = setTimeout(() => setSaveError(""), 5000);
    return () => clearTimeout(timer);
  }, [saveError]);

  useEffect(() => {
    if (!autoSaveNotice) return;
    const timer = setTimeout(() => setAutoSaveNotice(""), 2500);
    return () => clearTimeout(timer);
  }, [autoSaveNotice]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedTree) {
      setTreeForm({
        title: "",
        description: "",
        category: "",
        archiveSource: "",
        documentCode: "",
        isPublic: isAdmin,
        saveToDb: false,
      });
      setSelectedScope(null);
      return;
    }

    setTreeForm({
      title: selectedTree.title || "",
      description: selectedTree.description || "",
      category: selectedTree.category || "",
      archiveSource: selectedTree.archiveSource || "",
      documentCode: selectedTree.documentCode || "",
      isPublic: !!selectedTree.isPublic,
      saveToDb: true,
    });
  }, [selectedTree, isAdmin]);

  useEffect(() => {
    autoSavePeopleRef.current = null;
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    peopleDirtyRef.current = false;
  }, [selectedTree?.id, tab]);

  const trees = tab === "public" ? publicTrees : myTrees;

  // STRICT TREE OWNERSHIP CHECK: A tree is updateable ONLY if the current user is the owner or an admin.
  const isOwner = useMemo(() => {
    if (!selectedTree || !user) return false;
    if (selectedScope === "my") return true;
    const treeOwnerId = selectedTree.owner_id || selectedTree.userId || selectedTree.user_id;
    if (treeOwnerId && user.id && String(treeOwnerId) === String(user.id)) return true;
    const treeOwnerEmail = typeof selectedTree.owner === "string" ? selectedTree.owner : selectedTree.owner?.email;
    if (treeOwnerEmail && user.email && treeOwnerEmail.toLowerCase() === user.email.toLowerCase()) return true;
    return false;
  }, [selectedTree, user, selectedScope]);

  const canUpdateSelected =
    selectedTree &&
    !String(selectedTree.id).startsWith("mock-") &&
    (isOwner || isAdmin);

  const builderReadOnly = !!selectedTree && !canUpdateSelected;

  const filteredTrees = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return trees;

    return trees.filter((tree) => {
      const title = String(tree.title || "").toLowerCase();
      const ownerRaw = tree.owner ?? tree.owner_name ?? "";
      const ownerValue =
        ownerRaw && typeof ownerRaw === "object"
          ? ownerRaw.fullName || ownerRaw.email || ""
          : ownerRaw || "";
      const owner = String(ownerValue).toLowerCase();

      return title.includes(query) || owner.includes(query);
    });
  }, [trees, q]);

  const upsertTree = (list: any[], patch: any) => {
    const id = String(patch?.id);
    const existing = list.find((t: any) => String(t?.id) === id) || null;
    const merged = existing ? { ...existing, ...patch } : patch;
    return [merged, ...list.filter((t: any) => String(t?.id) !== id)];
  };

  const applyTreeUpdate = ({
    id,
    title,
    description,
    category,
    isPublic,
    hasGedcom,
    archiveSource,
    documentCode,
    data_format,
  }: any) => {
    const patch: any = {
      id,
      title,
      description: description ?? "",
      category: category ?? "",
      archiveSource: archiveSource ?? "",
      documentCode: documentCode ?? "",
      isPublic: !!isPublic,
      updatedAt: new Date().toISOString(),
    };
    if (hasGedcom !== undefined) patch.hasGedcom = !!hasGedcom;
    if (data_format !== undefined) patch.data_format = data_format;

    setMyTrees((prev: any[]) => upsertTree(prev, patch));

    setPublicTrees((prev: any[]) => {
      const without = prev.filter((t: any) => String(t.id) !== String(id));
      if (!isPublic) return without;
      const existing = prev.find((t: any) => String(t.id) === String(id)) || {};
      return upsertTree(without, { ...existing, ...patch });
    });

    setSelectedTree((prev: any) => {
      if (!prev) return prev;
      if (String(prev.id) !== String(id)) return prev;
      return { ...prev, ...patch };
    });
  };

  const openTree = async (tree: any) => {
    setSelectedScope(tab);
    setSelectedTree(tree);
    peopleDirtyRef.current = false;
    setGedcomError("");
    setLoadingGedcom(true);

    try {
      if (String(tree.id).startsWith("mock-")) {
        const familyName = tree.title.split(" ").pop() || "El-Masry";
        const mockPeople = [
          {
            id: "m1",
            names: { en: `Mohamed ${familyName}`, ar: `محمد ${familyName}` },
            gender: "Male",
            birthYear: "1920",
            details: "The patriarch.",
            color: "#f8f5ef",
            children: ["m3", "m4"],
            spouse: "m2",
          },
          {
            id: "m2",
            names: { en: `Amina ${familyName}`, ar: `أمينة ${familyName}` },
            gender: "Female",
            birthYear: "1925",
            details: "Matriarch.",
            color: "#f8f5ef",
            children: ["m3", "m4"],
            spouse: "m1",
          },
          {
            id: "m3",
            names: { en: `Ahmed ${familyName}`, ar: `أحمد ${familyName}` },
            gender: "Male",
            birthYear: "1950",
            details: "Eldest son.",
            color: "#f8f5ef",
            father: "m1",
            mother: "m2",
            children: ["m5", "m6"],
            spouse: "s1",
          },
          {
            id: "m4",
            names: { en: `Fatima ${familyName}`, ar: `فاطمة ${familyName}` },
            gender: "Female",
            birthYear: "1955",
            details: "Daughter.",
            color: "#f8f5ef",
            father: "m1",
            mother: "m2",
            children: ["m7"],
            spouse: "s2",
          },
        ];

        setPeople(mockPeople);
        peopleDirtyRef.current = false;
        setSaveSuccess(t("legacy.tree_loaded", "Arbre chargé."));
        setLoadingGedcom(false);
        return;
      }

      const endpoint = isAdmin
        ? `/admin/trees/${tree.id}/gedcom`
        : tab === "public"
        ? `/trees/${tree.id}/gedcom`
        : `/my/trees/${tree.id}/gedcom`;

      let res: any;
      try {
        res = await api.get(endpoint, { responseType: "text" });
      } catch {
        res = await api.get(`/trees/${tree.id}/gedcom`, { responseType: "text" });
      }

      const raw =
        typeof res?.data === "string"
          ? res.data
          : res?.data && (res.data as any).data != null
          ? String((res.data as any).data)
          : "";

      if (!raw || raw.trim() === "" || raw.trim() === "0 HEAD\n1 GEDC\n2 VERS 5.5.1\n0 TRLR") {
        setPeople([]);
      } else {
        const isGedcomX = tree.data_format === "gedcomx" || /^\s*({|<\?xml)/.test(raw);
        const parsed = isGedcomX ? parseGedcomX(raw) : parseGedcom(raw);
        setPeople(Array.isArray(parsed) ? parsed : []);
      }

      peopleDirtyRef.current = false;
      setSaveSuccess(t("legacy.tree_loaded", "Arbre chargé."));
    } catch (err: any) {
      setPeople([]);
      const gedcomMessage = getGedcomLoadErrorMessage(
        err?.response?.status,
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || err?.message,
        getApiErrorMessage(err, "Failed to load tree file"),
      );

      setGedcomError(gedcomMessage);
      peopleDirtyRef.current = false;
      setSaveError(gedcomMessage);
    } finally {
      setLoadingGedcom(false);
    }
  };

  const submitTree = async ({
    treeId,
    title,
    description,
    category,
    archiveSource,
    documentCode,
    isPublic,
    people = [],
    includeFile = true,
  }: any) => {
    const safeTitle = String(title || "").trim();
    if (!safeTitle) throw new Error("Title is required");

    const fd = new FormData();
    fd.append("title", safeTitle);
    fd.append("description", String(description || ""));

    const categoryValue = String(category || "").trim();
    fd.append("category", categoryValue);

    const archiveValue = String(archiveSource || "").trim();
    if (archiveValue) fd.append("archiveSource", archiveValue);

    const documentValue = String(documentCode || "").trim();
    if (documentValue) fd.append("documentCode", documentValue);

    fd.append("isPublic", String(!!isPublic));

    if (includeFile) {
      const safePeople = Array.isArray(people) ? people : [];
      let content = "";
      let mime = "text/plain";
      let ext = "ged";
      try {
        if (saveFormat === "gedcom") {
          content = buildGedcom(safePeople, locale, t);
          mime = "text/plain";
          ext = "ged";
        } else if (saveFormat === "gedcom7") {
          content = buildGedcom7(safePeople, locale, t);
          mime = "text/plain";
          ext = "ged";
        } else {
          if (saveFormat === "gedcomx_json") {
            content = buildGedcomXJson(safePeople, locale, t);
            mime = "application/json";
            ext = "json";
          } else {
            content = buildGedcomXXml(safePeople, locale, t);
            mime = saveFormat === "gedcomx_gedx" ? "application/xml" : "application/xml";
            ext = saveFormat === "gedcomx_gedx" ? "gedx" : "xml";
          }
        }
      } catch (err: any) {
        throw new Error(
          err?.message ||
            (saveFormat === "gedcom7"
              ? t("legacy.gedcom7_build_failed", "Failed to build GEDCOM 7.0")
              : saveFormat === "gedcom"
                ? t("legacy.gedcom_build_failed", "Failed to build GEDCOM")
                : t("legacy.gedcomx_build_failed", "Failed to build GEDCOM X"))
        );
      }
      const blob = new Blob([content], { type: mime });
      if (blob.size > MAX_GEDCOM_BYTES) {
        throw new Error(t("legacy.file_too_large", "File is too large (max 50MB)."));
      }
      const fileName = `${safeTitle}.${ext}`;
      if (typeof File === "function") {
        const file = new File([blob], fileName, { type: mime });
        fd.append("file", file);
      } else {
        fd.append("file", blob, fileName);
      }
      if (saveFormat === "gedcom7") fd.append("dataFormat", "gedcom7");
      else if (saveFormat === "gedcom") fd.append("dataFormat", "gedcom");
      else if (saveFormat.startsWith("gedcomx")) fd.append("dataFormat", "gedcomx");
    }

    if (treeId) {
      const res = isAdmin
        ? await api.put(`/admin/trees/${treeId}`, fd)
        : await api.put(`/my/trees/${treeId}`, fd);
      const payload = res?.data;
      return payload?.data?.id ?? payload?.id ?? treeId;
    }

    const res = isAdmin
      ? await api.post("/admin/trees", fd)
      : await api.post("/my/trees", fd);

    const payload = res?.data;
    return payload?.data?.id ?? payload?.id ?? res?.id;
  };

  const downloadTreeFile = async (tree: any, scope?: string) => {
    if (!tree?.id) return;
    const endpoint =
      isAdmin
        ? `/admin/trees/${tree.id}/gedcom`
        : scope === "public"
        ? `/trees/${tree.id}/gedcom`
        : `/my/trees/${tree.id}/gedcom`;

    try {
      const res = await api.get(endpoint, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      let fileName = String(tree.title || "tree").trim() || "tree";
      fileName = fileName.replace(/[^\w.-]+/g, "_");
      const disp = res.headers?.["content-disposition"];
      if (disp && /filename[*]?=(?:UTF-8'')?"?([^";\n]+)"?/i.test(disp)) {
        const match = disp.match(/filename[*]?=(?:UTF-8'')?"?([^";\n]+)"?/i);
        if (match && match[1]) fileName = match[1].trim();
      } else {
        const ext = tree.data_format === "gedcomx" ? "gedx" : "ged";
        fileName = `${fileName}.${ext}`;
      }
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setSaveError(
        getApiErrorMessage(err, t("legacy.download_failed", "Download failed"))
      );
    }
  };

  const extractGedcomMetadata = (text: string) => {
    let title = "";
    let description = "";
    let source = "";
    let docCode = "";
    const lines = String(text || "").split(/\r?\n/);
    for (const l of lines) {
      const line = l.trim();
      if (!line) continue;
      if (line.startsWith("1 SOUR ") && !source) {
        source = line.replace(/^1 SOUR\s+/, "").trim();
      }
      if (line.startsWith("1 NOTE ") && !description) {
        description = line.replace(/^1 NOTE\s+/, "").trim();
      }
      if (line.startsWith("1 REFN ") && !docCode) {
        docCode = line.replace(/^1 REFN\s+/, "").trim();
      }
      if ((line.startsWith("1 NAME ") || line.startsWith("2 NAME ")) && !title) {
        const rawName = line.replace(/^[12] NAME\s+/, "").replace(/\//g, "").trim();
        if (rawName && rawName.toLowerCase() !== "unknown") {
          title = `Arbre Famille ${rawName}`;
        }
      }
    }
    return { title, description, source, docCode };
  };

  const runAutoSave = async () => {
    const pending = autoSavePeopleRef.current || people;
    if (!Array.isArray(pending) || pending.length === 0) return;
    if (autoSaveInFlightRef.current || saving) return;

    let targetTitle = String(treeForm.title || selectedTree?.title || "").trim();
    if (!targetTitle) {
      const firstPerson = pending[0];
      const pName = firstPerson
        ? (firstPerson.names?.fr || firstPerson.names?.en || firstPerson.name || `${firstPerson.given || ""} ${firstPerson.surname || ""}`.trim())
        : "";
      targetTitle = pName ? `Arbre ${pName}` : `Arbre Généalogique ${new Date().toLocaleDateString()}`;
      setTreeForm((s) => ({ ...s, title: targetTitle }));
    }

    const nextDescription =
      treeForm.description !== undefined && treeForm.description !== null
        ? String(treeForm.description)
        : String(selectedTree?.description || "");

    const nextIsPublic =
      treeForm.isPublic !== undefined && treeForm.isPublic !== null
        ? !!treeForm.isPublic
        : (selectedTree ? !!selectedTree.isPublic : !!isAdmin);

    autoSaveInFlightRef.current = true;
    setAutoSaving(true);
    setSaveError("");

    try {
      const nextDataFormat =
        saveFormat === "gedcom"
          ? "gedcom"
          : saveFormat === "gedcom7"
          ? "gedcom7"
          : "gedcomx";

      const treeId = await submitTree({
        treeId: selectedTree?.id || null,
        title: targetTitle,
        description: nextDescription,
        category: treeForm.category || "",
        archiveSource: treeForm.archiveSource || "",
        documentCode: treeForm.documentCode || "",
        isPublic: nextIsPublic,
        people: pending,
        includeFile: true,
      });

      if (treeId) {
        const updatedTreeObj = {
          id: treeId,
          title: targetTitle,
          description: nextDescription,
          category: treeForm.category || "",
          archiveSource: treeForm.archiveSource || "",
          documentCode: treeForm.documentCode || "",
          isPublic: nextIsPublic,
          hasGedcom: true,
          data_format: nextDataFormat,
        };

        if (!selectedTree) {
          setSelectedTree(updatedTreeObj);
          setSelectedScope("my");
        } else {
          applyTreeUpdate(updatedTreeObj);
        }

        setAutoSaveNotice(t("legacy.auto_saved", "Auto-sauvegardé."));
        peopleDirtyRef.current = false;
        autoSavePeopleRef.current = null;
        refreshLists();
      }
    } catch (err) {
      console.warn("Auto-save note:", err);
    } finally {
      autoSaveInFlightRef.current = false;
      setAutoSaving(false);
    }
  };

  const scheduleAutoSave = (nextPeople: any[]) => {
    peopleDirtyRef.current = true;
    autoSavePeopleRef.current = nextPeople;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      void runAutoSave();
    }, 600);
  };

  const clearCanvas = () => {
    setSelectedTree(null);
    setSelectedScope(null);
    setPeople([]);
    setGedcomError("");
    setGedcomCodeDraft("");
    peopleDirtyRef.current = false;
  };

  const openNewTreeForm = () => {
    clearCanvas();
    setTreeFormDrawerOpen(true);
    setTreesListDrawerOpen(false);
  };

  const saveCurrentAsTree = async () => {
    if (selectedTree && !canUpdateSelected) {
      setSaveError(t("legacy.cannot_edit_others_tree", "You cannot edit a tree that is not yours."));
      return;
    }

    setSaveError("");
    setSaveSuccess("");
    const isUpdateMode = Boolean(canUpdateSelected && selectedTree?.id);
    const hasPeople = people.length > 0;

    let title = String(treeForm.title || "").trim();
    if (!title && selectedTree?.title) title = String(selectedTree.title).trim();
    if (!title) title = "Arbre Généalogique Familial";

    if (!treeForm.saveToDb) {
      setTreeForm((prev) => ({ ...prev, saveToDb: true }));
    }

    if (!hasPeople && !isUpdateMode) {
      const confirmed = window.confirm(
        t("legacy.save_empty_tree_confirm", "Save this tree without any people yet?")
      );
      if (!confirmed) return;
    }

    const description = String(treeForm.description || "");
    const isPublic = !!treeForm.isPublic;

    setSaving(true);

    try {
      const includeFile = hasPeople || isUpdateMode;
      const nextHasGedcom = hasPeople;

      const treeId = await submitTree({
        treeId: canUpdateSelected ? selectedTree?.id : null,
        title,
        description,
        category: treeForm.category || "",
        archiveSource: treeForm.archiveSource || "",
        documentCode: treeForm.documentCode || "",
        isPublic,
        people,
        includeFile,
      });

      if (treeId) {
        const nextDataFormat = includeFile
          ? (saveFormat === "gedcom" ? "gedcom" : saveFormat === "gedcom7" ? "gedcom7" : "gedcomx")
          : selectedTree?.data_format;
        applyTreeUpdate({
          id: treeId,
          title,
          description,
          category: treeForm.category || "",
          archiveSource: treeForm.archiveSource || "",
          documentCode: treeForm.documentCode || "",
          isPublic,
          hasGedcom: nextHasGedcom,
          data_format: nextDataFormat,
        });

        setTab("my");
        setSaveSuccess(
          t(
            isUpdateMode ? "tree_updated" : "tree_saved",
            isUpdateMode ? "Tree updated." : "Tree saved."
          )
        );

        if (!canUpdateSelected) {
          const nextDataFormat = includeFile
            ? (saveFormat === "gedcom" ? "gedcom" : saveFormat === "gedcom7" ? "gedcom7" : "gedcomx")
            : undefined;
          setSelectedTree({
            id: treeId,
            title,
            description,
            category: treeForm.category || "",
            archiveSource: treeForm.archiveSource || "",
            documentCode: treeForm.documentCode || "",
            isPublic,
            hasGedcom: nextHasGedcom,
            data_format: nextDataFormat,
          });
          setSelectedScope("my");
        }
        peopleDirtyRef.current = false;
        setTreeFormDrawerOpen(false);
      }
      await refreshLists();
    } catch (err) {
      setSaveError(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const deleteTree = async () => {
    if (!canUpdateSelected || !selectedTree) {
      setSaveError(t("legacy.cannot_delete_others_tree", "You cannot delete a tree that is not yours."));
      return;
    }

    const shouldDelete = window.confirm(
      t("legacy.confirm_delete_tree", "Delete this tree? This action cannot be undone.")
    );
    if (!shouldDelete) return;

    const deletedId = selectedTree.id;
    setDeletingTree(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      if (isAdmin) {
        await api.delete(`/admin/trees/${selectedTree.id}`);
      } else {
        await api.delete(`/my/trees/${selectedTree.id}`);
      }

      setMyTrees((prev) => prev.filter((t) => String(t.id) !== String(deletedId)));
      setPublicTrees((prev) => prev.filter((t) => String(t.id) !== String(deletedId)));
      setSelectedTree(null);
      setSelectedScope(null);
      setPeople([]);
      peopleDirtyRef.current = false;
      await refreshLists();
      setTab("my");
      setTreeFormDrawerOpen(false);
      setSaveSuccess(t("legacy.tree_deleted", "Tree deleted."));
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setMyTrees((prev) => prev.filter((t) => String(t.id) !== String(deletedId)));
        setPublicTrees((prev) => prev.filter((t) => String(t.id) !== String(deletedId)));
        setSelectedTree(null);
        setSelectedScope(null);
        setPeople([]);
        peopleDirtyRef.current = false;
        await refreshLists();
        setTab("my");
        setTreeFormDrawerOpen(false);
        setSaveSuccess(t("legacy.tree_deleted", "Tree deleted."));
        return;
      }
      setSaveError(
        getApiErrorMessage(err, t("legacy.delete_failed", "Delete failed"))
      );
    } finally {
      setDeletingTree(false);
    }
  };

  const saveToast = saveError || saveSuccess;
  const saveToastTone = saveError ? "error" : "success";

  return (
    <div className={`p-4 min-h-screen ${pageBg} ${text} heritage-page-root relative`}>
      <Toast message={saveToast} tone={saveToastTone} />

      {/* TOP HEADER / ACTION BAR */}
      <div
        className={`rounded-xl p-5 mb-5 border ${border} bg-gradient-to-r from-[#0f2742]/15 to-[#24766f]/15 heritage-panel heritage-panel--accent shadow-md`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#24766f]/20 border border-[#24766f]/30">
              <Network className="w-6 h-6 text-[#0d9488]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-cinzel text-[#0c4a6e] dark:text-[#0d9488]">
                {t("legacy.trees_builder", "Family Tree Builder")}
              </h3>
              <p className="opacity-75 text-xs sm:text-sm">
                {t("legacy.trees_builder_desc",
                  "Public trees are visible to everyone; private trees are only for you.",
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* LIVE AUTO-SAVE BADGE */}
            {autoSaving ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold animate-pulse">
                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                <span>{t("legacy.auto_saving", "Sauvegarde automatique...")}</span>
              </div>
            ) : autoSaveNotice ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{autoSaveNotice}</span>
              </div>
            ) : null}

            {/* BUTTON 1: SEE MY TREES (Opens Trees List Sidebar Drawer) */}
            <button
              type="button"
              onClick={() => {
                setTreesListDrawerOpen((o) => !o);
                setTreeFormDrawerOpen(false);
              }}
              className="interactive-btn btn-neu btn-neu--primary px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
              title={t("legacy.see_my_trees", "See My Trees")}
            >
              <Eye className="w-4 h-4 text-white" />
              <span>{t("legacy.see_my_trees", "See My Trees")}</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-extrabold">
                {myTrees.length}
              </span>
            </button>

            {/* BUTTON 2: PERMANENT "+ ADD TREE" BUTTON (Opens Tree Form Sidebar Drawer for New Tree) */}
            <button
              type="button"
              onClick={openNewTreeForm}
              className="interactive-btn btn-neu px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 border border-[#0d9488]/50 bg-[#0d9488]/10 text-[#0d9488] dark:text-[#5eead4] hover:bg-[#0d9488]/20 transition-all shadow-sm"
              title={t("legacy.add_tree", "Add Tree")}
            >
              <Plus className="w-4 h-4 text-[#0d9488] dark:text-[#5eead4]" />
              <span>{t("legacy.add_tree", "Add Tree")}</span>
            </button>

            {/* BUTTON 3: "EDIT TREE" BUTTON (Visible ONLY when a tree is loaded AND user is owner / can update) */}
            {canUpdateSelected && (
              <button
                type="button"
                onClick={() => {
                  setTreeFormDrawerOpen(true);
                  setTreesListDrawerOpen(false);
                }}
                className="interactive-btn btn-neu px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 border border-[#d9a441]/50 bg-[#d9a441]/10 text-[#d9a441] hover:bg-[#d9a441]/20 transition-all shadow-sm"
                title={t("legacy.edit_tree", "Edit Tree")}
              >
                <FileEdit className="w-4 h-4 text-[#d9a441]" />
                <span>{t("legacy.edit_tree", "Edit Tree")}</span>
              </button>
            )}

            {/* READ-ONLY BADGE IF TREE BELONGS TO ANOTHER USER */}
            {selectedTree && !canUpdateSelected && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>{t("legacy.read_only_tree", "Read-Only (Public Tree)")}</span>
              </div>
            )}

            <button
              type="button"
              className={`px-4 py-2.5 rounded-lg border ${border} hover:bg-stone-500/10 inline-flex items-center gap-2 text-xs font-semibold transition`}
              onClick={() => void refreshLists({ notify: true })}
              disabled={loadingTrees}
            >
              <RefreshCcw className="w-4 h-4 text-[#0d9488]" />
              {t("legacy.refresh", "Refresh")}
            </button>
          </div>
        </div>

        {treesError || gedcomError ? (
          <div className={`mt-4 rounded-lg border ${border} ${card} p-4 heritage-panel`}>
            {treesError ? (
              <div className="text-red-500 font-semibold">{treesError}</div>
            ) : null}
            {gedcomError ? (
              <div className="text-red-500 font-semibold">{gedcomError}</div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* FULL WIDTH TREE BUILDER CANVAS */}
      <div className={`rounded-2xl border ${border} ${card} p-5 shadow-xl heritage-panel relative w-full`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#0d9488]/20 pb-3">
          <div>
            <div className={`text-xl font-bold font-cinzel flex items-center gap-2 ${isDark ? "text-[#0d9488]" : "text-[#0c4a6e]"}`}>
              <span>{selectedTree ? selectedTree.title : t("legacy.canvas", "Family Tree Canvas")}</span>
              {selectedTree && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  canUpdateSelected ? "border-[#0d9488]/30 bg-[#0d9488]/10 text-[#0d9488]" : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                }`}>
                  {canUpdateSelected ? t("legacy.my_tree_badge", "Your Tree") : t("legacy.read_only_badge", "Read-Only Public Tree")}
                </span>
              )}
            </div>
            <div className={`text-xs opacity-70 mt-0.5 ${inputText}`}>
              {selectedTree
                ? (selectedTree.description || t("legacy.active_tree", "Currently active tree.")) + (canUpdateSelected ? "" : " (You are viewing another user's public tree - read-only mode)")
                : t("legacy.canvas_hint", "Click 'See My Trees' to load a tree or '+ Add Tree' to create one.")}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCanvas}
              className="interactive-btn btn-neu px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5 border border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold transition rounded-lg shadow-xs"
              title={t("legacy.clear_canvas", "Vider le canevas")}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>{t("legacy.clear_canvas", "Vider le canevas")}</span>
            </button>
          </div>
        </div>

        <ErrorBoundary
          fallback={({ error, reset }) => (
            <div className={`rounded-lg border ${border} ${metaPanel} p-4`}>
              <div className="font-semibold text-red-500">
                {t("legacy.tree_builder_error", "Tree builder failed to load.")}
              </div>
              <div className="text-sm opacity-70">
                {error?.message || t("legacy.tree_builder_try_again", "Please try again.")}
              </div>
              <button
                type="button"
                onClick={reset}
                className={`mt-3 inline-flex items-center rounded-md border ${border} px-3 py-1 text-xs font-semibold uppercase tracking-wide`}
              >
                {t("legacy.retry", "Retry")}
              </button>
            </div>
          )}
        >
          <TreesBuilder
            people={people}
            setPeople={setPeople}
            dataFormat={
              selectedTree?.data_format === "gedcomx"
                ? "gedcomx"
                : selectedTree?.data_format === "gedcom7"
                  ? "gedcom7"
                  : "gedcom"
            }
            onAutoSave={scheduleAutoSave}
            readOnly={builderReadOnly}
          />
        </ErrorBoundary>
      </div>

      {/* DRAWER 1: TREES LIST SIDEBAR (Triggered by "See My Trees") */}
      {treesListDrawerOpen ? createPortal(
        <div
          className="fixed inset-0 z-[2200] flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setTreesListDrawerOpen(false)}
        >
          <div
            className={`w-full sm:w-[460px] h-full max-h-screen flex flex-col ${card} ${inputText} border-l ${border} shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className={`flex shrink-0 items-center justify-between border-b ${border} px-6 py-4 ${isDark ? "bg-[#071827]" : "bg-[#f8f5ef]"}`}>
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#0d9488]" />
                <h3 className="font-cinzel font-bold text-lg text-[#0c4a6e] dark:text-[#0d9488]">
                  {t("legacy.see_my_trees", "See My Trees")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTreesListDrawerOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-500/10 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
              {/* TABS: MY TREES vs PUBLIC TREES */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition ${
                    tab === "my"
                      ? "bg-[#0d9488] text-white border-[#0d9488] shadow-md"
                      : `${border} ${hoverRow} opacity-80`
                  }`}
                  onClick={() => setTab("my")}
                >
                  {t("legacy.my_trees", "My Trees")} ({myTrees.length})
                </button>

                <button
                  type="button"
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition ${
                    tab === "public"
                      ? "bg-[#0d9488] text-white border-[#0d9488] shadow-md"
                      : `${border} ${hoverRow} opacity-80`
                  }`}
                  onClick={() => setTab("public")}
                >
                  {t("legacy.public_trees", "Public Trees")} ({publicTrees.length})
                </button>
              </div>

              {/* SEARCH FILTER */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className={`w-full ltr:pl-8 rtl:pr-8 px-3 py-2 text-xs rounded-lg border ${border} ${inputBg} ${inputText}`}
                  placeholder={t("legacy.search_trees", "Search trees...")}
                />
              </div>

              {/* TREES LIST */}
              {loadingTrees ? (
                <div className="py-8 text-center text-xs opacity-70">
                  {t("legacy.loading", "Loading trees...")}
                </div>
              ) : filteredTrees.length === 0 ? (
                <div className="py-8 text-center text-xs opacity-70">
                  {t("legacy.no_trees_found", "No trees found.")}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTrees.map((tree) => {
                    const active = selectedTree?.id === tree.id;
                    const canDownload = Number.isFinite(Number(tree.id)) && tree.hasGedcom;

                    const isTreeOwned = tab === "my" || isAdmin || (user?.id && (String(tree.owner_id || tree.userId || tree.user_id) === String(user.id)));

                    return (
                      <div
                        key={tree.id}
                        onClick={() => {
                          void openTree(tree);
                          setTreesListDrawerOpen(false);
                        }}
                        className={`p-4 rounded-xl border ${border} ${card} shadow-sm hover:border-[#0d9488]/50 transition-all cursor-pointer ${
                          active ? "ring-2 ring-[#0d9488] bg-[#0d9488]/10" : hoverRow
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm truncate text-[#0c4a6e] dark:text-[#0d9488]">
                              {tree.title}
                            </h4>
                            <p className="text-[11px] opacity-70">
                              {tree.owner || t("legacy.unknown", "Unknown")}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#0d9488]/30 bg-[#0d9488]/10 text-[#0d9488]">
                              {tree.isPublic ? t("legacy.public", "Public") : t("legacy.private", "Private")}
                            </span>
                            {!isTreeOwned && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                Read-Only
                              </span>
                            )}
                          </div>
                        </div>

                        {tree.description && (
                          <p className="text-xs opacity-75 line-clamp-2 mb-2">
                            {tree.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2.5 border-t border-[#0d9488]/15 text-[11px]">
                          <span className="opacity-70">
                            {tree.hasGedcom ? t("legacy.has_file", "GEDCOM Available") : t("legacy.no_file", "No File")}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                void openTree(tree);
                                setTreesListDrawerOpen(false);
                              }}
                              className="px-3 py-1 rounded bg-[#0d9488]/15 hover:bg-[#0d9488]/25 text-[#0d9488] font-bold text-[11px] transition inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {t("legacy.view_tree", "Select & View")}
                            </button>

                            {canDownload && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void downloadTreeFile(tree, tab);
                                }}
                                className="px-2 py-1 rounded bg-stone-500/15 hover:bg-stone-500/25 text-stone-300 font-semibold transition"
                                title={t("legacy.download", "Download")}
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {/* DRAWER 2: TREE FORM SIDEBAR (Triggered by "+ Add Tree" or "Edit Tree") */}
      {treeFormDrawerOpen ? createPortal(
        <div
          className="fixed inset-0 z-[2200] flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setTreeFormDrawerOpen(false)}
        >
          <div
            className={`w-full sm:w-[460px] h-full max-h-screen flex flex-col ${card} ${inputText} border-l ${border} shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* DRAWER HEADER WITH MODE SWITCHER */}
            <div className={`p-5 border-b ${border} flex flex-col gap-3 bg-[#0d9488]/10`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#0c4a6e] dark:text-[#0d9488] font-bold">
                  {selectedTree ? <FileEdit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  <span className="text-sm">
                    {canUpdateSelected && selectedTree
                      ? `${t("legacy.edit_tree", "Edit Tree")}: ${selectedTree.title || "#" + selectedTree.id}`
                      : t("legacy.create_tree", "Create New Family Tree")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTreeFormDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-500/10 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* TABS: FORMULAIRE vs CODE GEDCOM DIRECT */}
              <div className="flex items-center p-1 rounded-lg bg-black/10 dark:bg-white/5 border border-[#0d9488]/20 text-xs">
                <button
                  type="button"
                  onClick={() => setDrawerMode("form")}
                  className={`flex-1 py-1.5 px-3 rounded-md font-bold transition-all text-center ${
                    drawerMode === "form"
                      ? "bg-[#0d9488] text-white shadow-sm"
                      : "text-stone-500 hover:text-[#0d9488]"
                  }`}
                >
                  {t("legacy.form_mode", "1. Formulaire")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerMode("code");
                    if (!gedcomCodeDraft && people.length > 0) {
                      setGedcomCodeDraft(buildGedcom(people));
                    }
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-md font-bold transition-all text-center ${
                    drawerMode === "code"
                      ? "bg-[#0d9488] text-white shadow-sm"
                      : "text-stone-500 hover:text-[#0d9488]"
                  }`}
                >
                  {t("legacy.code_mode", "2. Code GEDCOM Direct")}
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* IF SELECTED TREE IS NOT OWNED, SHOW READ ONLY WARNING */}
              {selectedTree && !canUpdateSelected ? (
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Lock className="w-4 h-4" />
                    <span>{t("legacy.cannot_edit_others_title", "Read-Only Public Tree")}</span>
                  </div>
                  <p>
                    {t("legacy.cannot_edit_others_desc", "This tree belongs to another user. You can view its family connections on the canvas, but you cannot edit or save changes to it.")}
                  </p>
                  <button
                    type="button"
                    onClick={openNewTreeForm}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-[#0d9488] text-white text-xs font-bold hover:bg-[#0d9488]/90 transition"
                  >
                    + {t("legacy.create_your_own_tree", "Create Your Own Tree")}
                  </button>
                </div>
              ) : drawerMode === "code" ? (
                /* DIRECT GEDCOM CODE EDITOR TAB */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0c4a6e] dark:text-[#0d9488]">
                      {t("legacy.gedcom_code_editor", "Éditeur de Code GEDCOM (5.5.1 / 7.0)")}
                    </span>
                    <span className="text-[11px] opacity-75">
                      {people.length} {t("legacy.individuals_count", "individus synchronisés")}
                    </span>
                  </div>
                  <textarea
                    value={gedcomCodeDraft}
                    onChange={(e) => {
                      const code = e.target.value;
                      setGedcomCodeDraft(code);
                      if (code.trim().length > 10) {
                        try {
                          const parsed = parseGedcom(code);
                          if (Array.isArray(parsed) && parsed.length > 0) {
                            setPeople(parsed);
                            const meta = extractGedcomMetadata(code);
                            if (meta.title && !treeForm.title) {
                              setTreeForm((s) => ({ ...s, title: meta.title }));
                            }
                            if (meta.source && !treeForm.archiveSource) {
                              setTreeForm((s) => ({ ...s, archiveSource: meta.source }));
                            }
                            if (meta.description && !treeForm.description) {
                              setTreeForm((s) => ({ ...s, description: meta.description }));
                            }
                            scheduleAutoSave(parsed);
                          }
                        } catch (err) {}
                      }
                    }}
                    placeholder={`0 HEAD\n1 SOUR RootsTunisia\n1 GEDC\n2 VERS 5.5.1\n0 @I1@ INDI\n1 NAME Prénom /Nom/\n1 SEX M\n1 BIRT\n2 DATE 1950\n0 TRLR`}
                    rows={16}
                    className={`w-full p-4 font-mono text-[11px] leading-relaxed rounded-xl border ${border} ${inputBg} ${inputText} focus:ring-2 focus:ring-[#0d9488]/40 resize-none shadow-inner`}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          const parsed = parseGedcom(gedcomCodeDraft);
                          if (Array.isArray(parsed) && parsed.length > 0) {
                            setPeople(parsed);
                            const meta = extractGedcomMetadata(gedcomCodeDraft);
                            if (meta.title) setTreeForm((s) => ({ ...s, title: meta.title }));
                            if (meta.source) setTreeForm((s) => ({ ...s, archiveSource: meta.source }));
                            if (meta.description) setTreeForm((s) => ({ ...s, description: meta.description }));
                            void saveCurrentAsTree();
                            setSaveSuccess(t("legacy.gedcom_synced", "GEDCOM code parsed and synchronized with canvas!"));
                          } else {
                            setSaveError("No valid individual records found in the provided GEDCOM text.");
                          }
                        } catch (err) {
                          setSaveError("Invalid GEDCOM syntax.");
                        }
                      }}
                      className="interactive-btn btn-neu btn-neu--primary px-4 py-2.5 text-xs font-bold flex-1 inline-flex items-center justify-center gap-2 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>{t("legacy.apply_and_sync", "Appliquer au canevas & Enregistrer")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM MODE TAB */
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#0c4a6e] dark:text-[#0d9488] mb-1">
                      {t("legacy.tree_title", "Tree title")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={treeForm.title}
                      onChange={(e) => setTreeForm((s) => ({ ...s, title: e.target.value }))}
                      placeholder={t("legacy.tree_title", "e.g. Famille Ben Mohamed")}
                      className={`w-full px-4 py-2.5 text-xs rounded-lg border ${border} ${inputBg} ${inputText} focus:ring-2 focus:ring-[#0d9488]/40`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0c4a6e] dark:text-[#0d9488] mb-1">
                        {t("legacy.custom_category", "Category")}
                      </label>
                      <input
                        value={treeForm.category}
                        onChange={(e) => setTreeForm((s) => ({ ...s, category: e.target.value }))}
                        placeholder="e.g. Royal / Family"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${border} ${inputBg} ${inputText}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0c4a6e] dark:text-[#0d9488] mb-1">
                        {t("legacy.save_file_as", "Save Format")}
                      </label>
                      <select
                        value={saveFormat}
                        onChange={(e) => setSaveFormat(e.target.value)}
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${border} ${inputBg} ${inputText}`}
                      >
                        <option value="gedcom">{t("legacy.gedcom_format_551", "GEDCOM 5.5.1")}</option>
                        <option value="gedcom7">{t("legacy.format_gedcom7", "GEDCOM 7.0")}</option>
                        <option value="gedcomx_json">{t("legacy.gedcomx_format_json", "GEDCOM X (JSON)")}</option>
                        <option value="gedcomx_xml">{t("legacy.gedcomx_format_xml", "GEDCOM X (XML)")}</option>
                        <option value="gedcomx_gedx">{t("legacy.gedcomx_format_gedx", "GEDCOM X (.gedx)")}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0c4a6e] dark:text-[#0d9488] mb-1">
                      {t("legacy.description", "Description")}
                    </label>
                    <textarea
                      value={treeForm.description}
                      onChange={(e) => setTreeForm((s) => ({ ...s, description: e.target.value }))}
                      placeholder={t("legacy.description", "Description (optional)")}
                      rows={3}
                      className={`w-full px-4 py-2.5 text-xs rounded-lg border ${border} ${inputBg} ${inputText} resize-none`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0c4a6e] dark:text-[#0d9488] mb-1">
                        {t("legacy.archive_source", "Archive Source")}
                      </label>
                      <input
                        value={treeForm.archiveSource}
                        onChange={(e) => setTreeForm((s) => ({ ...s, archiveSource: e.target.value }))}
                        placeholder="Archives..."
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${border} ${inputBg} ${inputText}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0c4a6e] dark:text-[#0d9488] mb-1">
                        {t("legacy.document_code", "Document Code")}
                      </label>
                      <input
                        value={treeForm.documentCode}
                        onChange={(e) => setTreeForm((s) => ({ ...s, documentCode: e.target.value }))}
                        placeholder="DOC-12345"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-lg border ${border} ${inputBg} ${inputText}`}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-[#0d9488]/30 bg-[#0d9488]/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={treeForm.isPublic}
                      onChange={(e) => setTreeForm((s) => ({ ...s, isPublic: e.target.checked }))}
                      className="h-4 w-4 rounded accent-[#0d9488]"
                    />
                    <span className="text-xs font-bold">
                      {treeForm.isPublic ? t("legacy.public", "Public Tree") : t("legacy.private", "Private Tree")}
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-lg border border-[#0d9488]/40 bg-[#0d9488]/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={treeForm.saveToDb}
                      onChange={(e) => setTreeForm((s) => ({ ...s, saveToDb: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 rounded accent-[#0d9488]"
                    />
                    <div className="text-xs">
                      <span className="font-bold">{t("legacy.save_to_db_label", "Save this tree to the database")} *</span>
                      <span className="block opacity-75 mt-0.5">
                        {t("legacy.save_to_db_hint", "Stores the tree structure and data safely in the database.")}
                      </span>
                    </div>
                  </label>

                  {/* FOOTER ACTIONS */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#0d9488]/20">
                    <button
                      type="button"
                      onClick={() => void saveCurrentAsTree()}
                      disabled={saving || loadingGedcom || deletingTree || !treeForm.saveToDb}
                      className="interactive-btn btn-neu btn-neu--primary px-5 py-2.5 text-xs font-bold flex-1 inline-flex items-center justify-center gap-2 shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      {saving
                        ? t("legacy.saving", "Saving...")
                        : canUpdateSelected
                          ? t("legacy.update_tree", "Update Tree")
                          : t("legacy.save_tree", "Save Tree")}
                    </button>

                    <button
                      type="button"
                      onClick={clearCanvas}
                      disabled={saving || loadingGedcom}
                      className="interactive-btn btn-neu px-4 py-2.5 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("legacy.clear", "Clear")}
                    </button>

                    {canUpdateSelected && selectedTree ? (
                      <button
                        type="button"
                        onClick={() => void deleteTree()}
                        disabled={saving || deletingTree}
                        className="interactive-btn btn-neu px-4 py-2.5 text-xs font-semibold text-red-500 border border-red-500/40 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingTree ? t("legacy.deleting", "Deleting...") : t("legacy.delete", "Delete")}
                      </button>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      ) : null}

    </div>
  );
}
